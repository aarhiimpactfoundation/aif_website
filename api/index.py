from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.responses import PlainTextResponse, Response, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os
import logging
import re
import hmac
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt
import resend
import razorpay
from collections import defaultdict
import time
import threading

# MongoDB connection - using environment variables
mongo_url = os.environ.get('MONGO_URL', '')
db_name = os.environ.get('DB_NAME', 'aarhi_db')
_client = None
_db = None
_lock = threading.Lock()

def get_db():
    global _client, _db
    if _db is None:
        with _lock:
            if _db is None:
                _client = MongoClient(mongo_url)
                _db = _client[db_name]
    return _db

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'notifications@aarhiimpactfoundation.org')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'info@aarhiimpactfoundation.org')

# Razorpay configuration
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '')
razorpay_client = (
    razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET else None
)

# JWT configuration
JWT_SECRET = os.environ.get('JWT_SECRET', '')
JWT_ALGORITHM = 'HS256'
if not JWT_SECRET:
    logging.critical("JWT_SECRET is not set. Admin authentication will be disabled until it is configured.")

# Rate limiting storage
rate_limit_storage = defaultdict(list)
RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX_REQUESTS = 10

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI(
    title="Aarhi Impact Foundation API",
    docs_url=None,
    redoc_url=None,
    openapi_url=None if os.environ.get('ENVIRONMENT') == 'production' else "/openapi.json"
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Only truly unhandled exceptions reach here — HTTPException (our normal
    # 400/401/403/404/429/503 responses) is handled by FastAPI's own default
    # handler first, since it's more specific. This exists so any future crash
    # is immediately visible in the response itself, not just buried in logs.
    logger.exception(f"Unhandled exception on {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"{type(exc).__name__}: {str(exc)}"}
    )

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)

# ============== SECURITY HELPERS ==============

def check_rate_limit(ip: str, limit: int = RATE_LIMIT_MAX_REQUESTS) -> bool:
    now = time.time()
    rate_limit_storage[ip] = [t for t in rate_limit_storage[ip] if now - t < RATE_LIMIT_WINDOW]
    if len(rate_limit_storage[ip]) >= limit:
        return False
    rate_limit_storage[ip].append(now)
    return True

# ============== MODELS ==============

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "new"

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

    @field_validator('name', 'subject', 'message')
    @classmethod
    def sanitize_fields(cls, v):
        if v:
            v = re.sub(r'<[^>]*>', '', v)
            return v[:2000]
        return v

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if len(v) < 2:
            raise ValueError('Name must be at least 2 characters')
        if len(v) > 100:
            raise ValueError('Name must be less than 100 characters')
        return v

class InternshipApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    track: str
    education: str
    experience: str
    statement_of_interest: str
    resume_link: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"

class InternshipApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    track: str
    education: str
    experience: str
    statement_of_interest: str
    resume_link: Optional[str] = None

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    content: str
    category: str
    image_url: Optional[str] = None
    event_date: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    published: bool = True

class EventCreate(BaseModel):
    title: str
    description: str
    content: str
    category: str
    image_url: Optional[str] = None
    event_date: Optional[str] = None
    published: bool = True

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    event_date: Optional[str] = None
    published: Optional[bool] = None

class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    name: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "manager"

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in ('admin', 'manager'):
            raise ValueError('Role must be "admin" or "manager"')
        return v

class AdminUserPublic(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    created_at: datetime

class DonationSettingsUpdate(BaseModel):
    account_name: str
    bank_name: str
    account_number: str
    ifsc_code: str
    branch: str

class BankDetails(BaseModel):
    account_name: str = "Aarhi Impact Foundation"
    bank_name: str = "Axis Bank"
    account_number: str = "926020030102964"
    ifsc_code: str = "UTIB0004285"
    branch: str = "Kalapahar"

class DonationTier(BaseModel):
    amount: int
    impact: str
    description: str

class DonationOrderCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    amount: int  # whole rupees
    donor_name: str
    donor_email: EmailStr
    donor_phone: Optional[str] = None
    donation_type: str = "one-time"

    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        if v < 100:
            raise ValueError('Minimum donation amount is ₹100')
        if v > 10000000:
            raise ValueError('Amount exceeds maximum allowed for online payment')
        return v

    @field_validator('donor_name')
    @classmethod
    def sanitize_name(cls, v):
        if v:
            v = re.sub(r'<[^>]*>', '', v).strip()
        return v

    @field_validator('donation_type')
    @classmethod
    def validate_donation_type(cls, v):
        if v not in ('one-time', 'monthly', 'csr'):
            raise ValueError('Invalid donation type')
        return v

class DonationOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str = "INR"
    key_id: str

class DonationVerify(BaseModel):
    model_config = ConfigDict(extra="ignore")
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    amount: int
    donor_name: str
    donor_email: EmailStr
    donor_phone: Optional[str] = None
    donation_type: str = "one-time"

# Report/Document Models
class Report(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # annual, financial, impact, legal
    year: str
    file_size: str
    pdf_url: str
    upload_date: str
    published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReportCreate(BaseModel):
    title: str
    description: str
    category: str
    year: str
    file_size: str
    pdf_url: str
    upload_date: str
    published: bool = True

class ReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    year: Optional[str] = None
    file_size: Optional[str] = None
    pdf_url: Optional[str] = None
    upload_date: Optional[str] = None
    published: Optional[bool] = None

# ============== HELPER FUNCTIONS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.strip().encode('utf-8'))
    except (ValueError, TypeError) as e:
        logger.warning(f"Password check failed due to a malformed stored hash: {e}")
        return False

def create_token(user_id: str, email: str, role: str = "admin") -> str:
    if not JWT_SECRET:
        raise HTTPException(status_code=503, detail="Authentication is not configured on the server. Please set JWT_SECRET.")
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc).timestamp() + 86400
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not JWT_SECRET:
        raise HTTPException(status_code=503, detail="Authentication is not configured on the server.")
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_admin_role(admin = Depends(get_current_admin)):
    """Full administrator only — user management, contacts, internship applications."""
    if admin.get("role") != "admin":
        raise HTTPException(status_code=403, detail="This action requires an administrator account.")
    return admin

def require_staff(admin = Depends(get_current_admin)):
    """Either an admin or a manager — events, reports, donation info."""
    if admin.get("role") not in ("admin", "manager"):
        raise HTTPException(status_code=403, detail="Access denied.")
    return admin

def send_notification_email(subject: str, html_content: str):
    if not resend.api_key:
        logger.warning("Resend API key not configured, skipping email")
        return None
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [NOTIFICATION_EMAIL],
            "subject": subject,
            "html": html_content
        }
        email = resend.Emails.send(params)
        logger.info(f"Email sent: {email.get('id')}")
        return email
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return None

# ============== PUBLIC ROUTES ==============

@api_router.get("/")
def root():
    return {"message": "Aarhi Impact Foundation API", "version": "1.0.0"}

@api_router.get("/health")
def health():
    return {"status": "healthy"}

# Sitemap and Robots for SEO
@app.get("/sitemap.xml", response_class=Response)
def get_sitemap():
    sitemap_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aarhiimpactfoundation.org/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/programs</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/impact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/events</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/internships</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/donate</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/csr-partnership</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/reports</loc>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.aarhiimpactfoundation.org/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>"""
    return Response(content=sitemap_content, media_type="application/xml")

@app.get("/robots.txt", response_class=PlainTextResponse)
def get_robots():
    return """# robots.txt for Aarhi Impact Foundation
User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /admin

# Sitemap location
Sitemap: https://www.aarhiimpactfoundation.org/sitemap.xml"""

# Contact Form
@api_router.post("/contact", response_model=ContactSubmission)
def submit_contact(contact: ContactCreate, request: Request):
    db = get_db()
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip, 5):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    
    contact_obj = ContactSubmission(**contact.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    db.contacts.insert_one(doc)
    
    html = f"""
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {contact.name}</p>
    <p><strong>Email:</strong> {contact.email}</p>
    <p><strong>Subject:</strong> {contact.subject}</p>
    <p><strong>Message:</strong></p>
    <p>{contact.message}</p>
    """
    send_notification_email(f"[AIF Contact] {contact.subject}", html)
    
    return contact_obj

# Internship Applications
@api_router.post("/internships/apply", response_model=InternshipApplication)
def submit_internship_application(application: InternshipApplicationCreate, request: Request):
    db = get_db()
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip, 3):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    
    app_obj = InternshipApplication(**application.model_dump())
    doc = app_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    db.internship_applications.insert_one(doc)
    
    html = f"""
    <h2>New Internship Application</h2>
    <p><strong>Name:</strong> {application.name}</p>
    <p><strong>Email:</strong> {application.email}</p>
    <p><strong>Phone:</strong> {application.phone}</p>
    <p><strong>Track:</strong> {application.track}</p>
    <p><strong>Education:</strong> {application.education}</p>
    <p><strong>Experience:</strong> {application.experience}</p>
    <p><strong>Statement of Interest:</strong></p>
    <p>{application.statement_of_interest}</p>
    """
    send_notification_email(f"[AIF Internship] Application from {application.name}", html)
    
    return app_obj

# Events (Public)
@api_router.get("/events", response_model=List[Event])
def get_events(category: Optional[str] = None, limit: int = 20):
    db = get_db()
    query = {"published": True}
    if category:
        query["category"] = category
    raw_events = list(db.events.find(query, {"_id": 0}).sort("created_at", -1).limit(limit))
    valid_events = []
    for doc in raw_events:
        try:
            if isinstance(doc.get('created_at'), str):
                doc['created_at'] = datetime.fromisoformat(doc['created_at'])
            valid_events.append(Event(**doc))
        except Exception as e:
            logger.warning(f"Skipping malformed event document (id={doc.get('id', 'unknown')}): {e}")
    return valid_events

@api_router.get("/events/{event_id}", response_model=Event)
def get_event(event_id: str):
    db = get_db()
    event = db.events.find_one({"id": event_id, "published": True}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if isinstance(event.get('created_at'), str):
        event['created_at'] = datetime.fromisoformat(event['created_at'])
    return event

# Donation Info
@api_router.get("/donations/bank-details", response_model=BankDetails)
def get_bank_details():
    db = get_db()
    saved = db.settings.find_one({"key": "bank_details"}, {"_id": 0, "key": 0})
    if saved:
        return BankDetails(**saved)
    return BankDetails()

@api_router.put("/donations/bank-details", response_model=BankDetails)
def update_bank_details(payload: DonationSettingsUpdate, admin = Depends(require_staff)):
    db = get_db()
    doc = payload.model_dump()
    db.settings.update_one(
        {"key": "bank_details"},
        {"$set": doc, "$setOnInsert": {"key": "bank_details"}},
        upsert=True
    )
    return BankDetails(**doc)

@api_router.get("/admin/donations")
def list_donations(admin = Depends(require_staff)):
    db = get_db()
    donations = list(db.donations.find({}, {"_id": 0}).sort("created_at", -1).limit(500))
    total_amount = sum(d.get("amount", 0) for d in donations)
    return {"donations": donations, "total_amount": total_amount, "count": len(donations)}

@api_router.get("/donations/tiers", response_model=List[DonationTier])
def get_donation_tiers():
    return [
        DonationTier(amount=5000, impact="Support green skills training for 1 youth", description="Basic Supporter"),
        DonationTier(amount=10000, impact="Enable sustainable farming practices for 2 farmers", description="Climate Champion"),
        DonationTier(amount=25000, impact="Fund a pilot carbon credit project assessment", description="Impact Partner"),
        DonationTier(amount=50000, impact="Support a complete workshop program", description="Program Sponsor"),
        DonationTier(amount=100000, impact="Enable comprehensive community intervention", description="Strategic Partner")
    ]

# Razorpay online payments
@api_router.post("/donations/create-order", response_model=DonationOrderResponse)
def create_donation_order(payload: DonationOrderCreate, request: Request):
    if not razorpay_client:
        raise HTTPException(status_code=503, detail="Online payments are temporarily unavailable. Please use bank transfer instead.")

    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip, 10):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")

    try:
        order = razorpay_client.order.create({
            "amount": payload.amount * 100,  # paise
            "currency": "INR",
            "receipt": f"aif-{uuid.uuid4().hex[:12]}",
            "notes": {
                "donor_name": payload.donor_name,
                "donor_email": payload.donor_email,
                "donation_type": payload.donation_type
            }
        })
    except Exception as e:
        logger.error(f"Razorpay order creation failed: {e}")
        raise HTTPException(status_code=502, detail="Could not create payment order. Please try again.")

    return DonationOrderResponse(order_id=order["id"], amount=payload.amount, key_id=RAZORPAY_KEY_ID)

@api_router.post("/donations/verify-payment")
def verify_donation_payment(payload: DonationVerify, request: Request):
    if not razorpay_client:
        raise HTTPException(status_code=503, detail="Online payments are temporarily unavailable.")

    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': payload.razorpay_order_id,
            'razorpay_payment_id': payload.razorpay_payment_id,
            'razorpay_signature': payload.razorpay_signature
        })
    except razorpay.errors.SignatureVerificationError:
        logger.warning(f"Signature verification failed for order {payload.razorpay_order_id}, payment {payload.razorpay_payment_id}")
        raise HTTPException(status_code=400, detail="Payment verification failed.")
    except Exception as e:
        logger.exception(f"Unexpected error during signature verification for payment {payload.razorpay_payment_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")

    # Signature is genuine at this point — the payment is confirmed.
    # A DB or email hiccup below must NOT tell the donor their real,
    # already-successful payment "failed".
    try:
        db = get_db()
        doc = {
            "id": str(uuid.uuid4()),
            "order_id": payload.razorpay_order_id,
            "payment_id": payload.razorpay_payment_id,
            "amount": payload.amount,
            "donor_name": payload.donor_name,
            "donor_email": payload.donor_email,
            "donor_phone": payload.donor_phone,
            "donation_type": payload.donation_type,
            "status": "verified",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        db.donations.insert_one(doc)
    except Exception as e:
        logger.exception(f"Failed to record verified donation (payment_id={payload.razorpay_payment_id}) in DB: {e}")

    try:
        html = f"""
        <h2>New Donation Received</h2>
        <p><strong>Amount:</strong> &#8377;{payload.amount:,}</p>
        <p><strong>Donor:</strong> {payload.donor_name}</p>
        <p><strong>Email:</strong> {payload.donor_email}</p>
        <p><strong>Phone:</strong> {payload.donor_phone or 'N/A'}</p>
        <p><strong>Type:</strong> {payload.donation_type}</p>
        <p><strong>Payment ID:</strong> {payload.razorpay_payment_id}</p>
        """
        send_notification_email(f"[AIF Donation] Rs.{payload.amount:,} from {payload.donor_name}", html)
    except Exception as e:
        logger.exception(f"Failed to send donation notification email (payment_id={payload.razorpay_payment_id}): {e}")

    return {"status": "success", "message": "Payment verified successfully"}

# ============== ADMIN ROUTES ==============

@api_router.post("/admin/login")
def admin_login(login: AdminLogin):
    db = get_db()
    try:
        admin = db.admins.find_one({"email": login.email.strip()}, {"_id": 0})
        if not admin or not verify_password(login.password, admin['password_hash']):
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Unexpected error during login for {login.email}: {e}")
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")

    role = admin.get('role', 'admin')
    token = create_token(admin['id'], admin['email'], role)
    return {"token": token, "admin": {"id": admin['id'], "email": admin['email'], "name": admin['name'], "role": role}}

@api_router.get("/admin/bootstrap-status")
def admin_bootstrap_status():
    """Lets the login page know whether a founding admin account still needs to be created."""
    db = get_db()
    count = db.admins.count_documents({})
    return {"needs_bootstrap": count == 0}

class EmergencyPasswordReset(BaseModel):
    email: EmailStr
    new_password: str
    recovery_key: str

    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

EMERGENCY_RESET_KEY = os.environ.get('EMERGENCY_RESET_KEY', '')

@api_router.post("/admin/emergency-reset")
def emergency_password_reset(payload: EmergencyPasswordReset, request: Request):
    """
    A safety valve for a locked-out admin. Disabled unless EMERGENCY_RESET_KEY is
    explicitly set in the environment — with no key configured, this always 404s.
    Generates the password hash correctly on the server, sidestepping the copy/paste
    issues that come with hand-editing password_hash directly in MongoDB.
    Remove the EMERGENCY_RESET_KEY environment variable once you're back in, to
    close this off again.
    """
    if not EMERGENCY_RESET_KEY:
        raise HTTPException(status_code=404, detail="Not found")

    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip, 5):
        raise HTTPException(status_code=429, detail="Too many attempts. Please try again later.")

    if not hmac.compare_digest(payload.recovery_key, EMERGENCY_RESET_KEY):
        raise HTTPException(status_code=403, detail="Invalid recovery key")

    db = get_db()
    email = payload.email.strip()
    admin = db.admins.find_one({"email": email}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=404, detail="No account found with that email")

    new_hash = hash_password(payload.new_password)
    db.admins.update_one({"email": email}, {"$set": {"password_hash": new_hash}})
    logger.warning(f"Emergency password reset performed for {email}")

    return {"status": "success", "message": "Password updated. You can now log in with your new password."}

@api_router.post("/admin/register")
def admin_register(admin_data: AdminCreate):
    db = get_db()
    # Registration only works once, to create the very first (founding) admin account.
    # After that, new accounts must be created by an existing admin via /admin/users.
    if db.admins.count_documents({}) > 0:
        raise HTTPException(status_code=403, detail="Registration is closed. Ask an existing admin to create your account.")

    existing = db.admins.find_one({"email": admin_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    admin = AdminUser(
        email=admin_data.email,
        password_hash=hash_password(admin_data.password),
        name=admin_data.name,
        role="admin"
    )
    doc = admin.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    db.admins.insert_one(doc)

    token = create_token(admin.id, admin.email, admin.role)
    return {"token": token, "admin": {"id": admin.id, "email": admin.email, "name": admin.name, "role": admin.role}}

@api_router.get("/admin/users", response_model=List[AdminUserPublic])
def list_admin_users(admin = Depends(require_admin_role)):
    db = get_db()
    users = list(db.admins.find({}, {"_id": 0, "password_hash": 0}))
    for u in users:
        if isinstance(u.get('created_at'), str):
            u['created_at'] = datetime.fromisoformat(u['created_at'])
    return users

@api_router.post("/admin/users", response_model=AdminUserPublic)
def create_admin_user(user_data: AdminUserCreate, admin = Depends(require_admin_role)):
    db = get_db()
    existing = db.admins.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = AdminUser(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=user_data.name,
        role=user_data.role
    )
    doc = new_user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    db.admins.insert_one(doc)
    doc.pop('password_hash', None)
    doc['created_at'] = new_user.created_at
    return doc

@api_router.delete("/admin/users/{user_id}")
def delete_admin_user(user_id: str, admin = Depends(require_admin_role)):
    db = get_db()
    target = db.admins.find_one({"id": user_id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    if target["id"] == admin.get("sub"):
        raise HTTPException(status_code=400, detail="You cannot delete your own account while logged in as it.")

    if target.get("role") == "admin":
        admin_count = db.admins.count_documents({"role": "admin"})
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last remaining admin account.")

    db.admins.delete_one({"id": user_id})
    return {"status": "success", "message": "User removed"}

@api_router.get("/admin/me")
def get_current_admin_info(admin = Depends(get_current_admin)):
    return admin

# Admin - Events Management
@api_router.get("/admin/events", response_model=List[Event])
def admin_get_events(admin = Depends(require_staff)):
    db = get_db()
    raw_events = list(db.events.find({}, {"_id": 0}).sort("created_at", -1).limit(100))
    valid_events = []
    for doc in raw_events:
        try:
            if isinstance(doc.get('created_at'), str):
                doc['created_at'] = datetime.fromisoformat(doc['created_at'])
            valid_events.append(Event(**doc))
        except Exception as e:
            logger.warning(f"Malformed event document in admin list (id={doc.get('id', 'unknown')}): {e}")
    return valid_events

@api_router.post("/admin/events", response_model=Event)
def admin_create_event(event_data: EventCreate, admin = Depends(require_staff)):
    db = get_db()
    event = Event(**event_data.model_dump())
    doc = event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    db.events.insert_one(doc)
    return event

@api_router.put("/admin/events/{event_id}", response_model=Event)
def admin_update_event(event_id: str, event_data: EventUpdate, admin = Depends(require_staff)):
    db = get_db()
    update_data = {k: v for k, v in event_data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = db.events.update_one({"id": event_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = db.events.find_one({"id": event_id}, {"_id": 0})
    if isinstance(event.get('created_at'), str):
        event['created_at'] = datetime.fromisoformat(event['created_at'])
    return event

@api_router.delete("/admin/events/{event_id}")
def admin_delete_event(event_id: str, admin = Depends(require_staff)):
    db = get_db()
    result = db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}

# Admin - Contact Submissions
@api_router.get("/admin/contacts", response_model=List[ContactSubmission])
def admin_get_contacts(admin = Depends(require_admin_role)):
    db = get_db()
    contacts = list(db.contacts.find({}, {"_id": 0}).sort("created_at", -1).limit(100))
    for contact in contacts:
        if isinstance(contact.get('created_at'), str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'])
    return contacts

@api_router.put("/admin/contacts/{contact_id}/status")
def admin_update_contact_status(contact_id: str, status: str, admin = Depends(require_admin_role)):
    db = get_db()
    result = db.contacts.update_one({"id": contact_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Status updated"}

# Admin - Internship Applications
@api_router.get("/admin/internships", response_model=List[InternshipApplication])
def admin_get_internship_applications(admin = Depends(require_admin_role)):
    db = get_db()
    applications = list(db.internship_applications.find({}, {"_id": 0}).sort("created_at", -1).limit(100))
    for app in applications:
        if isinstance(app.get('created_at'), str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
    return applications

@api_router.put("/admin/internships/{app_id}/status")
def admin_update_internship_status(app_id: str, status: str, admin = Depends(require_admin_role)):
    db = get_db()
    result = db.internship_applications.update_one({"id": app_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    return {"message": "Status updated"}

# Admin - Reports/Documents Management
@api_router.get("/admin/reports", response_model=List[Report])
def admin_get_reports(admin = Depends(require_staff)):
    db = get_db()
    reports = list(db.reports.find({}, {"_id": 0}).sort("created_at", -1).limit(100))
    for report in reports:
        if isinstance(report.get('created_at'), str):
            report['created_at'] = datetime.fromisoformat(report['created_at'])
    return reports

@api_router.post("/admin/reports", response_model=Report)
def admin_create_report(report_data: ReportCreate, admin = Depends(require_staff)):
    db = get_db()
    report = Report(**report_data.model_dump())
    doc = report.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    db.reports.insert_one(doc)
    return report

@api_router.put("/admin/reports/{report_id}", response_model=Report)
def admin_update_report(report_id: str, report_data: ReportUpdate, admin = Depends(require_staff)):
    db = get_db()
    update_data = {k: v for k, v in report_data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = db.reports.update_one({"id": report_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report = db.reports.find_one({"id": report_id}, {"_id": 0})
    if isinstance(report.get('created_at'), str):
        report['created_at'] = datetime.fromisoformat(report['created_at'])
    return report

@api_router.delete("/admin/reports/{report_id}")
def admin_delete_report(report_id: str, admin = Depends(require_staff)):
    db = get_db()
    result = db.reports.delete_one({"id": report_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Report deleted"}

# Public - Get Reports
@api_router.get("/reports", response_model=List[Report])
def get_public_reports():
    db = get_db()
    reports = list(db.reports.find({"published": True}, {"_id": 0}).sort("created_at", -1).limit(50))
    for report in reports:
        if isinstance(report.get('created_at'), str):
            report['created_at'] = datetime.fromisoformat(report['created_at'])
    return reports

# Admin - Dashboard Stats
@api_router.get("/admin/stats")
def admin_get_stats(admin = Depends(get_current_admin)):
    db = get_db()
    events_count = db.events.count_documents({})
    reports_count = db.reports.count_documents({})
    donations_count = db.donations.count_documents({})
    donations_total = sum(d.get("amount", 0) for d in db.donations.find({}, {"amount": 1}))

    if admin.get("role") != "admin":
        return {
            "events": events_count,
            "reports": reports_count,
            "donations": {"total": donations_count, "amount": donations_total}
        }

    contacts_count = db.contacts.count_documents({})
    pending_contacts = db.contacts.count_documents({"status": "new"})
    applications_count = db.internship_applications.count_documents({})
    pending_applications = db.internship_applications.count_documents({"status": "pending"})

    return {
        "events": events_count,
        "contacts": {"total": contacts_count, "pending": pending_contacts},
        "applications": {"total": applications_count, "pending": pending_applications},
        "reports": reports_count,
        "donations": {"total": donations_count, "amount": donations_total}
    }

# Include router
app.include_router(api_router)

# Security Headers Middleware — pure ASGI, not BaseHTTPMiddleware.
# BaseHTTPMiddleware (the @app.middleware("http") decorator style) runs the
# downstream app inside a separate anyio task group. On Vercel's ASGI runtime
# this was letting real exceptions escape as a bare, undetailed
# "Internal Server Error" / ExceptionGroup instead of reaching FastAPI's own
# exception handling. A pure ASGI middleware has no task group in the way —
# it just wraps the 'send' callable to inject headers into the response.
class SecurityHeadersMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        async def send_with_headers(message):
            if message["type"] == "http.response.start":
                headers = message.setdefault("headers", [])
                headers.extend([
                    (b"x-content-type-options", b"nosniff"),
                    (b"x-frame-options", b"DENY"),
                    (b"x-xss-protection", b"1; mode=block"),
                    (b"referrer-policy", b"strict-origin-when-cross-origin"),
                    (b"permissions-policy", b"geolocation=(), microphone=(), camera=()"),
                ])
            await send(message)

        await self.app(scope, receive, send_with_headers)

app.add_middleware(SecurityHeadersMiddleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
