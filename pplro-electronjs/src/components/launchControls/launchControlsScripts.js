let ipcRenderer = require('electron').ipcRenderer;

document.getElementById('windowScale').addEventListener('change', (event) => {
    let scaleValue = document.getElementById('windowScale').value;
    document.getElementById('scaleValue').innerHTML = `${(scaleValue * 100).toFixed(0)} %`
    let data = {
        scaleValue: scaleValue
    }
    console.log(`sent scaleValue ${scaleValue}`);
    ipcRenderer.send('onSetRankWindowViewScale', data);

});

document.getElementById('close').addEventListener('click', (event) => {
    ipcRenderer.send('onCloseRankWindow');
})

document.getElementById('debug').addEventListener('click', (event) => {
    ipcRenderer.send('openRankWindowDebug');
})

document.getElementById('draggable').addEventListener('change', (event) => {
    let draggable = event.currentTarget.checked;
    data = {
        draggable: draggable
    }
    ipcRenderer.send('onSetMainRankWindowDraggable', data);
})

document.getElementById('clickThrough').addEventListener('change', (event) => {
    let clickThrough = event.currentTarget.checked;
    data = {
        clickThrough: clickThrough
    }
    ipcRenderer.send('onSetMainRankWindowClickThrough', data);
})