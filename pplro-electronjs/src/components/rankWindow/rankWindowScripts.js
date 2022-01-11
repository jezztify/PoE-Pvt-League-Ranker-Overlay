let ipcRenderer = require('electron').ipcRenderer;

// Initialization
ipcRenderer.send('loadRankWindowRankView');

// DOM Event Handlers
let scaleView = (scaleValue) => {
    let rankViewDiv = document.getElementById('rankView');
    rankViewDiv.style.transform = `scale(${scaleValue})`;
    rankViewDiv.style.transformOrigin = '0% 0%';
    let rect = rankViewDiv.getBoundingClientRect();
    window.resizeTo(rect.width,rect.height);
}

// IPC Event Handlers
ipcRenderer.on('setRankWindowViewScale', (event, data) => {
    scaleView(data.scaleValue)
})

ipcRenderer.on('setMainRankWindowDraggable', (event, data) => {
    console.log('RECEIVED DRAGGABLE', data);
    let draggable = document.getElementById('draggable');
    if(data.draggable) {
        draggable.removeAttribute('hidden');
    } else {
        draggable.setAttribute('hidden', true);
    }
})


ipcRenderer.on('renderRankWindow', (event, data) => {
    console.log('Rendering Rank Window');

    // Render HTML
    let mainRankViewDiv = document.getElementById('mainRankView');
    let view;
    view = document.createElement('div')
    view.innerHTML = data.content;
    mainRankViewDiv.appendChild(view);

    // Render and Execute Scripts
    if(data.scriptPath !== null) {
        let mainRankViewScriptsDiv = document.getElementById('mainScripts');
        var script = document.createElement('script');
        let scriptPath = data.scriptPath.replaceAll('\\','\\\\');
        script.innerHTML = `require("${scriptPath}")`;
        mainRankViewScriptsDiv.appendChild(script);
    }

    setTimeout(() => {
        let rankView = document.getElementById('rankView');
        let rect = rankView.getBoundingClientRect();
        window.resizeTo(rect.width, rect.height);
    }, 300);

 
})