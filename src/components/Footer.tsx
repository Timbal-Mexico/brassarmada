import { Mail, MessageCircle, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-black bg-white px-4 py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex items-center">
              <img
                src="/images/logos/brassaarmada.png"
                alt="Brass Armada"
                className="h-auto max-h-[50px] w-auto max-w-[150px] object-contain brightness-0"
                loading="lazy"
              />
            </div>
            <p className="max-w-md font-body text-xs leading-relaxed tracking-widest text-black uppercase opacity-60">
              Casa productora y record label enfocada en crear, desarrollar y presentar proyectos musicales con identidad propia y estándares
              de producción de alto nivel.
            </p>
          </div>
          <div>
            <h4 className="mb-6 font-heading text-[10px] font-black tracking-[0.2em] text-black">CONTACTO</h4>
            <address className="not-italic">
              <ul className="space-y-4 font-body text-xs tracking-widest text-black uppercase">
                <li className="font-light">
                  <a
                    href="mailto:info@brassarmada.com.mx"
                    className="inline-flex items-center gap-3 hover:opacity-60 transition-opacity"
                  >
                    <Mail className="h-4 w-4" strokeWidth={3} />
                    info@brassarmada.com.mx
                  </a>
                </li>
                <li className="font-light">
                  <a href="tel:+523328110531" className="inline-flex items-center gap-3 hover:opacity-60 transition-opacity">
                    <Phone className="h-4 w-4" strokeWidth={3} />
                    3328110531
                  </a>
                </li>
                <li className="font-light">
                  <a
                    href="https://wa.me/523328110531"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 hover:opacity-60 transition-opacity"
                    aria-label="WhatsApp Brass Armada"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={3} />
                    WHATSAPP
                  </a>
                </li>
                <li className="font-light">GUADALAJARA, JALISCO</li>
              </ul>
            </address>
          </div>
          <div>
            <h4 className="mb-6 font-heading text-[10px] font-black tracking-[0.2em] text-black">REDES</h4>
            <ul className="space-y-4 font-body text-xs tracking-widest text-black uppercase">
              <li><a href="#" className="font-light hover:font-bold transition-all">INSTAGRAM</a></li>
              <li><a href="#" className="font-light hover:font-bold transition-all">YOUTUBE</a></li>
              <li><a href="#" className="font-light hover:font-bold transition-all">SPOTIFY</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-black pt-8 text-center font-body text-[10px] tracking-[0.3em] text-black uppercase opacity-40">
          © {new Date().getFullYear()} BRASS ARMADA. TODOS LOS DERECHOS RESERVADOS.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
