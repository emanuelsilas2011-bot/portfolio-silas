document.documentElement.classList.add('js');
addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const t0 = Date.now();

  // menu mobile
  const nav = $('#nav'), btn = $('#menu-btn');
  const setMenu = o => { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); };
  btn.onclick = () => setMenu(!nav.classList.contains('open'));
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // revelar ao rolar
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));

  // filtros da galeria
  const works = $$('.work'), fb = $$('.filter button'), note = $('.brand-note');
  fb.forEach(b => b.onclick = () => {
    fb.forEach(x => x.setAttribute('aria-pressed', x === b));
    works.forEach(w => w.hidden = !(b.dataset.cat === 'todos' || w.dataset.cat === b.dataset.cat));
    note.hidden = b.dataset.cat !== 'branding';
  });

  // lightbox com navegação (respeita o filtro ativo)
  const lb = $('#lb'), li = $('#lb-img'), lc = $('#lb-cap'); let cur = 0;
  const vis = () => works.filter(w => !w.hidden);
  const show = i => { const v = vis(); cur = (i + v.length) % v.length; const im = $('img', v[cur]); li.src = im.currentSrc || im.src; li.alt = im.alt; lc.textContent = im.alt; };
  works.forEach(w => $('button', w).onclick = () => { show(vis().indexOf(w)); lb.showModal(); });
  $('#lb-prev').onclick = () => show(cur - 1);
  $('#lb-next').onclick = () => show(cur + 1);
  $('#lb-x').onclick = () => lb.close();
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  // botões de serviço preenchem o formulário
  $$('[data-service]').forEach(a => a.addEventListener('click', () => { $('#servico').value = a.dataset.service; }));

  // formulário
  const f = $('#form'), st = $('#status');
  const rules = {
    nome: v => v.trim().length >= 2 || 'Informe seu nome.',
    email: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) || 'Informe um e-mail válido.',
    servico: v => !!v || 'Escolha um serviço.',
    mensagem: v => v.trim().length >= 10 || 'Escreva pelo menos 10 caracteres.'
  };
  const say = (t, c = '') => { st.textContent = t; st.className = c; };
  f.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    for (const k in rules) {
      const el = f.elements[k], r = rules[k](el.value);
      $('#e-' + k).textContent = r === true ? '' : r;
      el.setAttribute('aria-invalid', r !== true);
      if (r !== true) ok = false;
    }
    if (!ok) return say('Revise os campos destacados.', 'err');
    const b = $('button[type=submit]', f); b.disabled = true; say('Enviando…');
    try {
      const r = await fetch('/contato', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(new FormData(f)), t: Date.now() - t0 }) });
      const d = await r.json();
      if (r.ok && d.ok) { f.reset(); say('Mensagem enviada. Respondo em breve.', 'ok'); }
      else say(d.error || 'Não foi possível enviar. Use o e-mail ou o Instagram.', 'err');
    } catch { say('Sem conexão. Tente de novo ou use o e-mail.', 'err'); }
    b.disabled = false;
  });
});
