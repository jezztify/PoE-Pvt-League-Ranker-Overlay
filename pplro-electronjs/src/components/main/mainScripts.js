let ipcRenderer = require('electron').ipcRenderer;

// ipc Event Handlers

let mainViews = [];
let mainScripts = [];

let mainAddElement = (data) => {
    let mainViewDiv = document.getElementById('mainViews');
    if(!mainViews.includes(data.id)) {
        console.log(`Adding ${data.id} to ${mainViews}`);
        mainViewDiv.appendChild(data.view);
        mainViews.push(data.id);
    }
}

let mainRemoveOtherElements = (data) => {
    console.log(mainViews);
    for(var i = 0; i < mainViews.length; i++) {
        if(mainViews[i] !== data.id) {
            console.log(`Removing ${mainViews[i]} from ${mainViews}`);
            document.getElementById(mainViews[i]).remove();
            mainViews.splice(mainViews.indexOf(mainViews[i]), 1);
        }
    }
}

// ipcRenderer.on('mainAddElement', (event, data) => {
//     mainAddElement(data);
// }) 

ipcRenderer.on('mainRemoveOtherElements', (event, data) => {
    mainRemoveOtherElements(data);
}) 


ipcRenderer.on('renderMainView', (event, data) => {
    // Render HTML
    let view;
    view = document.createElement('div')
    view.innerHTML = data.content;
    let id = view.getElementsByTagName('div')[0].id + 'Group';
    view.id = id
    elementData = {
        view: view,
        id: id
    }
    mainAddElement(elementData);
    
    // Remove unneeded elements
    mainRemoveOtherElements(elementData);


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