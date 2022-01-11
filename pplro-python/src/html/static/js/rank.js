let formatter = Intl.NumberFormat('en', { notation: 'compact' });
var lastXPH = 0;
var lastExp = 0;
var currExp = 0;
var expTicks = 0;
let setData = (resp) => {
    setTimeout(main, 5000);
    $('#rank').text(resp.rank);
    $('#level').text(resp.character.level);
    $('#class').text(resp.character.class);
    
    let XPH;
    currExp = resp.character.experience;
    if(lastXPH === 0) {
        XPH = 0;
    } else {
        XPH = lastXPH;
        if(currExp - lastExp > 0) {
            XPH = (currExp - lastExp) * 6 * 60;
        }
    }
    lastXPH = XPH;
    lastExp = currExp;
    $('#xph').text(formatter.format(XPH));
}

let setStatus = (msg) => {
    console.log(msg)
    $('#status').text(msg);
}
let getRankData = () => {
    $.ajax({
        type: 'GET',
        url: '/getrank',
        async: true,
        success: (resp) => {
            console.log(resp);
            setData(resp);
        },
        error: (resp) => {
            setStatus(resp.responseJSON.detail.errorMessage);
            $('#settings').show();
        }
    });
}

let bindOnClickSettingsBtn = () => {
    $('#settings').click(() => {
        window.location.href = '/settings'
    })
}

let main = () => {
    $(document).ready((event) => {
        getRankData();
        bindOnClickSettingsBtn();
    });
}

main();