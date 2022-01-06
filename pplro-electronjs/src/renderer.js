const {ipcMain} =  require('electron');
const {loadNavbar} =  require('./components/navbar/navbarHandler');
const {setAccountDetails, loadSettingsView, settingsScriptPath} =  require('./components/settings/settingsHandler');
const {getRankData, loadRankView, rankScriptPath} =  require('./components/rank/rankHandler');

let triggerIPCevent = (ipcEvent, data, event=null, mainWindow=null) => {
    if(!event && !mainWindow) {
        console.error(`${ipcEvent} ${data}: Please provide either an event or mainWindow object!`);
        // console.error();
        return
    }
    try {
        event.sender.send(ipcEvent, data);
    } catch {
        mainWindow.webContents.send(ipcEvent, data);
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
        loadRankView().then((content) => {
            let data = {
                content: content,
                scriptPath: rankScriptPath
            }
            triggerIPCevent('renderMainView', data, event, mainWindow);
            triggerIPCevent('setRankStatus', 'Fetching rank data.', event, mainWindow);
        })
    })

    var isGetRankInQueue = false;
    ipcMain.on('getRankData', (event) => {
        // triggerIPCevent('clearRankStatus', null, event, mainWindow);

        if(isGetRankInQueue) {
            let msg = 'getRankData is already in queue. Please wait.';
            console.log(msg);
            triggerIPCevent('setRankStatus', msg, event, mainWindow);
            return
        }

        let rankData = getRankData();
        rankData.then((res) =>{
            res.json().then((json) => {
                if(!json) {
                    isGetRankInQueue = true;
                    setTimeout(() => {
                        rankData
                        .then((res) => {
                            res.json().then((json) => {
                                triggerIPCevent('setRankData', json, event, mainWindow);
                                isGetRankInQueue = false;
                            });
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                    }, 10000);
                } else {
                    if(Object.keys(json).includes('detail')) {
                        triggerIPCevent('setRankStatus', json.detail.errorMessage, event, mainWindow);
                        isGetRankInQueue = false;
                    } else {
                        isGetRankInQueue = true;
                        setTimeout(() => {
                            triggerIPCevent('setRankData', json, event, mainWindow);
                            isGetRankInQueue = false;
                        }, 10000);
                    }
                }
            })
        }).catch((err) => {
            console.error(err);
            triggerIPCevent('setRankStatus', err.message, event, mainWindow);
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

    ipcMain.on('tester', (event, data) => {
        if(data) {
            console.log(data);
        } else {
            console.log('got it.');
        }
        
    })
    console.log('Renderer successfully started.');
}

module.exports = {
    renderer: renderer
};