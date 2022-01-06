let ipc = require('electron').ipcRenderer;

// Initialization
ipc.send('loadNavbar');

// IPC Event Handlers
ipc.on('renderNavbar', (event, contents) => {
    // Renders
    document.getElementById('navbar').innerHTML = contents;
    
    // DOM Event Handlers
    document.getElementById('settingsBtn').addEventListener('click', (event) => {
        event.preventDefault();
        ipc.send('loadSettingsView');
    });

    document.getElementById('previewBtn').addEventListener('click', (event) => {
        event.preventDefault();
        ipc.send('loadPreview');
        ipc.send('getRankData');
    })

})