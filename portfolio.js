const filters = document.querySelector('#project-filters');
const buttons = filters.querySelectorAll('button');
const cards = document.querySelectorAll('.card');
const featured = document.querySelector('.featured');
const archive = document.querySelector('.archive');
const status = document.querySelector('#filter-status');

archive.open = false;
filters.hidden = false;

for (const button of buttons) {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    const showAll = category === 'Todos';
    let count = 0;

    for (const candidate of buttons) {
      candidate.setAttribute('aria-pressed', String(candidate === button));
    }

    for (const card of cards) {
      card.hidden = !showAll && card.dataset.category !== category;
      if (!card.hidden) count += 1;
    }

    featured.hidden = !featured.querySelector('.card:not([hidden])');
    archive.hidden = !archive.querySelector('.card:not([hidden])');
    archive.open = !showAll;
    announceFilter(button, count);
  });
}

const picker = document.querySelector('#language-picker');
const languages = picker.querySelectorAll('button');
const languageKey = 'portfolio-language';
const translatedText = Array.from(document.querySelectorAll('[data-en]'), element => {
  const node = Array.from(element.childNodes).find(child => child.nodeType === Node.TEXT_NODE && child.data.trim());
  const original = node.data;
  return { node, original, english: original.replace(original.trim(), element.dataset.en) };
});
const translatedAttributes = ['aria-label', 'alt', 'content'].flatMap(attribute =>
  Array.from(document.querySelectorAll(`[data-en-${attribute}]`), element => ({
    element,
    attribute,
    original: element.getAttribute(attribute),
    english: element.getAttribute(`data-en-${attribute}`),
  }))
);

function announceFilter(button, count) {
  const english = document.documentElement.lang === 'en';
  if (button.dataset.filter === 'Todos') {
    status.textContent = english ? 'All projects' : 'Todos os projetos';
  } else {
    const category = button.textContent;
    status.textContent = english ? `${count} projects in ${category}` : `${count} projetos na categoria ${category}`;
  }
}

function setLanguage(language) {
  const english = language === 'en';
  document.documentElement.lang = english ? 'en' : 'pt-PT';
  for (const { node, original, english: translation } of translatedText) {
    node.data = english ? translation : original;
  }
  for (const { element, attribute, original, english: translation } of translatedAttributes) {
    element.setAttribute(attribute, english ? translation : original);
  }
  for (const button of languages) {
    button.setAttribute('aria-pressed', String(button.lang === document.documentElement.lang));
  }
  if (status.textContent) {
    const activeFilter = filters.querySelector('[aria-pressed="true"]');
    announceFilter(activeFilter, Array.from(cards).filter(card => !card.hidden).length);
  }
}

let savedLanguage;
try {
  savedLanguage = localStorage.getItem(languageKey);
} catch {
  // The selector still works when storage is unavailable.
}
setLanguage(savedLanguage);
picker.hidden = false;

for (const button of languages) {
  button.addEventListener('click', () => {
    setLanguage(button.lang);
    try {
      localStorage.setItem(languageKey, button.lang);
    } catch {
      // Keep the current language for this visit.
    }
  });
}
