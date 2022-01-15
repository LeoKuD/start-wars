const cardsWrapper = document.querySelector('.cards-wrapper');
const pagination = document.querySelector('.pagination');
const categoriesMenu = document.querySelector('.left-menu__wrapper');
const input = document.querySelector('.search__input');
const searchBtn = document.querySelector('.fa-search');
const loader = document.querySelector('.loader');
const myForm = document.querySelector('.my-form');
const body = document.body;

let currentCategory = CATEGORIESKEYS.people;
let currentPage = 1;
let searchMode = false;

document.addEventListener('DOMContentLoaded', () => {
  const content = Object.values(CATEGORIESKEYS).map(
    (item) =>
      `<li class="left-menu__item" data-category='${item}'><h2 class="left-menu__text">${
        item[0].toLocaleUpperCase() + item.slice(1)
      }</h2></li>`
  );
  categoriesMenu.innerHTML = content.join('');
  categoriesMenu.firstElementChild.classList.add(
    MENUSTYLING.leftMenuItemActive
  );
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

function createCard(item, index) {
  const card = document.createElement('div');
  card.className = CARDSTYLING.card;
  const itemUrl = item.url
    .slice(item.url.lastIndexOf('/', item.url.length - 2))
    .replace(/\//g, '');
  card.setAttribute(ATTRIBUTESNAMES.dataIndex, index);
  card.setAttribute(ATTRIBUTESNAMES.itemUrl, itemUrl);
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
  if (data.count) {
    pagination.classList.remove(STYLINGPAGINATION.paginationHide);
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
  } else {
    pagination.classList.add(STYLINGPAGINATION.paginationHide);
  }
}

function togglePages(e) {
  if (e.target.hasAttribute(ATTRIBUTESNAMES.dataIndex)) {
    let items = document.querySelectorAll(STYLINGPAGINATION.paginationItem);
    items.forEach((elem) =>
      elem.classList.remove(STYLINGPAGINATION.paginationItemActive)
    );
    e.target.classList.add(STYLINGPAGINATION.paginationItemActive);
    const page = e.target.getAttribute(ATTRIBUTESNAMES.dataIndex);
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
  const elem = e.target.closest(ATTRIBUTESNAMES.dataIndexasAtr);
  elem && elem.classList.toggle(CARDSTYLING.cardShowInfo)
}

pagination.addEventListener('click', togglePages);

categoriesMenu.addEventListener('click', (e) => {
  console.log(e.target.className);
  if (
    e.target.className === MENUSTYLING.leftMenuItem ||
    e.target.className === MENUSTYLING.leftMenuText
  ) {
    currentPage = 1;
    input.value = '';
    categoriesMenu
      .querySelectorAll('.left-menu__item_active')
      .forEach((item) => item.classList.remove(MENUSTYLING.leftMenuItemActive));
    const currentElemets = e.target.closest('[data-category]');

    currentElemets.classList.add(MENUSTYLING.leftMenuItemActive);
    currentCategory = currentElemets.getAttribute(ATTRIBUTESNAMES.dataCategory);
    getData(currentCategory, (data) => {
      fillHtm(data.results);
      createrPagination(data);
    });
  }
});

searchBtn.addEventListener('click', search);
myForm.addEventListener('submit', search);

cardsWrapper.addEventListener('click', showInfo);
