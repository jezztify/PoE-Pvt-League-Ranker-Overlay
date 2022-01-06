let ipc = require('electron').ipcRenderer;

// ipc Event Handlers
let mainViews = [];
let mainScripts = [];
ipc.on('renderMainView', (event, data) => {
    // Render HTML
    let mainViewDiv = document.getElementById('main');
    let view;
    view = document.createElement('div')
    view.innerHTML = data.content;
    let id = view.getElementsByTagName('div')[0].id;
    if(!mainViews.includes(id)) {
        mainViews.push(id);
        mainViewDiv.appendChild(view);
    }
    
    for(var i = 0; i < mainViews.length; i++) {
        if(mainViews[i] !== id) {
            document.getElementById(mainViews[i]).setAttribute('hidden', true);
        } else {
            document.getElementById(mainViews[i]).removeAttribute('hidden');
        }
    }

    // Render and Execute Scripts
    if(data.scriptPath !== null) {
        let mainScriptsDiv = document.getElementById('mainScripts');

        var script = document.createElement('script');
        let scriptPath = data.scriptPath.replaceAll('\\','\\\\');
        script.innerHTML = `require("${scriptPath}")`;

        if(!mainScripts.includes(script.outerHTML)) {
            mainScriptsDiv.appendChild(script);
            mainScripts.push(script.outerHTML);
        }
    }
})