import {BrowserWindow} from 'electron'
import * as path from 'path';

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
    return rankWindow
}

module.exports = {
    loadRankWindow: loadRankWindow
}