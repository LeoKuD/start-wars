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