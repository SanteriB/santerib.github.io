const STORAGE_KEY = 'fin_memorized_v1';
const LOCALE_KEY = 'fin_locale_v1';

let dict = [];
let queue = [];
let currentIndex = 0;
let locale = localStorage.getItem(LOCALE_KEY) || '';

function tKey(item) {
  return item[locale] || item.en || '';
}

function L(key) {
  const labels = {
    know: { en: 'I know', ru: 'Я знаю' },
    unsure: { en: "I'm not sure", ru: 'Я не уверен' },
    next: { en: 'Next', ru: 'Далее' },
    showMem: { en: 'Show Memorized', ru: 'Показать выученные' }
  };
  labels.remove = { en: 'Remove', ru: 'Удалить' };
  labels.memorized = { en: 'Memorized', ru: 'Выучено' };
  return (labels[key] && (labels[key][locale] || labels[key].en)) || key;
}

function saveMemorized(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function loadMemorized() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function setLocale(l) {
  locale = l;
  localStorage.setItem(LOCALE_KEY, l);
  render();
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function buildQueue() {
  const memorized = new Set(loadMemorized());
  queue = dict.filter(d => !memorized.has(d.phrase));
  shuffle(queue);
  currentIndex = 0;
}

function nextItem() {
  if (currentIndex < queue.length - 1) {
    currentIndex++;
  } else {
    // end => reshuffle remaining
    buildQueue();
  }
  renderQuizCard();
}

function memorizeCurrent() {
  const item = queue[currentIndex];
  if (!item) return;
  const mem = loadMemorized();
  if (!mem.includes(item.phrase)) {
    mem.push(item.phrase);
    saveMemorized(mem);
  }
  // remove from queue and render next card only; update memorized list
  queue.splice(currentIndex, 1);
  if (currentIndex >= queue.length) currentIndex = 0;
  updateMemorizedSection();
  renderQuizCard();
}

function unmemorize(phrase) {
  const mem = loadMemorized().filter(p => p !== phrase);
  saveMemorized(mem);
  // Add item back into the working queue without forcing a full re-render
  const item = dict.find(d => d.phrase === phrase);
  if (item && !queue.some(q => q.phrase === phrase)) {
    queue.push(item);
  }
  updateMemorizedSection();
}

function renderLocaleSelect(container) {
  const sel = document.createElement('div');
  sel.className = 'locale-select';
  const title = document.createElement('div');
  title.className = 'locale-title';
  title.textContent = 'Choose language / Выберите язык';
  sel.appendChild(title);

  const wrap = document.createElement('div');
  wrap.className = 'locale-toggle';

  const leftLabel = document.createElement('div');
  leftLabel.className = 'locale-label left';
  leftLabel.textContent = 'English';

  const rightLabel = document.createElement('div');
  rightLabel.className = 'locale-label right';
  rightLabel.textContent = 'Русский';

  const toggle = document.createElement('div');
  toggle.className = 'toggle';
  if (locale === 'ru') toggle.classList.add('right');
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('aria-checked', locale === 'ru' ? 'true' : 'false');

  const knob = document.createElement('div');
  knob.className = 'knob';
  toggle.appendChild(knob);

  toggle.addEventListener('click', () => {
    const newLocale = locale === 'ru' ? 'en' : 'ru';
    setLocale(newLocale);
  });

  wrap.appendChild(leftLabel);
  wrap.appendChild(toggle);
  wrap.appendChild(rightLabel);
  sel.appendChild(wrap);
  container.appendChild(sel);
}

function renderQuizCard() {
  const root = document.getElementById('app');
  const card = root.querySelector('.card');
  if (!card) return;
  const phraseEl = card.querySelector('.phrase');
  const transEl = card.querySelector('.translation');
  const knowBtn = card.querySelector('.know-btn');
  const unsureBtn = card.querySelector('.unsure-btn');

  if (!queue.length) {
    phraseEl.textContent = 'All memorized 🎉';
    transEl.textContent = '';
    unsureBtn.style.display = 'none';
    knowBtn.textContent = L('showMem');
    knowBtn.onclick = () => {
      const memSection = document.querySelector('.memorized');
      if (memSection) memSection.scrollIntoView({behavior:'smooth'});
    };
    return;
  }

  const item = queue[currentIndex];
  phraseEl.textContent = item.phrase;
  transEl.textContent = '';
  transEl.classList.remove('visible');
  unsureBtn.textContent = L('unsure');
  unsureBtn.style.display = '';
  knowBtn.textContent = L('know');
  knowBtn.onclick = memorizeCurrent;
  unsureBtn.onclick = () => {
    if (!transEl.classList.contains('visible')) {
      transEl.textContent = item[locale] || item.en || '';
      transEl.classList.add('visible');
      unsureBtn.textContent = L('next');
    } else {
      // Next
      nextItem();
    }
  };
}

function renderMemorizedList(container) {
  const mem = loadMemorized();
  const section = document.createElement('div');
  section.className = 'memorized';
  const title = document.createElement('h3');
  title.textContent = L('memorized');
  section.appendChild(title);

  if (!mem.length) {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'No memorized phrases yet.';
    section.appendChild(p);
    return section;
  }

  const list = document.createElement('ul');
  mem.forEach(ph => {
    const li = document.createElement('li');
    const item = dict.find(d => d.phrase === ph) || {phrase: ph};
    const left = document.createElement('div');
    left.className = 'mem-left';
    const p = document.createElement('div');
    p.className = 'mem-phrase';
    p.textContent = item.phrase;
    const s = document.createElement('div');
    s.className = 'mem-trans';
    s.textContent = item[locale] || item.en || '';
    left.appendChild(p);
    left.appendChild(s);

    const btn = document.createElement('button');
    btn.className = 'btn small unmem-btn';
    btn.textContent = L('remove');
    btn.addEventListener('click', () => unmemorize(ph));

    li.appendChild(left);
    li.appendChild(btn);
    list.appendChild(li);
  });
  section.appendChild(list);
  return section;
}

function updateMemorizedSection() {
  const root = document.getElementById('app');
  if (!root) return;
  const old = root.querySelector('.memorized');
  const newSection = renderMemorizedList(root);
  if (old) {
    old.replaceWith(newSection);
  } else {
    root.appendChild(newSection);
  }
}

function render() {
  const root = document.getElementById('app');
  root.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'header';
  const h = document.createElement('h1');
  h.textContent = "Finnish practice";
  header.appendChild(h);
  root.appendChild(header);

  renderLocaleSelect(root);

  const card = document.createElement('div');
  card.className = 'card';
  const phrase = document.createElement('div');
  phrase.className = 'phrase';
  card.appendChild(phrase);
  const trans = document.createElement('div');
  trans.className = 'translation';
  card.appendChild(trans);

  const row = document.createElement('div');
  row.className = 'row actions';
  const knowBtn = document.createElement('button');
  knowBtn.className = 'btn know-btn';
  const unsureBtn = document.createElement('button');
  unsureBtn.className = 'btn unsure-btn';
  row.appendChild(knowBtn);
  row.appendChild(unsureBtn);
  card.appendChild(row);

  root.appendChild(card);

  const mem = renderMemorizedList(root);
  root.appendChild(mem);

  renderQuizCard();
}

async function main() {
  try {
    const res = await fetch('./dict.json');
    dict = await res.json();
  } catch (e) {
    console.error('Failed to load dict.json', e);
    dict = [];
  }
  buildQueue();
  document.getElementById('app').innerHTML = '';
  render();
}

window.addEventListener('DOMContentLoaded', main);