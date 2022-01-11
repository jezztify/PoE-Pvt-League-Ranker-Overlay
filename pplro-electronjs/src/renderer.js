const {ipcMain,BrowserWindow} =  require('electron');
const {loadNavbar} =  require('./components/navbar/navbarHandler');
const {setAccountDetails, loadSettingsView, settingsScriptPath} =  require('./components/settings/settingsHandler');
const {getRankData, loadRankView, rankScriptPath} =  require('./components/rank/rankHandler');
const {loadRankWindow} = require('./components/rankWindow/rankWindowHandler');
const {loadLaunchControlsView, launchControlsScripts} = require('./components/launchControls/launchControlsHandler');

var mainRankWindow;

let triggerIPCevent = (ipcEvent, data, event=null, thisWindow=null, ...args) => {
    if(!event && !thisWindow) {
        console.error(`${ipcEvent} ${data}: Please provide either an event or mainWindow object!`);
        // console.error();
        return
    }
    try {
        console.log(`Triggering ${ipcEvent} via event object`);
        event.sender.send(ipcEvent, data, ...args);
    } catch {
        try {
            console.log(`Triggering ${ipcEvent} via window object`);
            thisWindow.webContents.send(ipcEvent, data, ...args);
        } 
        catch {
            try {
                console.log(`Trigger ${ipcEvent} via getFocusedWindow`);
                BrowserWindow.getFocusedWindow().webContents.send(ipcEvent, data, ...args)
            }
            catch (e) {
                console.error(`Failed to trigger ${ipcEvent}.`);
                console.error(e);
            }

        }
    }
}

let renderer = (mainWindow) => {
    console.log('Starting Renderer.');

    ipcMain.on('loadNavbar', (event) => {
        const content = loadNavbar();
        triggerIPCevent('renderNavbar', content, event, mainWindow)
    });

    ipcMain.on('loadSettingsView', (event) => {
        loadSettingsView().then((content) => {
            let data = {
                content: content,
                scriptPath: settingsScriptPath
            }
            triggerIPCevent('renderMainView', data, event, mainWindow);
            triggerIPCevent('updateSettingsStatus', {hide: true}, event, mainWindow);
        });
    });

    ipcMain.on('loadPreview', (event) => {
        loadRankView(true).then((content) => {
            let data = {
                content: content,
                scriptPath: rankScriptPath
            }
            triggerIPCevent('renderMainView', data, event, mainWindow);
            triggerIPCevent('setRankStatus', 'Fetching rank data.', event, mainWindow, { hideLaunchBtn:true });
        })
    })

    ipcMain.on('loadRankWindowRankView', (event) => {
        loadRankView(false).then((content) => {
            let data = {
                content: content,
                scriptPath: rankScriptPath
            }
            triggerIPCevent('renderRankWindow', data, null, mainRankWindow);
            triggerIPCevent('setRankStatus', 'Fetching rank data.', null, mainRankWindow);
        })
    })

    ipcMain.on('loadLaunchControlsView', (event) => {
        loadLaunchControlsView().then((content) => {
            let data = {
                content: content,
                scriptPath: launchControlsScripts
            }
            triggerIPCevent('renderMainView', data, event, mainWindow);
        })
    })

    // var isGetRankInQueue = false;
    ipcMain.on('getRankData', (event, data) => {
        // triggerIPCevent('clearRankStatus', null, event, mainWindow);

        // if(isGetRankInQueue) {
        //     let msg = 'getRankData is already in queue. Please wait.';
        //     console.log(msg);
        //     triggerIPCevent('setRankStatus', msg, event, mainWindow, { hideLaunchBtn:true });
        //     return
        // }

        let ipcCallBack = data.ipcCallBack;
        let rankData = getRankData();
        rankData.then((res) =>{
            res.json().then((json) => {
                if(!json) {
                    // isGetRankInQueue = true;
                    setTimeout(() => {
                        rankData
                        .then((res) => {
                            res.json().then((json) => {
                                triggerIPCevent(ipcCallBack.event, json, event, mainWindow);
                                // isGetRankInQueue = false;
                            });
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                    }, 5000);
                } else {
                    if(Object.keys(json).includes('detail')) {
                        triggerIPCevent(ipcCallBack.status, json.detail.errorMessage, event, mainWindow, { hideLaunchBtn:true });
                        isGetRankInQueue = false;
                    } else {
                        triggerIPCevent(ipcCallBack.event, json, event, mainWindow);
                        // isGetRankInQueue = true;
                        // setTimeout(() => {
                        //     triggerIPCevent(ipcCallBack.event, json, event, mainWindow);
                        //     // isGetRankInQueue = false;
                        // }, 5000);
                    }
                }
            })
        }).catch((err) => {
            console.error(err);
            triggerIPCevent(ipcCallBack.status, err.message, event, mainWindow, { hideLaunchBtn:true });
        })

    })

    ipcMain.on('onSaveSettings', (event, data) => {
        let resp = setAccountDetails(data);
        let msg = 'Error saving account details!';
        if(resp) {
            msg = 'Successfully saved!'
        }
        triggerIPCevent('updateSettingsStatus', msg, event, mainWindow);
    })

    ipcMain.on('onSetRankWindowViewScale', (event, data) => {
        triggerIPCevent('setRankWindowViewScale', data, null, mainRankWindow);
        // event.sender.send('setRankWindowViewScale', data);
        // triggerIPCevent('setRankWindowViewScale', data, event, mainRankWindow);
    })

    ipcMain.on('tester', (event, data) => {
        if(data) {
            console.log(data);
        } else {
            console.log('got it.');
        }
        
    })

    ipcMain.on('loadRankWindow', (event) => {
        try {
            mainRankWindow.close();
        } catch {
            console.log('no rankWindow detected.');
        }
        mainRankWindow = loadRankWindow();
    })

    ipcMain.on('openRankWindowDebug', (event) => {
        mainRankWindow.webContents.openDevTools();
    })

    ipcMain.on('onCloseRankWindow', (event) => {
        console.log('closed');
        if(mainRankWindow) {
            try {
                mainRankWindow.close();
            } catch {
                console.error('No rankWindow detected.');
            }
            mainRankWindow = null;
        }
    })

    ipcMain.on('onSetMainRankWindowDraggable', (event, data) => {
        console.log(`Setting Rank Window to ${data.draggable?'draggable': 'not draggable'}`);
        try {
            mainRankWindow.setIgnoreMouseEvents(!data.draggable);
            triggerIPCevent('setMainRankWindowDraggable', data, null, mainRankWindow);
        } catch {
            console.log('No rankWindow detected.')
        }
    })
    console.log('Renderer successfully started.');
}

module.exports = {
    renderer: renderer
};