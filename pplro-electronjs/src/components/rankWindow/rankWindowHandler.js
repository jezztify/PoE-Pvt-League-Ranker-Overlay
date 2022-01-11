let BrowserWindow = require('electron').BrowserWindow;
let path = require('path');

let loadRankWindow = (parentWindow) => {
    let rankWindow = new BrowserWindow({
        parent: parentWindow,
        transparent: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    // rankWindow.webContents.openDevTools();
    rankWindow.loadFile(path.join(__dirname,'rankWindow.html'));
    rankWindow.on('close', (event) => {
        rankWindow.webContents.send('closeRankWindow');
        rankWindow = null;
    })
    return rankWindow
}

module.exports = {
    loadRankWindow: loadRankWindow
}