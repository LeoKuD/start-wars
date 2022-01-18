import { CATEGORIESKEYS, PAGINATION_CLASS_NAME } from "./constants.js";
import { searchMode, currentPage, currentCategory, input, fillCards, createrPagination } from "./index.js";
import { getData } from "./api.js";

export function findKey(category) {
  return CATEGORIESKEYS[category]
}

export function createMenuCategory(item) {
  return `<li class="left-menu__item" data-category='${item}'><h2 class="left-menu__text">${
    item.charAt(0).toUpperCase() + item.slice(1)
  }</h2></li>`;
}

export function setUrl(category, search='', page='') {
  return `${category}${!searchMode ? '/' : `/?search=${search}`}${searchMode ? `&page=${page}` : `?page=${page}`}`
}

export function clearSearch() {
  input.value = '';
  getData(
    setUrl(currentCategory, input.value, currentPage),
    (data) => {
      fillCards(data.results);
      createrPagination(data);
    }
  );
}

export function setActivePaginationItem(item) {
  if (item === 1 && searchMode) {
    return PAGINATION_CLASS_NAME.paginationItemActive
  }
  else if (item === currentPage && !searchMode) {
    return PAGINATION_CLASS_NAME.paginationItemActive
  }
}