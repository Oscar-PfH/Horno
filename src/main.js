const {BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const {getConnection} = require('./database');

/*if (process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    });
}*/


ipcMain.on('client:new', (e, newClient) => {
    mainWindow.webContents.send('client:new', newClient);
    newClientWindow.close();
    console.log(newClient);
});

let mainWindow
let newClientWindow

function createMainWindow(templateMenu) {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
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

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    /*mainWindow.on('closed', () => {
        app.quit();
    })*/
}

function createNewClientWindow() { ////////////////// nuevo cliente //////////////
    newClientWindow = new BrowserWindow({
        width: 800,
        height: 650,
        title: 'Formulario para clientes',
        parent: mainWindow, // esta ventana se mostrará siempre por encima de mainWindow
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.resolve(__dirname, 'app.js')
        }
    });
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

function createNewAsaderaWindow() { ///////////////// nueva asadera ////////////////
    newAsaderaWindow = new BrowserWindow({
        width: 600,
        height: 450,
        title: 'Agregar una nueva asadera',
        webPreferences: {
            nodeIntegration: true
        }
    });
    newAsaderaWindow.setMenu(null);
    newAsaderaWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/newAsadera.html'),
        protocol: 'file',
        slashes: true
    }));
    newAsaderaWindow.on('closed', () => {
        newAsaderaWindow = null;
    });
}

async function addClient(client) { ///////////////// agregar cliente /////////////////////
    const conn = await getConnection();
    client.deuda = parseFloat(client.deuda);
    const result = await conn.query("INSERT INTO clientes SET ?", client);
    console.log(result);
    conn.end();
}

var results = [];

async function getClients() {
    const conn = await getConnection();
    await conn.query("SELECT * FROM clientes", (error, result) => {
        if (error) throw error;
        else results = result;
    });
    return results;
}

module.exports = {
    createMainWindow,
    createNewClientWindow,
    createNewAsaderaWindow,
    addClient,
    getClients
}