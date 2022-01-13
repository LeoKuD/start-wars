// import { getData } from './api.js';
// import {
//   PEOPLE,
//   PLANETS,
//   FILMS,
//   SPECIES,
//   VEHICLES,
//   STARSHIPS,
// } from './library.js';
// import {
//   PEOPLE_KEY,
//   PLANETS_KEY,
//   FILMS_KEY,
//   SPECIES_KEY,
//   VEHICLES_KEY,
//   STARSHIPS_KEY,
// } from './library.js';
// import { CATEGORIESKEYS } from './library.js';

const cardsWrapper = document.querySelector('.cards-wrapper');
const pagination = document.getElementById('pagination');
const categoriesMenu = document.querySelector('.left-menu__wrapper');
const input = document.querySelector('.search__input');
const searchBtn = document.querySelector('.fa-search');
const loader = document.querySelector('.loader');
const myForm = document.querySelector('.my-form');
const body = document.body;

let currentCategory = CATEGORIESKEYS.people;
let currentPage = 1;
let searchMode = false;
let currentCardNumber = undefined;

document.addEventListener('DOMContentLoaded', () => {
  const content = Object.values(CATEGORIESKEYS).map(
    (item) =>
      `<li class="left-menu__item" data-category='${item}'><h2 class="left-menu__text">${
        item[0].toLocaleUpperCase() + item.slice(1)
      }</h2></li>`
  );
  categoriesMenu.innerHTML = content.join('');
  categoriesMenu.firstElementChild.classList.add('left-menu__item_active');
  getData(currentCategory, (data) => {
    fillHtm(data.results);
    createrPagination(data);
  });
});

function fillHtm(data) {
  cardsWrapper.textContent = '';
  if (data.length) {
    data.forEach((element, index) => {
      cardsWrapper.append(createCard(element, index + 1));
    });
  } else {
    cardsWrapper.textContent = 'Nothing found';
  }
}

function findKey(category) {
  switch (category) {
    case CATEGORIESKEYS.people:
      return PEOPLE;
    case CATEGORIESKEYS.planets:
      return PLANETS;
    case CATEGORIESKEYS.films:
      return FILMS;
    case CATEGORIESKEYS.species:
      return SPECIES;
    case CATEGORIESKEYS.vehicles:
      return VEHICLES;
    case CATEGORIESKEYS.starships:
      return STARSHIPS;

    default:
      break;
  }
}

function createCard(item, index) {
  const card = document.createElement('div');
  card.className = 'card';
  const itemUrl = item.url
    .slice(item.url.lastIndexOf('/', item.url.length - 2))
    .replace(/\//g, '');
  card.setAttribute('data-index', index);
  card.setAttribute('item-url', itemUrl);
  const cardContent = Object.keys(findKey(currentCategory)).map(
    (key, index) => {
      return index === 0
        ? `<div class='card__title'><h3 class='card__title-text'>${
            findKey(currentCategory)[key]
          } : ${item[key]}</h3><div class='card__drop-down'></div></div>`
        : `<p>${findKey(currentCategory)[key]} : ${item[key]}</p>`;
    }
  );
  card.innerHTML = cardContent.join('');
  return card;
}

function createrPagination(data) {
  pagination.textContent = '';
  const paginationArray = [];
  const countPages = Math.ceil(data.count / 10);
  for (let i = 1; i <= countPages; i++) {
    paginationArray.push(i);
  }

  if (paginationArray.length) {
    const navContent = searchMode
      ? paginationArray.map(
          (item) =>
            `<li data-index='${item}' class='pagination__item ${
              item === 1 ? 'pagination__item_active' : ''
            }' >${item}</li>`
        )
      : paginationArray.map(
          (item) =>
            `<li data-index='${item}' class='pagination__item ${
              currentPage === item ? 'pagination__item_active' : ''
            }' >${item}</li>`
        );
    pagination.innerHTML = navContent.join('');
  }
}

function togglePages(e) {
  if (e.target.hasAttribute('data-index')) {
    currentCardNumber = undefined;
    let items = document.querySelectorAll('.pagination__item');
    items.forEach((elem) => elem.classList.remove('pagination__item_active'));
    e.target.classList.add('pagination__item_active');
    const page = e.target.getAttribute('data-index');
    currentPage = parseInt(page);
    getData(
      currentCategory +
        (searchMode ? `/?search=${input.value}&page=` : '/?page=') +
        page,
      (data) => {
        fillHtm(data.results);
      }
    );
  }
}

function search(e) {
  e.preventDefault();
  if (input.value) {
    searchMode = true;
    getData(currentCategory + '/' + `?search=${input.value}`, (data) => {
      fillHtm(data.results);
      createrPagination(data);
    });
  } else {
    searchMode = false;
    getData(
      currentCategory + `/?search=${input.value}&page=${currentPage}`,
      (data) => {
        fillHtm(data.results);
        createrPagination(data);
      }
    );
  }
}

function showInfo(e) {
  const elem = e.target.closest('[data-index]');
  if (elem && !currentCardNumber) {
    currentCardNumber = elem.getAttribute('data-index');
    elem.classList.add('card_show-info');
  } else if (elem && elem.getAttribute('data-index') !== currentCardNumber) {
    elem.classList.add('card_show-info');
    cardsWrapper
      .querySelector(`[data-index='${currentCardNumber}']`)
      .classList.remove('card_show-info');
    currentCardNumber = elem.getAttribute('data-index');
  } else if (elem && elem.getAttribute('data-index') === currentCardNumber) {
    elem.classList.toggle('card_show-info');
  } else if (cardsWrapper.querySelector('.card_show-info')) {
    cardsWrapper
      .querySelector('.card_show-info')
      .classList.remove('card_show-info');
  }
}

pagination.addEventListener('click', togglePages);

categoriesMenu.addEventListener('click', (e) => {
  console.log(e.target.className);
  if (
    e.target.className === 'left-menu__item' ||
    e.target.className === 'left-menu__text'
  ) {
    categoriesMenu
      .querySelectorAll('.left-menu__item_active')
      .forEach((item) => item.classList.remove('left-menu__item_active'));
    const currentElemets = e.target.closest('[data-category]');

    currentElemets.classList.add('left-menu__item_active');
    currentCategory = currentElemets.getAttribute('data-category');
    getData(currentCategory, (data) => {
      fillHtm(data.results);
      createrPagination(data);
      currentPage = 1;
      input.value = '';
    });
  }
});

searchBtn.addEventListener('click', search);
myForm.addEventListener('submit', search);

cardsWrapper.addEventListener('click', showInfo);
