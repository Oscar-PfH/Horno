const {remote, ipcRenderer} = require('electron');

const main = remote.require('./main');

function init() {
    const clientForm = document.getElementById('clientForm');

    const name = document.getElementById('inputName');
    const lastname = document.getElementById('inputLastname');
    const phone = document.getElementById('inputPhone');
    const time = document.getElementById('inputTime');
    const price = document.getElementById('inputPrice');

    showTime();

    clientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newClient = {
            nombre: name.value,
            apellidos: lastname.value,
            telefono: phone.value,
            hora_llegada: time.value,
            deuda: price.value,
            estado: 1
        };
        main.addClient(newClient);
        // ipcRenderer.send('asaderas:amount', amount);
    });
}

function showTime() {
    myDate = new Date();
    hours = myDate.getHours();
    minutes = myDate.getMinutes();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    document.getElementById('inputTime').setAttribute('value', hours + ":" + minutes);
}