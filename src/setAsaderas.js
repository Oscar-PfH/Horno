const {remote, ipcRenderer} = require('electron');

const main = remote.require('./main');

var ClientId;

ipcRenderer.on('newclient:id', (e, data) => {
    ClientId = data;
});

function renderClientsList(clients) {
    const clientsList = document.getElementById('inputClient');
    
    clientsList.innerHTML = '';
    var i = 1;
    Array.from(clients).forEach(client => {
        if (i == clients.length) {
            clientsList.innerHTML += `
                <option value="${client.id}" selected>${client.nombre + ' ' + client.apellidos}</option>
            `;
        }
        else {
            clientsList.innerHTML += `
                <option value="${client.id}">${client.nombre + ' ' + client.apellidos}</option>
            `;
        }
        i++;
    });
}

async function initnewa() {
    const clients = await main.getClients();
    renderClientsList(clients);

    const asaderasForm = document.getElementById('asaderasForm');

    const clientId = document.getElementById('inputClient');
    const content = document.getElementById('inputContent');
    const desc = document.getElementById('inputDesc');
    const time = document.getElementById('inputTime');
    const oven = document.getElementById('inputOven');
    const status = document.getElementById('inputStatus');

    asaderasForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newAsadera = {
            id_cliente: clientId.value,
            contenido: content.value,
            descripcion: desc.value,
            hora_ingreso: time.value,
            horno: oven.value,
            estado: status.value
        };
        main.addAsadera(newAsadera);
        alert('Datos guardados satisfactoriamente');
        asaderasForm.reset();
        content.focus();
    });
}

initnewa();