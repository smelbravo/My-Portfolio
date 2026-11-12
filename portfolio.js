const filters = document.querySelector('.filters');
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
    status.textContent = showAll ? 'Todos os projetos' : `${count} projetos na categoria ${category}`;
  });
}
