let ipcRenderer = require('electron').ipcRenderer;

// Initialization
// ipcRenderer.send('tester', 'reached settings scripts');

// IPC Event Handlers
ipcRenderer.on('updateSettingsStatus', (event, data) => {
    let settingsStatus = document.getElementById('settingsStatus');
    if(settingsStatus) {
        if(data.hide) {
            settingsStatus.setAttribute('hidden', true);
            settingsStatus.innerHTML = '';
        } else {
            settingsStatus.removeAttribute('hidden')
            settingsStatus.innerHTML = data;
            if(data.toLowerCase().includes('success')){
                settingsStatus.classList.add('text-success');
                settingsStatus.classList.remove('text-warn');
            } else {
                settingsStatus.classList.add('text-warn');
                settingsStatus.classList.remove('text-success');
            }
        }
    }
})

ipcRenderer.on('clearSettingsStatus', (event, data) => {
    let settingsStatus = document.getElementById('settingsStatus');
    settingsStatus.innerHTML = '';
    settingsStatus.setAttribute('hidden');
})

// DOM Event Handlers
document.getElementById('save').addEventListener('click', (event) => {
    let settingsForm = document.getElementById('settingsForm');
    let isFormValid = settingsForm.checkValidity();
    if(!isFormValid) {
        settingsForm.reportValidity();
    } else {
        event.preventDefault();
        let inputs = document.getElementsByTagName('input');
        let data = {};
        for(var i = 0; i < inputs.length; i++) {
            data[inputs[i]['name']] = inputs[i]['value'];
    
        }    
        ipcRenderer.send('onSaveSettings', data);
    }
})

