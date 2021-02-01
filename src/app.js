const {remote, ipcRenderer} = require('electron');

const main = remote.require('./main');

function init() {
    const clientForm = document.getElementById('clientForm');

    const name = document.getElementById('inputName');
    const lastname = document.getElementById('inputLastname');
    const phone = document.getElementById('inputPhone');
    const time = document.getElementById('inputTime');
    const price = document.getElementById('inputPrice');

    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newClient = {
            nombre: name.value,
            apellidos: lastname.value,
            telefono: phone.value,
            hora_llegada: time.value,
            deuda: price.value,
            estado: 0
        };
        console.log(newClient);
        main.addClient(newClient);
        ipcRenderer.send('client:new', newClient);
    })
}
