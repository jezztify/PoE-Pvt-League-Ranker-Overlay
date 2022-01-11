let ipcRenderer = require('electron').ipcRenderer;

// Initialization
getRankDataParams = {
    'ipcCallBack': {
        event: 'setRankData',
        status: 'setRankStatus'
    }
}
ipcRenderer.send('getRankData', getRankDataParams);


ipcRenderer.on('clearRankStatus', (event, data) => {
    document.getElementById('rankStatus').innerHTML = '';
})

ipcRenderer.on('setRankStatus', (event, data, hideLaunchBtn=false) => {
    let launchBtn = document.getElementById('launchBtn');
    if(launchBtn && hideLaunchBtn) {
        launchBtn.setAttribute('hidden', true);
    }
    let rankStatusDiv = document.getElementById('rankStatus');
    if(rankStatusDiv) {
        rankStatusDiv.innerHTML = data;
    }
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
ipcRenderer.on('setRankData', (event, data) => {
    if(document.getElementById('rankView')) {
        ipcRenderer.emit('clearRankStatus');
        if(data.detail) {
            ipcRenderer.emit('setRankStatus', data.detail.errorMessage, { hideLaunchBtn:true });
            
            return;
            // document.getElementById('rankStatus').innerHTML = data.detail.errorMessage;
        }

        let launchBtn = document.getElementById('launchBtn');
        if(launchBtn) {
            launchBtn.removeAttribute('hidden');
        }

        var collectedData = traverse(data);

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

        data = {
            'ipcCallBack': {
                event: 'setRankData',
                status: 'setRankStatus'
            }
        }

        setTimeout(() => {
            ipcRenderer.send('getRankData', data);
        }, 5000);
    }
})