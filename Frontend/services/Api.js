var API_URL = 'http://192.168.1.7:8000/api/roles';

function getRoles() {
    return fetch(API_URL)
    .then(function (response) {
        return response.json();
    })
}

function postRoles(role) {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(role)
    })
    .then(function (response) {
        return response.json();
    })

}

function updateRoles(role, id) {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(role)
    })
    .then(function (response) {
        return response.json();
    })
}

function deleteRoles(id) {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        return response.json();
    })
}

module.exports  = {
    getRoles: getRoles,
    postRoles: postRoles,
    updateRoles: updateRoles,
    deleteRoles: deleteRoles,
}