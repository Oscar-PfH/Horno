const {app} = require('electron');
const {createMainWindow, createNewClientWindow} = require('./main');

app.allowRendererProcessReuse = false;
app.on('ready', () => {
    createMainWindow(templateMenu);
});


const templateMenu = [
    {
        label: 'Archivo',
        submenu: [{
                label: 'Nuevo Cliente',
                accelerator: process.platform == 'darwin' ? 'command+N' : 'Ctrl+N',
                click() {
                    createNewClientWindow()
                }
            }]
    },
    {
        label: 'Salir',
        accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
        click() {
            app.quit();
        }
    }
];



if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    });
}

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname);
    templateMenu.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'Show/Hide Dev Tools',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
