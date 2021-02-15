const {BrowserWindow, Menu, ipcMain, remote} = require('electron');
const url = require('url');
const path = require('path');
const {getConnection} = require('./database');
/*if (process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}*/

let mainWindow
let newClientWindow
let showClientWindow
let newAsaderaWindow

/*ipcMain.on('asaderas:amount', (e, amount) => {
    newAsaderaWindow.webContents.send('asaderas:amount', amount);
});
*/
function createMainWindow(templateMenu) {
    mainWindow = new BrowserWindow({
        backgroundColor: '#2e2c29',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.resolve(__dirname, 'nav.js')
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.maximize();

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    /*mainWindow.on('closed', () => {
        app.quit();
    })*/
}

function createNewClientWindow() { /////////////// ventana de nuevo cliente ////////////////
    if (newClientWindow == null) {
        newClientWindow = new BrowserWindow({
            width: 800,
            height: 650,
            title: 'Formulario para clientes',
            parent: mainWindow, // esta ventana se mostrará siempre por encima de mainWindow
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                preload: path.resolve(__dirname, 'app.js') // para uso remoto
            }
        });
    }
    //newClientWindow.setMenu(null);
    newClientWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/newClient.html'),
        protocol: 'file',
        slashes: true
    }));
    newClientWindow.on('closed', () => {
        newClientWindow = null;
    });
}

function createShowClientWindow() { ////////////////// ventana para ver a un cliente en especifico ////////
    showClientWindow = new BrowserWindow({
        width: 700,
        height: 550,
        title: 'Cliente',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.resolve(__dirname, 'showClient.js')
        }
    });
    // showClientWindow.setMenu(null);
    showClientWindow.loadURL(url.formar({
        pathname: path.join(__dirname, 'views/showClient.html'),
        protocol: 'file',
        slashes: true
    }));
    showClientWindow.on('closed', () => {
        showClientWindow = null;
    })
}

function createNewAsaderaWindow() { ///////////////// ventana de nuevas asaderas ////////////////
    if (newAsaderaWindow == null) {
        newAsaderaWindow = new BrowserWindow({
            width: 800,
            height: 650,
            title: 'Agregar nuevas asaderas',
            parent: mainWindow,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true,
                preload: path.resolve(__dirname, 'setAsaderas.js')
            }
        });
    }
    // newAsaderaWindow.setMenu(null);
    newAsaderaWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/newAsadera.html'),
        protocol: 'file',
        slashes: true
    }));
    newAsaderaWindow.on('closed', () => {
        newAsaderaWindow = null;
    });
}

function createAsaderasEditWindow() { ////////////////// ventana de edición de asaderas ///////////////////
    newAsaderasEditWindow = new BrowserWindow({
        width: 800,
        height: 650,
        title: "Editar asaderas",
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true
        }
    });
    newAsaderasEditWindow.setMenu(null);
    newAsaderasEditWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/editAsaderas.html'),
        protocol: 'file',
        slashes: true
    }));
    newAsaderasEditWindow.on('closed', () => {
        newAsaderasEditWindow = null;
    })
}

var data;

async function addClient(client) { ///////////////// agregar cliente /////////////////////
    const conn = await getConnection();
    client.deuda = parseFloat(client.deuda);
    await conn.query("INSERT INTO clientes SET ?", client, (error, result) => {
        if (!error) data = result.insertId;
    });
    createNewAsaderaWindow();
    newAsaderaWindow.webContents.on('did-finish-load', () => {
        newAsaderaWindow.webContents.send('newclient:id', data);
    });
    newClientWindow.close();
    // conn.end();
}

var client = [];

async function getClient(clientId) {
    const conn = await getConnection();
    await conn.query("SELECT * FROM clientes WHERE id = ?", clientId, (error, result) => {
        if (!error) client = result;
    });
    createShowClientWindow();
    showClientWindow.webContents.on('did-finish-load', () => {
        showClientWindow.webContents.send('client:data', client);
    });
}

async function givebackToClient(clientId) {
    const conn = await getConnection();
    await conn.query("UPDATE clientes SET estado = 2 WHERE id = ?", clientId);
}

async function deleteClient(clientId) {
    const conn = await getConnection();
    await conn.query("DELETE FROM clientes WHERE id = ?", clientId);
}

var clients = [];

async function getClients() {
    const conn = await getConnection();
    await conn.query(`SELECT cl.*, COUNT(a.id) AS 'amount' FROM clientes cl 
                    LEFT JOIN asaderas a ON cl.id = a.id_cliente 
                    WHERE cl.estado = 1
                    GROUP BY cl.id;`, (error, result) => {
        if (error) throw error;
        else clients = result;
    });
    return clients;
}

var givenback = [];

async function getGivenback() {
    const conn = await getConnection();
    await conn.query(`SELECT cl.*, COUNT(a.id) AS 'amount' FROM clientes cl 
                    LEFT JOIN asaderas a ON cl.id = a.id_cliente 
                    WHERE cl.estado = 2
                    GROUP BY cl.id;`, (error, result) => {
        if (error) throw error;
        else givenback = result;
    });
    return givenback;
}

var clientAsaderas = [];

async function getClientAsaderas(clientId) {
    const conn = await getConnection();
    await conn.query("SELECT * FROM asaderas WHERE id_cliente = ?", clientId, (error, result) => {
        if (error) throw error;
        else clientAsaderas = result;
    });
    return clientAsaderas;
}

async function addAsadera(asadera) { /////////// agregar asadera /////////////////////
    const conn = await getConnection();
    await conn.query("INSERT INTO asaderas SET ?", asadera);
    // conn.end();
}

async function deleteAsadera(asaderaId) {
    const conn = await getConnection();
    await conn.query("DELETE FROM asaderas WHERE id = ?", asaderaId);
}

var asaderas = [];

async function getAsaderas() {
    const conn = await getConnection();
    await conn.query(`SELECT cl.nombre, cl.apellidos, a.id, a.contenido, a.descripcion, a.horno, a.hora_ingreso, a.estado FROM asaderas a 
                    INNER JOIN clientes cl ON cl.id = a.id_cliente
                    WHERE cl.estado = 1
                    ORDER BY a.hora_ingreso ASC;`, (error, result) => {
        if (error) throw error;
        else asaderas = result;
    });
    return asaderas;
}

var oven = [];

async function getOven(num) {
    const conn = await getConnection();
    await conn.query(`SELECT a.id, a.contenido, a.descripcion, cl.nombre, cl.apellidos, a.estado, a.hora_ingreso FROM asaderas a
                    INNER JOIN clientes cl ON cl.id = a.id_cliente
                    WHERE a.horno = ? AND cl.estado = 1
                    ORDER BY a.hora_ingreso ASC;`, num, (error, result) => {
        if (error) throw error;
        else oven = result;
    });
    return oven;
}

module.exports = {
    createMainWindow,
    createNewClientWindow,
    createShowClientWindow,
    createNewAsaderaWindow,
    createAsaderasEditWindow,
    addClient,
    getClient,
    givebackToClient,
    deleteClient,
    addAsadera,
    deleteAsadera,
    getClients,
    getGivenback,
    getClientAsaderas,
    getAsaderas,
    getOven
}