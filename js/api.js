import { LOADER_CLASS_NAME } from './constants.js';
import { cardsWrapper } from './index.js';
const baseURL = 'https://swapi.dev/api';
const loader = document.querySelector('.loader');

export function getData(path, cb) {
  loader.classList.add(LOADER_CLASS_NAME.loaderVisible);
  fetch(`${baseURL}/${path}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      loader.classList.remove(LOADER_CLASS_NAME.loaderVisible);
      cb(data);
    })
    .catch(() => {
      cardsWrapper.textContent = 'SERVER NOT FOUND';
      loader.classList.remove(LOADER_CLASS_NAME.loaderVisible);
    });
}
