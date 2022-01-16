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
const numberElementsOnPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  const content = Object.values(CATEGORIESKEYS).map((item) =>
    createMenuCategory(item)
  );
  categoriesMenu.innerHTML = content.join('');
  categoriesMenu.firstElementChild.classList.add(
    LEFT_MENU_CLASS_NAME.leftMenuItemActive
  );
  getData(currentCategory, (data) => {
    fillCards(data.results);
    createrPagination(data);
  });
});

function fillCards(data) {
  cardsWrapper.textContent = '';
  if (data.length) {
    data.forEach((element, index) => {
      cardsWrapper.append(createCard(element, index++));
    });
  } else {
    cardsWrapper.textContent = 'Nothing found';
  }
}

function createCard(item, index) {
  const selectedCategoryKeysArray = Object.keys(findKey(currentCategory));
  const card = document.createElement('div');
  card.className = CARD_CLASS_NAME.card;
  card.setAttribute(ATTRIBUTES_NAME.dataIndex, index);
  const cardContent = selectedCategoryKeysArray.map((key, index) => {
    let name = findKey(currentCategory)[key];
    return index === 0
      ? `<div class='card__title'><h3 class='card__title-text'>${name} : ${item[key]}</h3><div class='card__drop-down'></div></div>`
      : `<p>${name} : ${item[key]}</p>`;
  });
  cardContent.push(`<p> <a href='${item.url}'>more info...</> </p>`);
  card.innerHTML = cardContent.join('');
  return card;
}

function createrPagination(data) {
  if (data.count) {
    pagination.classList.remove(PAGINATION_CLASS_NAME.paginationHide);
    pagination.textContent = '';
    const paginationArray = [];
    const countPages = Math.ceil(data.count / numberElementsOnPage);
    for (let i = 1; i <= countPages; i++) {
      paginationArray.push(i);
    }

    if (paginationArray.length) {
      const navContent = paginationArray.map(
        (item) =>
          `<li data-index='${item}' class='${
            PAGINATION_CLASS_NAME.paginationItem
          } ${
            (item === currentPage && !searchMode)
              ? PAGINATION_CLASS_NAME.paginationItemActive
              : (item === 1 && searchMode ? PAGINATION_CLASS_NAME.paginationItemActive : '')
          }'>${item}</li>`
      );
      pagination.innerHTML = navContent.join('');
    }
  } else {
    pagination.classList.add(PAGINATION_CLASS_NAME.paginationHide);
  }
}

function togglePages(e) {
  if (e.target.hasAttribute(ATTRIBUTES_NAME.dataIndex)) {
    let items = document.querySelectorAll('.pagination__item');
    items.forEach((elem) =>
      elem.classList.remove(PAGINATION_CLASS_NAME.paginationItemActive)
    );
    e.target.classList.add(PAGINATION_CLASS_NAME.paginationItemActive);
    const page = e.target.getAttribute(ATTRIBUTES_NAME.dataIndex);
    !searchMode && (currentPage = parseInt(page));
    getData(
      currentCategory +
        (searchMode ? `/?search=${input.value}&page=` : '/?page=') +
        page,
      (data) => {
        fillCards(data.results);
      }
    );
  }
}

function search(e) {
  e.preventDefault();
  if (input.value) {
    searchMode = true;
    getData(currentCategory + '/' + `?search=${input.value}`, (data) => {
      fillCards(data.results);
      createrPagination(data);
    });
  } else {
    searchMode = false;
    getData(
      currentCategory + `/?search=${input.value}&page=${currentPage}`,
      (data) => {
        fillCards(data.results);
        createrPagination(data);
      }
    );
  }
}

function showInfo(e) {
  const elem = e.target.closest(ATTRIBUTES_NAME.dataIndexasAtr);
  elem && elem.classList.toggle(CARD_CLASS_NAME.cardShowInfo);
}

pagination.addEventListener('click', togglePages);

categoriesMenu.addEventListener('click', (e) => {
  if (
    e.target.className === LEFT_MENU_CLASS_NAME.leftMenuItem ||
    e.target.className === LEFT_MENU_CLASS_NAME.leftMenuText
  ) {
    currentPage = 1;
    input.value = '';
    categoriesMenu
      .querySelectorAll('.left-menu__item_active')
      .forEach((item) =>
        item.classList.remove(LEFT_MENU_CLASS_NAME.leftMenuItemActive)
      );
    const currentElemets = e.target.closest('[data-category]');

    currentElemets.classList.add(LEFT_MENU_CLASS_NAME.leftMenuItemActive);
    currentCategory = currentElemets.getAttribute(ATTRIBUTES_NAME.dataCategory);
    getData(currentCategory, (data) => {
      fillCards(data.results);
      createrPagination(data);
    });
  }
});

searchBtn.addEventListener('click', search);
myForm.addEventListener('submit', search);

cardsWrapper.addEventListener('click', showInfo);
