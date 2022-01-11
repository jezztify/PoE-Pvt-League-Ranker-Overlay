import * as ejs from 'ejs';
import * as path from 'path';
import fetch from 'node-fetch';

let setAccountDetails = (accountDetails) => {
    let url = 'http://localhost:8000/account';
    let settings = {
        method: 'POST',
        body: JSON.stringify(accountDetails),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    let resp = fetch(url, settings)
                .then((res) => {
                    if(res.status !== 200) {
                        return null
                    }
                    res.json()
                })
                .then((json) => {
                    return json
                });
    
    return resp
}

let getAccountDetails = () => {
    let url = 'http://localhost:8000/account';
    let settings = {
        method: 'GET'
    }

    let accountDetails = fetch(url, settings)
                                .then((res) => res.json())
                                .then((json) => {
                                    if(json === null) {
                                        json = {
                                            accountName: null,
                                            leagueName: null,
                                            charName: null
                                        }
                                    }
                                    return json
                                });
    return accountDetails
}

let renderTemplate = async (accountDetails) => {
    var templatePath = path.join(__dirname, './settings.ejs');
    let content;
    ejs.renderFile(templatePath, {accountDetails: accountDetails}, (err, str) => {
        if(err) {
            console.log(err);
        } else {
            content = str;
        }
    });
    return content
}

let loadSettingsView = async () => {
    var accountDetails = await getAccountDetails();
    let content = await renderTemplate(accountDetails);
    return content
}

let settingsScriptPath = path.join(__dirname, './settingsScripts'); //'./components/settings/settingsScripts';

module.exports = {
    loadSettingsView: loadSettingsView,
    settingsScriptPath: settingsScriptPath,
    setAccountDetails: setAccountDetails
}