'use strict';
(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const storageKey = 'isao-archives-v1';
  const fragments = [
    { title: 'Le sceau oublié', glyph: '✧', phrase: 'Au bord des tombes, les noms demeurent.', letter: 'A' },
    { title: 'Entre les pages', glyph: '⌁', phrase: 'Un souvenir résiste à la nuit.', letter: 'U' },
    { title: 'La lumière du mémorial', glyph: '✦', phrase: 'Brille encore ce que l’on croyait perdu.', letter: 'B' },
    { title: 'Derrière la porte', glyph: '◇', phrase: 'Et demain attend derrière la porte.', letter: 'E' }
  ];
  const knownNames = $$('.memory').map(button => button.dataset.name);
  let state = { found: [], unlocked: false, candles: [], fontSize: 19, light: false };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      state.found = Array.isArray(saved.found) ? [...new Set(saved.found.filter(n => Number.isInteger(n) && n >= 0 && n < 4))] : [];
      state.candles = Array.isArray(saved.candles) ? [...new Set(saved.candles.filter(name => knownNames.includes(name)))] : [];
      state.unlocked = saved.unlocked === true;
      state.fontSize = Number.isFinite(saved.fontSize) ? Math.min(25, Math.max(17, saved.fontSize)) : 19;
      state.light = saved.light === true;
    }
  } catch { /* L’exploration fonctionne aussi sans stockage local. */ }
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Stockage facultatif. */ } };
  let toastTimer;
  function toast(text) {
    $('#toast').textContent = text;
    $('#toast').classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
  }
  function openDialog(dialog) {
    $$('dialog[open]').forEach(open => open.close());
    dialog.showModal();
  }
  $$('.close-dialog').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }));
  const menu = $('.menu-toggle');
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); $('#main-nav').classList.remove('open'); }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    $('#main-nav').classList.toggle('open', open);
  });
  $$('#main-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      $$('#main-nav a').forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  $$('main > section[id]').forEach(section => observer.observe(section));
  const reader = $('#reader-dialog');
  $$('.button[data-open-reader], .text-link[data-open-reader]').forEach(button => button.addEventListener('click', () => openDialog(reader)));
  function updateReader() {
    reader.style.setProperty('--reader-size', state.fontSize + 'px');
    reader.classList.toggle('light', state.light);
    $('#reader-theme').setAttribute('aria-pressed', String(state.light));
    $('#reader-theme').setAttribute('aria-label', state.light ? 'Activer le fond sombre' : 'Activer le fond clair');
    $('#text-smaller').disabled = state.fontSize <= 17;
    $('#text-larger').disabled = state.fontSize >= 25;
  }
  $('#text-smaller').addEventListener('click', () => { state.fontSize = Math.max(17, state.fontSize - 2); updateReader(); save(); });
  $('#text-larger').addEventListener('click', () => { state.fontSize = Math.min(25, state.fontSize + 2); updateReader(); save(); });
  $('#reader-theme').addEventListener('click', () => { state.light = !state.light; updateReader(); save(); });
  $('.reader-scroll').addEventListener('scroll', event => {
    const area = event.target;
    const distance = area.scrollHeight - area.clientHeight;
    $('.reading-progress > span').style.width = (distance > 0 ? area.scrollTop / distance * 100 : 100) + '%';
  }, { passive: true });
  function renderPuzzle() {
    $('#fragment-count').textContent = state.found.length;
    fragments.forEach((fragment, i) => {
      const card = $(`[data-clue-card="${i}"]`);
      const found = state.found.includes(i);
      card.classList.toggle('found', found);
      if (found) {
        $('.clue-letter', card).textContent = fragment.letter;
        $('.clue-letter', card).setAttribute('aria-label', 'Lettre ' + fragment.letter);
        $('.clue-text', card).textContent = '« ' + fragment.phrase + ' »';
        const action = $('.clue-action', card);
        if (!action.dataset.collected) { action.dataset.collected = 'true'; action.textContent = 'Relire le fragment ↗'; action.addEventListener('click', event => { event.preventDefault(); collectFragment(i); }); }
      }
    });
    $('#journal-nav').hidden = !state.unlocked;
    $('#unlock-form').hidden = state.unlocked;
    $('#open-journal').hidden = !state.unlocked;
    $('#lock-eyebrow').textContent = state.unlocked ? 'LE SILENCE S’EST OUVERT' : 'UNE PAGE RESTE SCELLÉE';
    $('#lock-title').textContent = state.unlocked ? 'Le journal vous attend.' : 'Quel mot ouvre le silence ?';
    $('#lock-description').textContent = state.unlocked ? 'Vous avez retrouvé ce qui se cachait entre les lignes.' : 'Quatre lettres suffisent pour trouver ce qui se cache derrière.';
    $$('[data-fragment]').forEach(button => button.classList.toggle('collected', state.found.includes(Number(button.dataset.fragment))));
  }
  function collectFragment(i) {
    const fragment = fragments[i];
    if (!fragment) return;
    if (!state.found.includes(i)) { state.found.push(i); save(); renderPuzzle(); }
    $('#fragment-number').textContent = 'FRAGMENT ' + ['I', 'II', 'III', 'IV'][i] + ' · RETROUVÉ';
    $('#fragment-glyph').textContent = fragment.glyph;
    $('#fragment-title').textContent = fragment.title;
    $('#fragment-phrase').textContent = '« ' + fragment.phrase + ' »';
    openDialog($('#fragment-dialog'));
  }
  $$('[data-fragment]').forEach(button => button.addEventListener('click', event => {
    if (!button.dataset.collected) collectFragment(Number(button.dataset.fragment));
  }));
  $('#view-clues').addEventListener('click', () => { $('#fragment-dialog').close(); location.hash = 'indices'; });
  function openJournal() {
    if (state.unlocked) openDialog($('#journal-dialog'));
    else { location.hash = 'indices'; $('#secret-code').focus({ preventScroll: true }); toast('Quatre fragments. Un mot. La page attend.'); }
  }
  $('#unlock-form').addEventListener('submit', event => {
    event.preventDefault();
    const code = $('#secret-code').value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
    if (code !== 'AUBE') {
      $('#unlock-message').textContent = code ? 'Le sceau résiste. Cherchez les premières lettres des quatre fragments.' : 'Inscrivez le mot de quatre lettres retrouvé dans les fragments.';
      $('#secret-code').setAttribute('aria-invalid', 'true');
      $('#secret-code').focus();
      return;
    }
    state.unlocked = true;
    save(); renderPuzzle(); openJournal();
    toast('Le journal caché a été retrouvé.');
  });
  $('#secret-code').addEventListener('input', () => { $('#secret-code').removeAttribute('aria-invalid'); $('#unlock-message').textContent = ''; });
  $('#open-journal').addEventListener('click', openJournal);
  $('#journal-nav').addEventListener('click', event => { event.preventDefault(); openJournal(); });
  window.addEventListener('hashchange', () => { if (location.hash === '#journal') openJournal(); });
  $('#reset-puzzle').addEventListener('click', () => {
    state.found = []; state.unlocked = false; save();
    // Le rechargement restaure les intitulés et destinations de chaque indice.
    location.hash = 'indices'; location.reload();
  });
  let currentName = '';
  function renderCandle() {
    const lit = state.candles.includes(currentName);
    $('#memory-dialog').classList.toggle('candle-lit', lit);
    $('#light-candle').textContent = lit ? 'Une lumière veille ✦' : 'Allumer une lumière ✦';
    $('#light-candle').disabled = lit;
    $('#candle-status').textContent = lit ? 'Ce souvenir est gardé dans ce navigateur.' : '';
    $$('.memory').forEach(button => { const hasLight = state.candles.includes(button.dataset.name); button.classList.toggle('lit', hasLight); button.setAttribute('aria-label', button.dataset.name + (hasLight ? ' — une lumière allumée' : ' — rendre hommage')); });
  }
  $$('.memory').forEach(button => button.addEventListener('click', () => {
    currentName = button.dataset.name;
    $('#memory-title').textContent = currentName;
    renderCandle(); openDialog($('#memory-dialog'));
  }));
  $('#light-candle').addEventListener('click', () => {
    if (currentName && !state.candles.includes(currentName)) { state.candles.push(currentName); save(); renderCandle(); }
  });
  renderPuzzle(); updateReader(); renderCandle();
  if (location.hash === '#journal') openJournal();
})();
