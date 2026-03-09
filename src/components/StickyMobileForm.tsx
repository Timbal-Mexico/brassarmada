import { useState } from "react";
import ContactForm from "./ContactForm";

const StickyMobileForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {isOpen ? (
          <div className="max-h-[70vh] overflow-y-auto border-t border-primary bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-sm text-primary">Solicitar Cotización</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="touch-target font-body text-sm text-muted-foreground"
              >
                ✕
              </button>
            </div>
            <ContactForm onSuccess={() => setTimeout(() => setIsOpen(false), 2000)} />
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-primary py-4 font-heading text-sm text-primary-foreground"
          >
            Solicitar Cotización
          </button>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="fixed right-0 top-1/2 z-40 hidden w-80 -translate-y-1/2 border border-border bg-card p-6 md:block">
        <h3 className="mb-4 font-heading text-sm text-primary">Solicitar Cotización</h3>
        <ContactForm />
      </div>
    </>
  );
};

export default StickyMobileForm;
