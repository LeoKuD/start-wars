import { getData } from './api.js';
import { PEOPLE_LIB, PLANETS_LIB, FILMS_LIB, SPECIES_LIB, VEHICLES_LIB, STARSHIPS_LIB } from './library.js';
import { PEOPLE_KEY,PLANETS_KEY, FILMS_KEY, SPECIES_KEY, VEHICLES_KEY, STARSHIPS_KEY } from './library.js';
import { PATHKEYS } from './library.js';

const itemWrapper = document.querySelector('.item-wrapper');
const navigation = document.getElementById('navigation');
const categoriesMenu = document.querySelector('.menu');
const input = document.querySelector('.search__input');
const body = document.body;

let currentCategory = PATHKEYS.people;
let currentPage = 1;
let searchMode = false;
let navArray = [];

function fillHtm(data) {
  itemWrapper.textContent = '';
  data.forEach((element, index) => {
    itemWrapper.append(createCard(element, index + 1));
  });
}

function findKey(category) {
  switch (category) {
    case PATHKEYS.people:
      return PEOPLE_KEY;
    case PATHKEYS.planets:
      return PLANETS_KEY;
    case PATHKEYS.films:
      return FILMS_KEY;
    case PATHKEYS.species:
      return SPECIES_KEY;
    case PATHKEYS.vehicles:
      return VEHICLES_KEY;
    case PATHKEYS.starships:
      return STARSHIPS_KEY;

    default:
      break;
  }
}
function findLib(category) {
  switch (category) {
    case PATHKEYS.people:
      return PEOPLE_LIB;
    case PATHKEYS.planets:
      return PLANETS_LIB;
    case PATHKEYS.films:
      return FILMS_LIB;
    case PATHKEYS.species:
      return SPECIES_LIB;
    case PATHKEYS.vehicles:
      return VEHICLES_LIB;
    case PATHKEYS.starships:
      return STARSHIPS_LIB;

    default:
      break;
  }
}

function createCard(item, index) {
  const card = document.createElement('div');
  const url = item.url
    .slice(item.url.lastIndexOf('/', item.url.length - 2))
    .replace(/\//g, '');
  card.className = 'item';
  card.setAttribute('data-index', index);
  card.setAttribute('data-url', url);
  const cardContent = findKey(currentCategory).map((key, index) => {
    return index === 0
      ? `<h3>${findLib(currentCategory)[key]} : ${item[key]}</h3>`
      : `<h4 class='more-info'>${findLib(currentCategory)[key]} : ${
          item[key]
        }</h4>`;
  });
  card.innerHTML = cardContent.join('');
  return card;
}

function createrNavigation(data) {
  navigation.textContent = '';
  navArray = [];
  const countPages = Math.ceil(data.count / 10);
  for (let i = 0; i < countPages; i++) {
    navArray.push(i);
  }

  if (navArray.length > 0) {
    navArray.forEach((elem) => {
      const li = document.createElement('li');
      li.className = 'nav-buttom_item';
      li.textContent = elem + 1;
      currentPage === elem + 1
        ? (li.setAttribute('data-index', elem + 1), li.classList.add('active'))
        : li.setAttribute('data-index', elem + 1);
      navigation.append(li);
    });
  }
}

function togglePages(e) {
  if (e.target.hasAttribute('data-index')) {
    let items = document.querySelectorAll('.nav-buttom_item');
    items.forEach((elem) => elem.classList.remove('active'));
    e.target.classList.add('active');
    const url = e.target.getAttribute('data-index');
    currentPage = url;
    getData(
      currentCategory +
        (searchMode ? `/?search=${input.value}&page=` : '/?page=') +
        url,
      (data) => {
        fillHtm(data.results);
      }
    );
  }
}

function search() {
  if (input.value) {
    searchMode = true;
    getData(currentCategory + '/' + `?search=${input.value}`, (data) => {
      fillHtm(data.results);
      createrNavigation(data);
    });
  } else {
    searchMode = false;
    getData(currentCategory, (data) => {
      fillHtm(data.results);
      createrNavigation(data);
    });
  }
}

function showInfo(e) {
  const elem = e.target.closest('[data-url]');
  if (elem) {
    const block = elem.querySelectorAll('.more-info');
    block.forEach((item) => item.classList.toggle('visible'));
  } else {
    const block = itemWrapper.querySelectorAll('.visible');
    block.forEach((item) => item.classList.remove('visible'));
  }
}

navigation.addEventListener('click', togglePages);

categoriesMenu.addEventListener('click', (e) => {
  categoriesMenu.querySelectorAll('.active').forEach(item => item.classList.remove('active'))
  if (e.target.tagName === 'H2' || e.target.tagName === 'LI') {
    e.target.closest('.menu__item').classList.add('active')
    e.target.tagName === 'H2'
      ? (currentCategory = e.target.textContent.toLocaleLowerCase())
      : (currentCategory =
          e.target.firstElementChild.textContent.toLocaleLowerCase());
    getData(currentCategory, (data) => {
      fillHtm(data.results);
      currentPage = 1;
      createrNavigation(data);
      input.value = '';
    });
  }
});

input.addEventListener('input', search);

body.addEventListener('click', showInfo);
