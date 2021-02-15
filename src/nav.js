const main = require('electron').remote.require('./main');

let tableHead = document.getElementById('theader');
let tableBody = document.getElementById('tbody');

function renderClients(clients) {
    tableHead.innerHTML = '';
    tableHead.innerHTML += `
        <tr>
            <th scope='col' class='idcol'>ID</th>
            <th scope='col' class='clientcol1'>Cliente</th>
            <th scope='col' class='clientcol2'>Teléfono</th>
            <th scope='col' class='clientcol3'>Hora de llegada</th>
            <th scope='col' class='clientcol4'># Asaderas</th>
            <th scope='col' class='clientcol5'>Deuda</th>
            <th scope='col' class='clientcol6'>Acción</th>
        </tr>
    `;
    tableBody.innerHTML = '';
    Array.from(clients).forEach(client => {
        if (client.telefono == 0) client.telefono = '---';
        let fullName = '`' + client.nombre + ' ' + client.apellidos + '`';
        tableBody.innerHTML += `
            <tr class='table-dark'>
                <td class='idcol' scope='row'>${client.id}</td>
                <td class='clientcol1'>${client.nombre + ' ' + client.apellidos}</td>
                <td class='clientcol2'>${client.telefono}</td>
                <td class='clientcol3'>${client.hora_llegada}</td>
                <td class='clientcol4'>${client.amount}</td>
                <td class='clientcol5'>S/${client.deuda.toFixed(2)}</td>
                <td class='clientcol6'>
                    <button type="button" id="verclienteButton" class="btn btn-info btn-sm" onclick="getClient(${client.id})">Ver cliente</button>
                    <button type="button" id="editarButton" class="btn btn-primary btn-sm" onclick="EditClient(${client.id})">Editar</button>
                    <button type="button" id="entregar-btn" class="btn btn-warning btn-sm" onclick="givebackToClient(${client.id}, ${fullName}, ${client.amount})">Entregar</button>
                    <button type="button" id="eliminar" class="btn btn-danger btn-sm" onclick="deleteClient(${client.id}, ${fullName})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function renderAsaderas(asaderas) {
    tableHead.innerHTML = '';
    tableHead.innerHTML += `
        <tr>
            <th class='idcol'>ID</th>
            <th class='asaderacol1'>Contenido</th>
            <th class='asaderacol2'>Descripción</th>
            <th class='asaderacol3'>Cliente</th>
            <th class='asaderacol4'>Horno</th>
            <th class='asaderacol5'>Estado</th>
            <th class='asaderacol6'>Hora de ingreso</th>
            <th class='asaderacol7'>Acción</th>
        </tr>
    `;
    tableBody.innerHTML = '';
    Array.from(asaderas).forEach(asadera => {
        if (asadera.hora_ingreso == null) asadera.hora_ingreso = '--:--';
        if (asadera.estado == 1) asadera.estado = 'En espera';
        else if (asadera.estado == 2) asadera.estado = 'En horno';
        else if (asadera.estado == 3) asadera.estado = 'Listo';
        tableBody.innerHTML += `
            <tr class='table-dark'>
                <td class='idcol'>${asadera.id}</td>
                <td class='asaderacol1'>${asadera.contenido}</td>
                <td class='asaderacol2'>${asadera.descripcion}</td>
                <td class='asaderacol3'>${asadera.nombre + ' ' + asadera.apellidos}</td>
                <td class='asaderacol4'>${asadera.horno}</td>
                <td class='asaderacol5'>${asadera.estado}</td>
                <td class='asaderacol6'>${asadera.hora_ingreso}</td>
                <td class='asaderacol7'>
                    <button type="button" id="verasaderaeButton" class="btn btn-primary btn-xs" onclick="getAsadera(${asadera.id})">Editar</button>
                    <button type="button" id="eliminar" class="btn btn-danger btn-xs" onclick="deleteAsadera(${asadera.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function renderOven(oven) {
    tableHead.innerHTML = '';
    tableHead.innerHTML += `
        <tr>
            <th class='idcol'>ID</th>
            <th class='ovencol1'>Contenido</th>
            <th class='ovencol2'>Descripción</th>
            <th class='ovencol3'>Cliente</th>
            <th class='ovencol4'>Estado</th>
            <th class='ovencol5'>Hora ingreso</th>
        </tr>
    `;
    tableBody.innerHTML = '';
    Array.from(oven).forEach(asadera => {
        if (asadera.hora_ingreso == null) asadera.hora_ingreso = '--:--';
        if (asadera.estado == 1) asadera.estado = 'En espera';
        else if (asadera.estado == 2) asadera.estado = 'En horno';
        else if (asadera.estado == 3) asadera.estado = 'Listo';
        tableBody.innerHTML += `
            <tr class='table-dark'>
                <td class='idcol'>${asadera.id}</td>
                <td class='ovencol1'>${asadera.contenido}</td>
                <td class='ovencol2'>${asadera.descripcion}</td>
                <td class='ovencol3'>${asadera.nombre + ' ' + asadera.apellidos}</td>
                <td class='ovencol4'>${asadera.estado}</td>
                <td class='ovencol5'>${asadera.hora_ingreso}</td>
            </tr>
        `;
    });
}

function renderGivenback(clients) {
    tableHead.innerHTML = '';
    tableHead.innerHTML += `
        <tr>
            <th scope='col' class='idcol'>ID</th>
            <th scope='col' class='gbcol1'>Cliente</th>
            <th scope='col' class='gbcol2'>Teléfono</th>
            <th scope='col' class='gbcol3'>Hora de llegada</th>
            <th scope='col' class='gbcol4'># Asaderas</th>
            <th scope='col' class='gbcol5'>Deuda</th>
            <th scope='col' class='gbcol6'>Acción</th>
        </tr>
    `;
    tableBody.innerHTML = '';
    Array.from(clients).forEach(client => {
        if (client.telefono == 0) client.telefono = '---';
        tableBody.innerHTML += `
            <tr class='table-dark'>
                <td class='idcol'>${client.id}</td>
                <td class='gbcol1'>${client.nombre + ' ' + client.apellidos}</td>
                <td class='gbcol2'>${client.telefono}</td>
                <td class='gbcol3'>${client.hora_llegada}</td>
                <td class='gbcol4'>${client.amount}</td>
                <td class='gbcol5'>S/${client.deuda.toFixed(2)}</td>
                <td class='gbcol6'>
                    <button type="button" id="verclienteButton" class="btn btn-primary btn-xs" onclick="getClient(${client.id})">Ver cliente</button>
                    <button type="button" id="recuperarButton" class="btn btn-primary btn-xs" onclick="retrieveClient(${client.id})">Recuperar</button>
                </td>
            </tr>
        `;
    });
}

let results;

const getClients = async () => {
    results = await main.getClients();
    renderClients(results);
}

const getClient = async (clientId) => {
    await main.getClient(clientId);
}

const givebackToClient = async (clientId, fullName, amount) => {
    if (amount == 0) alert("No hay asaderas a nombre de " + fullName);
    else {
        var bool = confirm("¿Quiere entregar la(s) asadera(s) de " + fullName + '?');
        if (bool) {
            await main.givebackToClient(clientId);
            alert('Entregado!')
            getClients();
        }
        else {alert('Ha ocurrido un problema!')}
    }
}

const deleteClient = async (clientId, fullName) => {
    var bool = confirm("¿Seguro que quiere eliminar la información de " + fullName + "(#" + clientId + ")?");
    if (bool) {
        await main.deleteClient(clientId);
        alert('Cliente eliminado');
        await getClients();
    }
}

const getAsaderas = async () => {
    results = await main.getAsaderas();
    renderAsaderas(results);
}

const deleteAsadera = async (asaderaId) => {
    var bool = confirm("¿Seguro que quiere eliminar la asadera #" + asaderaId + '?');
    if (bool){
        await main.deleteAsadera(asaderaId);
        await getAsaderas();
    }
}

const getOven = async (num) => {
    results = await main.getOven(num);
    renderOven(results);
}

const getGivenback = async () => {
    results = await main.getGivenback();
    renderGivenback(results);
}

async function initmain() {
    await getClients();
    contentButtons();
}

function displayNewClientWindow() {
    main.createNewClientWindow();
}

function displayNewAsaderaWindow() {
    main.createNewAsaderaWindow();
}

function editAsaderas(id) {
    main.createAsaderasEditWindow(id);
}

function contentButtons() {
    const clients = document.getElementById("clientes");
    clients.classList.add('active');
    // clients.classList.toggle('active');

    const buttons = document.getElementsByClassName('button');

    Array.from(buttons).forEach(button => {
        button.addEventListener('click', async function () {
            var page = this.getAttribute('id');
            document.getElementById("clientes").classList.remove('active');
            document.getElementById("asaderas").classList.remove('active');
            document.getElementById("horno1").classList.remove('active');
            document.getElementById("horno2").classList.remove('active');
            document.getElementById("entregados").classList.remove('active');
            document.getElementById(page).classList.add('active');

            switch (page) {
                case 'clientes': await getClients(); break;
                case 'asaderas': await getAsaderas(); break;
                case 'horno1': await getOven(1); break;
                case 'horno2': await getOven(2); break;
                case 'entregados': await getGivenback(); break;
                default: await getClients(); break;
            }
        });
    });
}

initmain();