
import * as ejs from 'ejs';
import * as path from 'path';


let renderTemplate = async () => {
    var templatePath = path.join(__dirname, './launchControls.ejs');
    let content;
    ejs.renderFile(templatePath, (err, str) => {
        if(err) {
            console.log(err);
        } else {
            content = str;
        }
    });
    return content
}

let loadLaunchControlsView = async () => {
    let content = await renderTemplate();
    return content
}

let launchControlsScripts = path.join(__dirname, './launchControlsScripts');

module.exports = {
    loadLaunchControlsView: loadLaunchControlsView,
    launchControlsScripts: launchControlsScripts
}