const Footer = () => {
  return (
    <footer className="border-t border-border bg-card px-4 py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-heading text-sm text-primary">Booking Talento Musical</h3>
            <p className="font-body text-xs leading-relaxed text-muted-foreground">
              La plataforma líder en contratación de talento musical para eventos
              corporativos y privados en México.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-xs text-foreground">Contacto</h4>
            <ul className="space-y-2 font-body text-xs text-muted-foreground">
              <li>📧 contacto@bookingtalento.mx</li>
              <li>📞 +52 55 1234 5678</li>
              <li>📍 CDMX, México</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-xs text-foreground">Legal</h4>
            <ul className="space-y-2 font-body text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Aviso de Privacidad</a></li>
              <li><a href="#" className="hover:text-primary">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-primary">Política de Cancelación</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} Booking Talento Musical. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
