# This file imports the FastAPI app from api/index.py for local development
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('/app/backend/.env')

sys.path.insert(0, '/app/api')
from index import app
