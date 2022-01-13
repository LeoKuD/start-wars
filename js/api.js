const baseURL = 'https://swapi.dev/api/';

function getData(path, cb) {
  loader.classList.add(STYLINGLOADER.loaderVisible);
  fetch(baseURL + path)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
    loader.classList.remove(STYLINGLOADER.loaderVisible);
      cb(data);
    })
    .catch((e) => alert('SERVER NOT FOUND'));
}
