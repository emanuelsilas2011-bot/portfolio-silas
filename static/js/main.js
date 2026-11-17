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

  
  // Formulário de orçamento via WhatsApp
  const f = $('#form');
  const st = $('#status');

  if (f && st) {
    const rules = {
      nome: v => v.trim().length >= 2 || 'Informe seu nome.',
      email: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) || 'Informe um e-mail válido.',
      servico: v => !!v || 'Escolha um serviço.',
      mensagem: v => v.trim().length >= 10 || 'Escreva pelo menos 10 caracteres.'
    };

    const say = (message, type = '') => {
      st.textContent = message;
      st.className = type;
    };

    f.addEventListener('submit', e => {
      e.preventDefault();

      let ok = true;

      for (const k in rules) {
        const el = f.elements[k];
        const result = rules[k](el.value);

        $('#e-' + k).textContent = result === true ? '' : result;
        el.setAttribute('aria-invalid', result !== true);

        if (result !== true) ok = false;
      }

      if (!ok) {
        say('Revise os campos destacados.', 'err');
        return;
      }

      const dados = Object.fromEntries(new FormData(f));

      const mensagem = [
        'Olá! Gostaria de solicitar um orçamento.',
        '',
        `Nome: ${dados.nome}`,
        `E-mail: ${dados.email}`,
        `Serviço: ${dados.servico}`,
        '',
        'Detalhes do projeto:',
        dados.mensagem
      ].join('\n');

      const telefone = '5588992287898';

      const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

      say('Abrindo o WhatsApp...', 'ok');

      const novaAba = window.open(url, '_blank');

      if (!novaAba) {
        say('O navegador bloqueou a abertura. Permita pop-ups e tente novamente.', 'err');
        return;
      }

      f.reset();
    });
  }
