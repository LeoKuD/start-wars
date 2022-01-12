const baseURL = 'https://swapi.dev/api/';

function getData(path, cb) {
    return arguments.length > 1
      ? fetch(baseURL + path)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            cb(data);
          })
      : fetch(baseURL + path).then((res) => {
          return res.json();
        });
  }