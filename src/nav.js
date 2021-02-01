const main = require('electron').remote.require('./main');

let clientsList = document.getElementById('clients');

function renderClients(clients) {
    clientsList.innerHTML = '';
    Array.from(clients).forEach(client => {
        clientsList.innerHTML += `
        <tr>
            <td class='fila'>${client.id}</td>
            <td class='fila'>${client.nombre + ' ' + client.apellidos}</td>
            <td class='fila'>${client.telefono}</td>
            <td class='fila'>${client.hora_llegada}</td>
            <td class='fila'>${'cantidad'}</td>
            <td class='fila'>${client.deuda}</td>
            <td class='fila'>${client.estado}</td>
            <td>
                <?php include('asaderaForm.php'); ?>
                <button type="button" id="entregar-btn" class="btn btn-warning btn-xs" onclick="entregarAsadera(<?php echo $row['id']; ?>)">Entregar</button>
                <button type="button" id="eliminar" class="btn btn-danger btn-xs" onclick="eliminarAsadera(<?php echo $row['id']; ?>)">Eliminar</button>
            </td>
        </tr>
        `;
    });
}

let clients = [];

const getClients = async () => {
    clients = await main.getClients();
    renderClients(clients);
}

function initmain() {
    getClients();
}

initmain();