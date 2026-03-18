const Footer = () => {
  return (
    <footer className="border-t border-black bg-white px-4 py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <h3 className="mb-6 font-heading text-xl font-black text-black tracking-tighter">BRASS ARMADA</h3>
            <p className="max-w-md font-body text-xs leading-relaxed tracking-widest text-black uppercase opacity-60">
              Una institución dedicada a crear, estimular y propagar el movimiento del jazz con un enfoque explosivo, audaz y refrescante.
            </p>
          </div>
          <div>
            <h4 className="mb-6 font-heading text-[10px] font-black tracking-[0.2em] text-black">CONTACTO</h4>
            <ul className="space-y-4 font-body text-xs tracking-widest text-black uppercase">
              <li className="font-light">brassarmada@gmail.com</li>
              <li className="font-light">(+52) 3334669630</li>
              <li className="font-light">CDMX, MÉXICO</li>
            </ul>
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
