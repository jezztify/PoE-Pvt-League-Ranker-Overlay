let ipcRenderer = require('electron').ipcRenderer;

// Initialization
ipcRenderer.send('loadNavbar');

// IPC Event Handlers
ipcRenderer.on('renderNavbar', (event, contents) => {
    // Renders
    document.getElementById('navbar').innerHTML = contents;
    
    // DOM Event Handlers
    document.getElementById('settingsBtn').addEventListener('click', (event) => {
        ipcRenderer.send('loadSettingsView');
    });

    document.getElementById('previewBtn').addEventListener('click', (event) => {
        ipcRenderer.send('loadPreview');
        data = {
            'ipcCallBack': {
                event: 'setRankData',
                status: 'setRankStatus'
            }
        }
        ipcRenderer.send('getRankData', data);
    })

    document.getElementById('launchBtn').addEventListener('click', (event) => {
        ipcRenderer.send('loadLaunchControlsView');
        ipcRenderer.send('loadRankWindow');
    });

})