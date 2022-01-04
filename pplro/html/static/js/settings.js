let submitForm = (redirectTo) => {
    var $inputs = $('#settingsForm :input').not('button');
    var jsonData = {};
        $inputs.each(function() {
            jsonData[this.name] = $(this).val();
        });
        console.log(jsonData);
        $.ajax({
            type: 'POST',
            url: '/account',
            contentType: 'application/json',
            crossDomain: true,
            dataType: 'json',
            async: true,
            data: JSON.stringify(jsonData),
            success: () => {
                if(redirectTo === 'preview') {
                    $('#previewFrame').empty().append(
                        '<iframe src="/"></iframe>'
                    );
                } else {
                    $(document).ready(function(event) {
                        $('#output').show().html('Successfuly Saved. Redirecting..').removeClass('text-danger').addClass('text-success');
                    }); 
                    setTimeout(function(event) {
                        window.location.href = '/';
                    }, 2000);
                }
            },
            error: () => {
                jQuery(document).ready(function(event) {
                    $('#output').show().html('Failed to save.').removeClass('text-success').addClass('text-danger');
                })
            }
        })
}

let getAccountDetails = () => {
    $.ajax({
        type: 'GET',
        url: '/account',
        async: true,
        success: (resp) => {
            console.log(resp);
            setData(resp);
        }
    });
}

let setData = (resp) => {
    for (var key in resp) {
        $('#' + key).val(resp[key]);
    }
}

$(document).ready(() => {
    getAccountDetails();
})
