let ipc = require('electron').ipcRenderer;

// Initialization
ipc.send('getRankData')


ipc.on('clearRankStatus', (event, data) => {
    document.getElementById('rankStatus').innerHTML = '';
})

ipc.on('setRankStatus', (event, data) => {
    document.getElementById('rankStatus').innerHTML = data;
})

var traverse = (thisValue, thisKey=null, finalObj={}) => {
    if( thisValue !== null && typeof thisValue == "object" ) {
        Object.entries(thisValue).forEach(([key, value]) => {
            // key is either an array index or object key
            finalObj = {...traverse(value, key, finalObj)};
        });
    }
    else {
        try {
          finalObj[thisKey] = thisValue;
        }
        catch (e) {
          finalObj = {};
          finalObj[thisKey] = thisValue;
        }
        // jsonObj is a number or string
    }
    return finalObj
};
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

        var collectedData = traverse(data);
        console.log(collectedData);

        Object.entries(collectedData).forEach(([key, value]) => {
            var thisElement = document.getElementById(key);
            if(thisElement) {
                thisElement.innerHTML = value
            }
        })
                
        let XPH;
        currExp = collectedData.expirience?collectedData.expirience:0;
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