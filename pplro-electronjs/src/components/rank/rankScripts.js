let ipc = require('electron').ipcRenderer;

// Initialization
ipc.send('getRankData')


ipc.on('clearRankStatus', (event, data) => {
    document.getElementById('rankStatus').innerHTML = '';
})

ipc.on('setRankStatus', (event, data) => {
    document.getElementById('rankStatus').innerHTML = data;
})
var lastXPH = 0;
var lastExp = 0;
var currExp = 0;
ipc.on('setRankData', (event, data) => {
    if(document.getElementById('rankView')) {
        ipc.emit('clearRankStatus');
        if(data.detail) {
            ipc.emit('setRankStatus', data.detail.errorMessage);
            // document.getElementById('rankStatus').innerHTML = data.detail.errorMessage;
        }

        document.getElementById('level').innerHTML = data.character?data.character.level:'N/A';
        document.getElementById('rank').innerHTML = data.rank?data.rank:'N/A';
        document.getElementById('class').innerHTML = data.character?data.character.class:'N/A';
        
        let XPH;
        currExp = data.character?data.character.experience:0;
        if(lastXPH === 0) {
            XPH = 0;
        } else {
            XPH = lastXPH;
            if(currExp - lastExp > 0) {
                XPH = (currExp - lastExp) * 6 * 60;
            }
        }
        lastXPH = XPH;
        lastExp = currExp;
        document.getElementById('xph').innerHTML = XPH > 0? XPH:'N/A';
        if(data.detail) {
            return
        }
        ipc.send('getRankData');
    }
})