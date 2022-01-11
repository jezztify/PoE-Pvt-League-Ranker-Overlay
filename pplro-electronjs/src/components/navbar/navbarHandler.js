import * as ejs from 'ejs';
import * as path from 'path';

let loadNavbar = () => {
    var templatePath = path.join(__dirname, './navbar.ejs');
    let content;
    ejs.renderFile(templatePath, (err, str) => {
        if(err) {
            console.err(err);
        } else {
            content = str;
        }
    });
    
    return content
}

module.exports = {
    loadNavbar: loadNavbar
}