const baseURL = 'https://swapi.dev/api';



function getData(path, cb) {
  loader.classList.add(LOADER_CLASS_NAME.loaderVisible);
  fetch(`${baseURL}/${path}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      loader.classList.remove(LOADER_CLASS_NAME.loaderVisible);
      cb(data);
    })
    .catch((e) => {
      alert('SERVER NOT FOUND');
      loader.classList.remove(LOADER_CLASS_NAME.loaderVisible);
    });
}
