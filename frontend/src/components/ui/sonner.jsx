import { Toaster as Sonner, toast } from "sonner"

// This site has no dark-mode theme, so the toaster is locked to "light"
// and styled with explicit brand colors rather than relying solely on
// the shadcn CSS-variable color tokens.
const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-white !text-[#1B4332] !border !border-[#D1D5DB] !shadow-lg !rounded-md",
          title: "!text-[#1B4332] !font-semibold",
          description: "!text-[#4B5563]",
          actionButton:
            "!bg-[#1B4332] !text-white hover:!bg-[#153627]",
          cancelButton:
            "!bg-[#E6E4DD] !text-[#1B4332]",
          closeButton:
            "!bg-white !text-[#1B4332] !border-[#D1D5DB]",
          success:
            "!bg-[#EAF3EE] !text-[#14532D] !border-[#A7D7BA]",
          error:
            "!bg-[#FDECEC] !text-[#7F1D1D] !border-[#F3B4B4]",
          warning:
            "!bg-[#FEF6E7] !text-[#7C4A03] !border-[#F3D48A]",
          info:
            "!bg-[#EAF1F3] !text-[#1B4332] !border-[#A9C7CC]",
        },
      }}
      {...props} />
  );
}

export { Toaster, toast }
