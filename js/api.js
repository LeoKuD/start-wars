const baseURL = 'https://swapi.dev/api/';

function getData(path, cb) {
  loader.classList.add('loader_visible');
  fetch(baseURL + path)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
    loader.classList.remove('loader_visible');
      cb(data);
    })
    .catch((e) => alert('SERVER NOT FOUND'));
}
