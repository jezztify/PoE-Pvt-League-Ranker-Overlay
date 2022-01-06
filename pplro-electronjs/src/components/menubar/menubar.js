import { app, ipcMain, Menu } from 'electron';

let separator = {
    type: 'separator'
}

let tools = () => {

    let tools = {
        label: 'Tools',
        submenu: [
            {
                label: 'Open Dev Tools',
                role: 'toggleDevTools'
            }
        ]
    }

    return tools
}

let about = () => {
    app.setAboutPanelOptions({
        applicationName: app.getName(),
        applicationVersion: app.getVersion(),
        credits: 'jezztify(jessnarsinues@gmail.com)',
        copyright: 'MIT License 2.0'
    })
    
    let aboutMenu = {
        label: 'About',
        role: 'about'
    }
    
    return aboutMenu
}

let settings = () => {
    let onClick = () => {
        ipcMain.emit('loadSettingsView');
    }

    let settingsMenu = {
        label: 'Settings',
        click: onClick
    }

    return settingsMenu
}

let exit = () => {
    let onClick = () => {
        app.quit();
    }

    let exitMenu = {
        label: 'Quit',
        click: onClick,
        accelerator: 'Alt+F4'
    }

    return exitMenu
}
let menubar = (mainWindow) => {
    const menuTemplate = [
        {
            label: app.getName(),
            submenu: [
                settings(),
                separator,
                exit()
            ]
        },
        tools(mainWindow),
        about()
    ]
    const menubar = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menubar);
}

module.exports = {
    menubar: menubar
}