import { LOADER_CLASS_NAME, CARD_CLASS_NAME } from './constants.js';
import { cardsWrapper } from './index.js';

const baseURL = 'https://swapi.dev/api';
const loader = document.querySelector('.loader');

export function getData(path, cb) {
  cardsWrapper.classList.toggle(CARD_CLASS_NAME.error, false);
  loader.classList.add(LOADER_CLASS_NAME.visible);
  fetch(`${baseURL}/${path}`)
    .then((res) => res.json())
    .then((data) => {
      loader.classList.remove(LOADER_CLASS_NAME.visible);
      cb(data);
    })
    .catch(() => {
      cardsWrapper.classList.add(CARD_CLASS_NAME.error);
      cardsWrapper.innerHTML = '<h1>SERVER NOT FOUND</h1>';
      loader.classList.remove(LOADER_CLASS_NAME.visible);
    });
}
