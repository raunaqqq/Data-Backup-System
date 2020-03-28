const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow} = electron;
function createWindow(){
    let screenElectron = electron.screen
    let mainScreen = screenElectron.getPrimaryDisplay();
    let dimensions = mainScreen.size;
    let win = new BrowserWindow({icon:__dirname+'/web/ongcpic.png',frame:false,
        width: dimensions.width,
        height: dimensions.height,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.setTitle('GEOPIC Data Backup System');
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join(__dirname,'index.html'),
        protocol: 'File:',
        slashes: true
    }))
}
app.on('ready',createWindow);