var endPoint = "http://172.20.10.4:8000/api/users";

export function post(datos) {
    return fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(function response() {
      return response.json();
    })
    .then (function (data) {
      return data;
    })
}