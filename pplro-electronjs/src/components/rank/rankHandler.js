import * as ejs from 'ejs';
import * as path from 'path';
import fetch from 'node-fetch';

let getRankData = async () => {
    let url = 'http://localhost:8000/getrank';
    let settings = {
        method: 'GET',
    }
    return fetch(url, settings);
}

let renderTemplate = async (isMainView) => {
    var templatePath = (path.join(__dirname, './rank.ejs'));
    let content;
    ejs.renderFile(templatePath, {isMainView: isMainView}, (err, str) => {
        if(err) {
            console.log(err);
        } else {
            content = str;
        }
    });
    return content
}

let loadRankView = async (isMainView) => {
    let content = await renderTemplate(isMainView);
    return content
}

let rankScriptPath = path.join(__dirname, './rankScripts'); //'./components/rank/rankScripts'; //

module.exports = {
    loadRankView: loadRankView,
    rankScriptPath: rankScriptPath,
    getRankData: getRankData
}