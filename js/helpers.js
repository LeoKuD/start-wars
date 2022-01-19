import { CATEGORIESKEYS, PAGINATION_CLASS_NAME } from './constants.js';
import {
  searchMode,
  currentPage,
  currentCategory,
  input,
  fillCards,
  createrPagination,
} from './index.js';
import { getData } from './api.js';

export function findKey(category) {
  return CATEGORIESKEYS[category];
}

function setCategoryName(item) {
  return `<li class="left-menu__item" data-category='${item}'><h2 class="left-menu__text">${
    item.charAt(0).toUpperCase() + item.slice(1)
  }</h2></li>`;
}

export function createMenuCategory(item) {
  return setCategoryName(item);
}

export function setUrl(category, search = '', page = '') {
  return `${category}${!searchMode ? '/' : `/?search=${search}`}${
    searchMode ? `&page=${page}` : `?page=${page}`
  }`;
}

export function clearSearch() {
  input.value = '';
  getData(setUrl(currentCategory, input.value, currentPage), (data) => {
    fillCards(data.results);
    createrPagination(data);
  });
}

export function setActivePaginationItem(item) {
  if (item === 1 && searchMode) {
    return PAGINATION_CLASS_NAME.activeItem;
  } else if (item === currentPage && !searchMode) {
    return PAGINATION_CLASS_NAME.activeItem;
  }
}

export function createCardContent(
  item,
  selectedCategoryKeys,
  selectedCategoryNames
) {
  const cardContent = selectedCategoryKeys.map((key, index) => {
    let name = selectedCategoryNames[index];
    return index === 0
      ? `<div class='card__title'><h3 class='card__title-text'>${name} : ${item[key]}</h3><div class='card__drop-down'></div></div>`
      : `<p>${name} : ${item[key]}</p>`;
  });
  cardContent.push(
    `<p> <a target='_blank' href='${item.url}'>more info...</> </p>`
  );
  return cardContent.join('');
}

export function createPageItem(item) {
  return `<li data-index='${item}' class='${
    PAGINATION_CLASS_NAME.item
  } ${setActivePaginationItem(item)}'>${item}</li>`;
}

export function getCurrntPage(currentPage = 1, searchMode, page) {
  return searchMode ? currentPage : parseInt(page);
}
