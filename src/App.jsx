import { useEffect, useRef, useState } from 'react';
import { STYLES, PRODUCTS, CATEGORIES, SAMPLE_PHOTO, COLOR_SWATCH, MAX_ITEMS, styleById, productById, usd, defaultOptions, priceFor, fromPrice, lineLabel } from './catalogo.js';

const HERO_STYLE = STYLES[0];

export default function App() {
  const ruta = window.location.pathname;
  if (ruta === '/gracias') return <Shell><Gracias /></Shell>;
  if (ruta === '/privacy') return <Shell><Privacy /></Shell>;
  if (ruta === '/terms') return <Shell><Terms /></Shell>;
  return <Tienda />;
}

function Shell({ children, onCrear }) {
  return (
    <>
      <header className="nav">
        <div className="wrap">
          <a href="/" className="logo"><span aria-hidden>🐾</span><b>Paw<span>trait</span></b></a>
          {onCrear ? <button className="btn btn-dark" style={{ padding: '10px 18px', fontSize: 14 }} onClick={() => onCrear()}>Create yours</button> : <a href="/" className="btn btn-ghost" style={{ padding: '10px 18px', fontSize: 14 }}>Home</a>}
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div className="wrap">
          <span>© {new Date().getFullYear()} Pawtrait · Made with love for pets</span>
          <nav><a href="/terms">Terms & refunds</a><a href="/privacy">Privacy</a></nav>
        </div>
      </footer>
    </>
  );
}

function Tienda() {
  const [creador, setCreador] = useState(null); // { estilo, retrato }
  const abrir = (estilo = null) => setCreador({ estilo });

  // Coming back from a cancelled checkout: reopen the portrait they already made.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('retrato');
    if (id) setCreador({ retrato: id });
  }, []);

  return (
    <Shell onCrear={abrir}>
      <section className="hero">
        <div className="wrap">
          <div>
            <p className="eyebrow">Custom pet portraits</p>
            <h1 className="display">Your pet, painted as a <em>masterpiece</em>.</h1>
            <p className="lead">Upload one photo. Pick a style. In under a minute you'll see your best friend as royalty, an astronaut or a watercolor — then get it framed and shipped free.</p>
            <button className="btn btn-primary" onClick={() => abrir()}>Create my pet's portrait →</button>
            <div className="trust"><span>Free preview before you pay</span><span>Free US shipping</span><span>Ready to hang</span></div>
          </div>
          <div className="hero-art">
            <div className="frame"><img src={HERO_STYLE.sample} alt="A golden retriever painted as a Renaissance king" /></div>
            <div className="before"><img src={SAMPLE_PHOTO} alt="The original photo" /><small>The original photo</small></div>
            <div className="arrow-tag">Made in 40 seconds ✨</div>
          </div>
        </div>
      </section>

      <section className="block alt" id="how">
        <div className="wrap">
          <div className="section-head"><p className="eyebrow">How it works</p><h2 className="display">Three steps. Zero hassle.</h2></div>
          <div className="steps">
            <div className="step"><div className="n">1</div><h3>Upload a photo</h3><p>Any clear phone photo where you can see their face works great.</p></div>
            <div className="step"><div className="n">2</div><h3>Pick a style & preview</h3><p>See your pet's portrait for free. Try as many styles as you like.</p></div>
            <div className="step"><div className="n">3</div><h3>Get it on your wall</h3><p>Download instantly or get a framed print shipped free across the US.</p></div>
          </div>
        </div>
      </section>

      <section className="block" id="styles">
        <div className="wrap">
          <div className="section-head"><p className="eyebrow">Styles</p><h2 className="display">Who will your pet become?</h2><p className="muted">Every portrait is created from your photo — no two are ever the same.</p></div>
          <div className="styles-grid">
            {STYLES.map((s) => <TarjetaEstilo key={s.id} estilo={s} onClick={() => abrir(s.id)} />)}
          </div>
        </div>
      </section>

      <section className="block alt" id="pricing">
        <div className="wrap">
          <div className="section-head"><p className="eyebrow">Shop</p><h2 className="display">Put them on everything</h2><p className="muted">Wall art, tees, hoodies, mugs and more — all made to order with your pet's portrait. Preview is always free. Free US shipping.</p></div>
          {CATEGORIES.map((c) => (
            <div key={c.id} style={{ marginBottom: 28 }}>
              <h3 className="cat-title">{c.name}</h3>
              <div className="shop-grid">
                {PRODUCTS.filter((p) => p.category === c.id).map((p) => (
                  <button key={p.id} className="shop-card" onClick={() => abrir()}>
                    <Mockup tipo={p.mockup} img={HERO_STYLE.sample} color={p.options?.color?.[0]} />
                    <b>{p.name}</b>
                    <span className="muted">{p.prices ? 'from ' : ''}{usd(fromPrice(p))}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 12 }}><button className="btn btn-primary" onClick={() => abrir()}>Start with a free preview</button></div>
        </div>
      </section>

      <section className="block" id="faq">
        <div className="wrap">
          <div className="section-head"><p className="eyebrow">FAQ</p><h2 className="display">Good questions</h2></div>
          <div className="faq">
            <details><summary>What kind of photo works best?</summary><p>A clear, well-lit photo where your pet's face is visible and fills most of the frame. Phone photos are perfect — no professional camera needed.</p></details>
            <details><summary>Will it really look like my pet?</summary><p>The portrait is generated from your photo and keeps their face, colors and markings. You see a free preview first, and you can try again or switch styles before paying anything.</p></details>
            <details><summary>How are portraits made?</summary><p>Portraits are created with AI image technology from your photo, then printed on museum-quality matte paper and framed by our print partner.</p></details>
            <details><summary>How long does shipping take?</summary><p>Framed prints are made to order and usually arrive in 5–10 business days anywhere in the continental US. Shipping is free. Digital downloads are instant.</p></details>
            <details><summary>Can I get a refund?</summary><p>Because every portrait is custom-made, we can't accept returns for change of mind — that's why the preview is free. If your print arrives damaged or defective, we'll replace it free. See our <a href="/terms">terms</a>.</p></details>
            <details><summary>Do cats (and other pets) work too?</summary><p>Yes! Cats, dogs, rabbits, horses — if it has a face you love, we can paint it.</p></details>
          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta-band">
            <h2 className="display">They'd do it for you.</h2>
            <p>The perfect gift for birthdays, holidays — or to remember a best friend forever.</p>
            <button className="btn btn-primary" onClick={() => abrir()}>Create my pet's portrait</button>
          </div>
        </div>
      </section>

      {creador && <Creador inicial={creador} onCerrar={() => { setCreador(null); window.history.replaceState(null, '', '/'); }} />}
    </Shell>
  );
}

function TarjetaEstilo({ estilo, sel, onClick }) {
  return (
    <button className={`style-card ${sel ? 'sel' : ''}`} onClick={onClick} type="button">
      <div className="img">{estilo.sample ? <img src={estilo.sample} alt={estilo.name} loading="lazy" /> : <span aria-hidden>🎨</span>}</div>
      <div className="body"><h3>{estilo.name}</h3><p>{estilo.tagline}</p></div>
    </button>
  );
}

// Lightweight product mockups drawn in SVG/CSS with the portrait placed on them.
function Mockup({ tipo, img, color = 'White', grande }) {
  const tela = COLOR_SWATCH[color] || '#FFFFFF';
  const oscuro = color === 'Black';
  const clase = `mockup ${grande ? 'grande' : ''}`;
  if (tipo === 'tee' || tipo === 'hoodie') {
    return (
      <div className={clase}>
        <svg viewBox="0 0 200 200" aria-hidden>
          {tipo === 'hoodie'
            ? <path d="M70 22 Q100 8 130 22 L168 44 L188 92 L160 104 L156 190 L44 190 L40 104 L12 92 L32 44 Z M82 24 Q100 52 118 24" fill={tela} stroke={oscuro ? '#000' : '#D9CFBF'} strokeWidth="2" />
            : <path d="M72 18 Q100 34 128 18 L172 40 L190 84 L160 96 L158 190 L42 190 L40 96 L10 84 L28 40 Z" fill={tela} stroke={oscuro ? '#000' : '#D9CFBF'} strokeWidth="2" />}
        </svg>
        <img src={img} alt="" className="en-prenda" style={{ top: tipo === 'hoodie' ? '34%' : '28%' }} />
      </div>
    );
  }
  if (tipo === 'mug') {
    return (
      <div className={clase}>
        <div className="taza"><img src={img} alt="" /><i className="asa" /></div>
      </div>
    );
  }
  if (tipo === 'tote') {
    return (
      <div className={clase}>
        <div className="bolsa"><i className="asas" /><img src={img} alt="" /></div>
      </div>
    );
  }
  if (tipo === 'blanket') {
    return <div className={clase}><div className="cobija"><img src={img} alt="" /></div></div>;
  }
  if (tipo === 'canvas') {
    return <div className={clase}><div className="lienzo"><img src={img} alt="" /></div></div>;
  }
  return <div className={clase}><div className="frame mini-frame"><img src={img} alt="" /></div></div>;
}

function SelectorProductos({ img, setCarrito }) {
  const [categoria, setCategoria] = useState('wall');
  const [elegido, setElegido] = useState('framed');
  const producto = productById(elegido);
  const [opciones, setOpciones] = useState(defaultOptions(producto));
  const [qty, setQty] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const precio = priceFor(producto, opciones);

  function elegir(id) { const p = productById(id); setElegido(id); setOpciones(defaultOptions(p)); setQty(1); }
  function agregar() {
    setCarrito((c) => {
      const clave = JSON.stringify([producto.id, opciones]);
      const existente = c.find((l) => JSON.stringify([l.producto, l.opciones]) === clave);
      if (existente) return c.map((l) => (l === existente ? { ...l, qty: producto.physical ? Math.min(MAX_ITEMS, l.qty + qty) : 1 } : l));
      return [...c, { producto: producto.id, opciones, qty: producto.physical ? qty : 1 }];
    });
    setAgregado(true); setTimeout(() => setAgregado(false), 1400);
  }

  return (
    <div>
      <div className="cat-tabs">
        {CATEGORIES.map((c) => <button key={c.id} className={categoria === c.id ? 'on' : ''} onClick={() => { setCategoria(c.id); elegir(PRODUCTS.find((p) => p.category === c.id).id); }}>{c.name}</button>)}
      </div>
      <div className="mini-grid">
        {PRODUCTS.filter((p) => p.category === categoria).map((p) => (
          <button key={p.id} className={`mini-prod ${elegido === p.id ? 'sel' : ''}`} onClick={() => elegir(p.id)}>
            <Mockup tipo={p.mockup} img={img} color={elegido === p.id ? opciones.color : p.options?.color?.[0]} />
            <b>{p.name}</b><span>{p.prices ? 'from ' : ''}{usd(fromPrice(p))}</span>
          </button>
        ))}
      </div>
      <div className="config">
        <p className="muted" style={{ margin: '0 0 10px', fontSize: 14 }}>{producto.detail}</p>
        {producto.options?.size && (
          <div className="opt-row"><span>Size</span>
            <div className="opt-chips">{producto.options.size.map((v) => <button key={v} className={opciones.size === v ? 'on' : ''} onClick={() => setOpciones({ ...opciones, size: v })}>{v}</button>)}</div>
          </div>
        )}
        {producto.options?.color && (
          <div className="opt-row"><span>Color</span>
            <div className="opt-chips">{producto.options.color.map((v) => (
              <button key={v} className={`swatch ${opciones.color === v ? 'on' : ''}`} onClick={() => setOpciones({ ...opciones, color: v })} title={v} aria-label={v}>
                <i style={{ background: COLOR_SWATCH[v] }} />{v}
              </button>))}
            </div>
          </div>
        )}
        {producto.physical && (
          <div className="opt-row"><span>Qty</span>
            <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less">−</button><b>{qty}</b><button onClick={() => setQty(Math.min(MAX_ITEMS, qty + 1))} aria-label="More">+</button></div>
          </div>
        )}
        <button className="btn btn-dark btn-block" onClick={agregar}>{agregado ? 'Added ✓' : `Add ${producto.name} · ${usd(precio * (producto.physical ? qty : 1))}`}</button>
      </div>
    </div>
  );
}

// Resize in the browser before uploading: faster on mobile data and well under the function limit.
async function prepararFoto(archivo) {
  const url = URL.createObjectURL(archivo);
  try {
    const img = await new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = url; });
    const max = 1536;
    const escala = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  } finally {
    URL.revokeObjectURL(url);
  }
}

const MENSAJES = ['Mixing the paints…', 'Sketching the ears…', 'Adding a royal touch…', 'Framing the masterpiece…'];

function Creador({ inicial, onCerrar }) {
  const [paso, setPaso] = useState(inicial.retrato ? 4 : inicial.estilo ? 1 : 1);
  const [foto, setFoto] = useState(null);
  const [estilo, setEstilo] = useState(inicial.estilo || null);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);
  const [trabajo, setTrabajo] = useState(inicial.retrato ? { id: inicial.retrato } : null); // { id, preview, demo }
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const [pagando, setPagando] = useState(false);
  const input = useRef(null);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  useEffect(() => { if (inicial.retrato) esperar(inicial.retrato); }, []);

  async function elegirArchivo(archivo) {
    setError(null);
    if (!archivo || !/^image\//.test(archivo.type)) return setError('Please choose a photo (JPG or PNG).');
    try {
      setFoto(await prepararFoto(archivo));
      setPaso(estilo ? 3 : 2);
    } catch {
      setError("We couldn't read that photo. Try a JPG or PNG.");
    }
  }

  async function esperar(id) {
    setPaso(4);
    for (let i = 0; i < 90; i++) {
      const r = await fetch(`/api/estado?id=${id}`).then((x) => x.json()).catch(() => null);
      if (r?.estado === 'listo') { setTrabajo({ id, preview: r.preview, demo: r.demo }); return; }
      if (r?.estado === 'error' || r?.error) { setError('Something went wrong while painting. Please try again — it won\'t count against you twice.'); setPaso(3); return; }
      setMensaje((m) => (m + 1) % MENSAJES.length);
      await new Promise((ok) => setTimeout(ok, 2500));
    }
    setError('This is taking longer than usual. Please try again.');
    setPaso(3);
  }

  async function crear() {
    setError(null);
    setTrabajo(null);
    setPaso(4);
    const r = await fetch('/api/generar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ foto, estilo, nombre }) })
      .then(async (x) => ({ ok: x.ok, ...(await x.json()) })).catch(() => ({ ok: false, error: 'No connection. Please try again.' }));
    if (!r.ok) { setError(r.error || 'Please try again.'); setPaso(3); return; }
    esperar(r.id);
  }

  async function pagar() {
    setPagando(true);
    setError(null);
    const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: trabajo.id, items: carrito }) })
      .then((x) => x.json()).catch(() => ({ error: 'No connection. Please try again.' }));
    if (r.url) { window.location.href = r.url; return; }
    setError(r.error || 'Please try again.');
    setPagando(false);
  }

  const est = styleById(estilo);
  return (
    <div className="creator-bg" onClick={onCerrar}>
      <div className="creator" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Create your pet's portrait">
        <div className="creator-top">
          <div className="dots">{[1, 2, 3, 4].map((n) => <i key={n} className={paso >= n ? 'on' : ''} />)}</div>
          <button className="close" onClick={onCerrar} aria-label="Close">×</button>
        </div>
        {error && <div className="error" role="alert">{error}</div>}

        {paso === 1 && (
          <>
            <p className="eyebrow">Step 1 of 4</p>
            <h2>Upload your pet's photo</h2>
            <div className={`drop ${arrastrando ? 'over' : ''}`} onClick={() => input.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }} onDragLeave={() => setArrastrando(false)}
              onDrop={(e) => { e.preventDefault(); setArrastrando(false); elegirArchivo(e.dataTransfer.files?.[0]); }}>
              <div className="big">📸</div>
              <p style={{ margin: '8px 0 4px', fontWeight: 700 }}>Tap to choose a photo</p>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>or drag it here · JPG or PNG</p>
            </div>
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => elegirArchivo(e.target.files?.[0])} />
            <ul className="tips"><li>Face clearly visible and in focus</li><li>Good light — daylight is best</li><li>One pet per photo</li></ul>
          </>
        )}

        {paso === 2 && (
          <>
            <p className="eyebrow">Step 2 of 4</p>
            <h2>Choose a style</h2>
            <div className="styles-grid" style={{ marginTop: 12 }}>
              {STYLES.map((s) => <TarjetaEstilo key={s.id} estilo={s} sel={estilo === s.id} onClick={() => { setEstilo(s.id); setPaso(3); }} />)}
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <p className="eyebrow">Step 3 of 4</p>
            <h2>Almost there</h2>
            <div className="photo-preview">
              {foto && <img src={foto} alt="Your photo" />}
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>{est?.name}</p>
                <p className="muted" style={{ margin: '2px 0 8px', fontSize: 14 }}>{est?.tagline}</p>
                <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => setPaso(2)}>Change style</button>{' '}
                <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => setPaso(1)}>Change photo</button>
              </div>
            </div>
            <label className="field">Your pet's name <span className="muted" style={{ fontWeight: 400 }}>(optional)</span>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} placeholder="e.g. Biscuit" />
            </label>
            <button className="btn btn-primary btn-block" disabled={!foto || !estilo} onClick={crear}>Create my free preview ✨</button>
          </>
        )}

        {paso === 4 && !trabajo?.preview && (
          <div className="painting">
            <div className="brush" />
            <h2>{MENSAJES[mensaje]}</h2>
            <p className="muted">This usually takes 20–40 seconds. Don't close this window.</p>
          </div>
        )}

        {paso === 4 && trabajo?.preview && (
          <>
            <p className="eyebrow">Step 4 of 4</p>
            <h2>{nombre ? `Meet ${nombre}, the masterpiece` : 'Your masterpiece is ready'}</h2>
            <div className="result">
              <div>
                <div className="frame"><img src={trabajo.preview} alt="Your pet's portrait preview" /></div>
                <p className="muted" style={{ fontSize: 12, textAlign: 'center', margin: '8px 0 0' }}>Preview is watermarked. Your order is printed without it.</p>
              </div>
              <div>
                <SelectorProductos img={trabajo.preview} setCarrito={setCarrito} />
                {carrito.length > 0 && (
                  <div className="cart">
                    <p className="eyebrow" style={{ marginBottom: 6 }}>Your order</p>
                    {carrito.map((l, i) => (
                      <div key={i} className="cart-line">
                        <span>{l.qty > 1 ? `${l.qty}× ` : ''}{lineLabel(l)}</span>
                        <span><b>{usd(priceFor(productById(l.producto), l.opciones) * l.qty)}</b> <button className="quitar" aria-label="Remove" onClick={() => setCarrito(carrito.filter((_, j) => j !== i))}>×</button></span>
                      </div>
                    ))}
                    <div className="cart-line total"><span>Total · free US shipping</span><b>{usd(carrito.reduce((t, l) => t + priceFor(productById(l.producto), l.opciones) * l.qty, 0))}</b></div>
                  </div>
                )}
                <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} disabled={pagando || carrito.length === 0} onClick={pagar}>
                  {pagando ? 'Opening secure checkout…' : carrito.length ? `Checkout · ${usd(carrito.reduce((t, l) => t + priceFor(productById(l.producto), l.opciones) * l.qty, 0))} →` : 'Add something to your order'}
                </button>
                <p className="muted" style={{ fontSize: 13, textAlign: 'center', margin: '10px 0 0' }}>Secure checkout by Stripe · Made to order</p>
                {foto && <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={() => { setTrabajo(null); setPaso(2); }}>Try another style (free)</button>}
                {trabajo.demo && <p className="demo-note">Demo mode: this is a sample portrait. Connect FAL_KEY to paint real photos.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Gracias() {
  const q = new URLSearchParams(window.location.search);
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = q.get('demo') ? `/api/pedido?carrito=${encodeURIComponent(q.get('carrito') || '')}` : `/api/pedido?session_id=${encodeURIComponent(q.get('session_id') || '')}`;
    fetch(url)
      .then(async (r) => (r.ok ? setPedido(await r.json()) : setError('We could not find this order. If you were charged, email us and we will sort it out right away.')))
      .catch(() => setError('No connection. Refresh the page in a moment.'));
  }, []);

  return (
    <div className="page">
      <div className="wrap">
        <div className="card" style={{ textAlign: 'center' }}>
          {error && <div className="error">{error}</div>}
          {!pedido && !error && <div className="brush" />}
          {pedido && (
            <>
              <div style={{ fontSize: 52 }}>🎉</div>
              <h1 className="display" style={{ fontSize: 40, margin: '8px 0' }}>Thank you!</h1>
              {pedido.demo && <p className="demo-note">Demo mode — no payment was taken. Connect Stripe to accept real orders.</p>}
              <p className="muted">{pedido.estilo}{pedido.nombre ? ` · ${pedido.nombre}` : ''}</p>
              <ul className="gracias-items">{pedido.items?.map((it, i) => <li key={i}>{it.qty > 1 ? `${it.qty}× ` : ''}{it.label}</li>)}</ul>
              {pedido.preview && <div className="frame" style={{ maxWidth: 280, margin: '18px auto' }}><img src={pedido.preview} alt="Your portrait" /></div>}
              {pedido.descarga && <a className="btn btn-primary" href={pedido.descarga}>Download your portrait</a>}
              {pedido.fisico && <p>Your order is being made. We'll email tracking to <b>{pedido.email || 'you'}</b> as soon as it ships (usually 5–10 business days).</p>}
              <p className="muted" style={{ fontSize: 14, marginTop: 20 }}>Loved it? Share it and tag us — it helps a small business a lot.</p>
              <a className="btn btn-ghost" href="/">Make another portrait</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Plain-language templates: review with a professional before launch.
function Terms() {
  return (
    <div className="page legal"><div className="wrap"><div className="card">
      <h1>Terms & Refund Policy</h1>
      <p>By ordering from Pawtrait you agree to these terms.</p>
      <h2>Custom products</h2>
      <p>Every portrait is made to order from the photo you upload, using AI image technology. Because each piece is personalized, we cannot accept returns or cancellations for change of mind once an order is placed. You can preview your portrait for free before buying.</p>
      <h2>Damaged or defective items</h2>
      <p>If your print arrives damaged or with a production defect, contact us within 14 days of delivery with a photo and we will send a free replacement.</p>
      <h2>Your photos</h2>
      <p>You confirm you have the right to use the photos you upload. You keep ownership of your photo; you receive a personal, non-commercial license to the portrait created for you.</p>
      <h2>Shipping</h2>
      <p>We currently ship to addresses in the United States. Delivery estimates are not guaranteed.</p>
      <h2>Contact</h2>
      <p>Questions? Reply to your order confirmation email.</p>
    </div></div></div>
  );
}

function Privacy() {
  return (
    <div className="page legal"><div className="wrap"><div className="card">
      <h1>Privacy Policy</h1>
      <p>We collect only what we need to make and deliver your portrait.</p>
      <ul>
        <li><b>Photos you upload</b> are used only to create your portrait and are processed by our AI and printing partners.</li>
        <li><b>Payment</b> is handled by Stripe; we never see or store your card number.</li>
        <li><b>Shipping details</b> are shared with our print partner (Printful) to deliver your order.</li>
        <li>We do not sell your personal information.</li>
      </ul>
      <p>To request deletion of your photos or data, reply to your order confirmation email.</p>
    </div></div></div>
  );
}
