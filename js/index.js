import {
  CATEGORYES,
  CARD_CLASS_NAME,
  ATTRIBUTES_NAME,
  PAGINATION_CLASS_NAME,
  LEFT_MENU_CLASS_NAME,
} from './constants.js';

import {
  findKey,
  createMenuCategory,
  setUrl,
  clearSearch,
  setActivePaginationItem,
} from './helpers.js';

import { getData } from './api.js';

export const cardsWrapper = document.querySelector('.cards-wrapper');
const pagination = document.querySelector('.pagination');
const categoriesMenu = document.querySelector('.left-menu__wrapper');
export const input = document.querySelector('.search__input');
const clearSearchBtn = document.querySelector('.fa-times');
const myForm = document.querySelector('.my-form');
const burgerBtn = document.querySelector('.menu__btn');
const burgerInput = document.getElementById('menu-toggle');
const body = document.body;

export let currentCategory = CATEGORYES[0];
export let currentPage = 1;
export let searchMode = false;
const numberElementsOnPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  const content = CATEGORYES.map((item) => createMenuCategory(item));
  categoriesMenu.innerHTML = content.join('');
  categoriesMenu.firstElementChild.classList.add(
    LEFT_MENU_CLASS_NAME.activeItem
  );
  getData(currentCategory, (data) => {
    fillCards(data.results);
    createrPagination(data);
  });
});

export function fillCards(data) {
  cardsWrapper.textContent = '';
  if (data.length) {
    data.forEach((element, index) => {
      cardsWrapper.append(createCard(element, index++));
    });
  } else {
    cardsWrapper.classList.add('cards-wrapper_error');
    cardsWrapper.innerHTML = '<h1>Nothing found</h1>';
  }
}

function createCard(item, index) {
  const selectedCategoryKeysArray = Object.keys(findKey(currentCategory));
  const selectedCategoryNamesArray = Object.values(findKey(currentCategory));
  const card = document.createElement('div');
  card.className = CARD_CLASS_NAME.card;
  card.setAttribute(ATTRIBUTES_NAME.dataIndex, index);
  const cardContent = selectedCategoryKeysArray.map((key, index) => {
    let name = selectedCategoryNamesArray[index];
    return index === 0
      ? `<div class='card__title'><h3 class='card__title-text'>${name} : ${item[key]}</h3><div class='card__drop-down'></div></div>`
      : `<p>${name} : ${item[key]}</p>`;
  });
  cardContent.push(
    `<p> <a target='_blank' href='${item.url}'>more info...</> </p>`
  );
  card.innerHTML = cardContent.join('');
  return card;
}

export function createrPagination(data) {
  if (data.count) {
    pagination.classList.remove(PAGINATION_CLASS_NAME.hide);
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
            PAGINATION_CLASS_NAME.item
          } ${setActivePaginationItem(item)}'>${item}</li>`
      );
      pagination.innerHTML = navContent.join('');
    }
  } else {
    pagination.classList.add(PAGINATION_CLASS_NAME.hide);
  }
}

function togglePages(e) {
  if (e.target.hasAttribute(ATTRIBUTES_NAME.dataIndex)) {
    let items = document.querySelectorAll('.pagination__item');
    items.forEach((elem) =>
      elem.classList.remove(PAGINATION_CLASS_NAME.activeItem)
    );
    e.target.classList.add(PAGINATION_CLASS_NAME.activeItem);
    const page = e.target.getAttribute(ATTRIBUTES_NAME.dataIndex);
    currentPage = searchMode ? currentPage : parseInt(page);
    getData(setUrl(currentCategory, input.value, page), (data) => {
      fillCards(data.results);
    });
  }
}

function search(e) {
  e.preventDefault();
  if (input.value) {
    searchMode = true;
    getData(setUrl(currentCategory, input.value), (data) => {
      fillCards(data.results);
      createrPagination(data);
    });
  } else {
    searchMode = false;
    clearSearch(searchMode);
  }
}

function showInfo(e) {
  const elem = e.target.closest(ATTRIBUTES_NAME.dataIndexasAtr);
  elem && elem.classList.toggle(CARD_CLASS_NAME.showInfo);
}

pagination.addEventListener('click', togglePages);

categoriesMenu.addEventListener('click', (e) => {
  if (
    e.target.className === LEFT_MENU_CLASS_NAME.item ||
    e.target.className === LEFT_MENU_CLASS_NAME.text
  ) {
    currentPage = 1;
    input.value = '';
    categoriesMenu
      .querySelectorAll('.left-menu__item_active')
      .forEach((item) =>
        item.classList.remove(LEFT_MENU_CLASS_NAME.activeItem)
      );
    const currentElemets = e.target.closest('[data-category]');

    currentElemets.classList.add(LEFT_MENU_CLASS_NAME.activeItem);
    currentCategory = currentElemets.getAttribute(ATTRIBUTES_NAME.dataCategory);
    getData(currentCategory, (data) => {
      fillCards(data.results);
      createrPagination(data);
    });
  }
});

clearSearchBtn.addEventListener('click', () => {
  clearSearch();
  searchMode = false;
});
myForm.addEventListener('submit', search);
cardsWrapper.addEventListener('click', showInfo);

body.addEventListener('click', (e) => {
  if (burgerInput.checked && !e.target.closest('.left-menu')) {
    burgerBtn.click();
  }
});
