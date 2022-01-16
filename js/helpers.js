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

function createMenuCategory(item) {
  return `<li class="left-menu__item" data-category='${item}'><h2 class="left-menu__text">${
    item.charAt(0).toUpperCase() + item.slice(1)
  }</h2></li>`;
}

function setUrl(category, search='', page='') {
  console.log(`${category}${search && `/?search=${search}`}${page && `&page=${page}`}`);
  return `${category}${search && `/?search=${search}`}${page && `/?page=${page}`}`
}