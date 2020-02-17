var database = firebase.database();

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function colapseSideNav() {
    $("#navbar-toggler").click();
}

$('#registration_form').submit(function () {
    sendRegisterDataToFirebase();
    return false;
});

function sendRegisterDataToFirebase() {
    var inputAllRight = true;

    var manName = document.getElementById("manName").value;
    var womanName = document.getElementById("womanName").value;
    var kidCountOver = document.getElementById("kidCountOver").value;
    var kidCountUntil = document.getElementById("kidCountUntil").value;
    var mail = document.getElementById("mail").value;
    var note = document.getElementById("note").value;

    var permisions = $('#privacy').is(":checked");

    var m1 = $('#m1').is(":checked");
    var m2 = $('#m2').is(":checked");
    var m3 = $('#m3').is(":checked");

    if (permisions == false) {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Podtvrďte spracovanie osobných údajov prosím');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    if (mail === "") {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Prosím vyplnte email');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();



    if(inputAllRight) {
        var dbName ='rodina2019';

        var ubyt ='';
        if (m1 === true) ubyt += "m1"
        if (m2 === true) ubyt += "m2"
        if (m3 === true) ubyt += "m3"

        var myJson = {
            registerTime: { datetime },
            manName: {manName},
            womanName: {womanName},
            kidCountOver: {kidCountOver},
            kidCountUntil: {kidCountUntil},
            email: {mail},
            whereUbyt: {ubyt},
            noteToOrg: {note}
        };
        
        uploadNewRegistration(dbName, myJson);

        var $form = $('form');
        register($form);

        document.getElementById("manName").value = "";
        document.getElementById("womanName").value = "";
        document.getElementById("kidCountOver").value = "";
        document.getElementById("kidCountUntil").value = "";
        document.getElementById("mail").value = "";
        document.getElementById("note").value = "";

        $("#privacy").prop("checked", false);
       
        $('#m1').prop("checked", false);
        $('#m2').prop("checked", false);
        $('#m3').prop("checked", false);
    }
}


function uploadNewRegistration(camp ,imageUrl) {
    var refAlbum = database.ref('registration/'+ camp);
    refAlbum.push(imageUrl).then(function onSuccess(res) {
        console.log(res);
        var div = document.createElement('div');
        div.innerHTML = getSuccessMessage();
        document.getElementById('formError').appendChild(div);
        setInterval(closeAlert, 7000);
        closeAlertErr();
    }).catch(function onError(err) {
        console.log(err);
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Chyba databázy. Skúste nekôr prosím.');
        document.getElementById('formError').appendChild(div);
    });
}


function closeAlert() {
    $("#formAlert").click();
}

function closeAlertErr() {
    $("#formAlertErr").click();
}

function getErrorMessage(error) {
    return '<div class="alert alert-danger">\n' +
        '<div class="container">\n' +
        '<div class="alert-icon">\n' +
        '<i class="material-icons">error_outline</i></div>\n' +
        '<button id="formAlertErr" type="button" class="close" data-dismiss="alert"\n' +
        'aria-label="Close">\n' +
        '<span aria-hidden="true"><i class="material-icons">clear</i></span>\n' +
        '</button>\n' +
        '<b>Chyba:</b>\t  ' + error + ' .\n' +
        '</div>\n' +
        '</div>';
}


function getSuccessMessage() {
    return '<div class="alert alert-success">\n' +
        '<div class="container">\n' +
        '<div class="alert-icon">\n' +
        '<i class="material-icons">check</i>\n' +
        '</div>\n' +
        '<button id="formAlert" type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
        '<span aria-hidden="true"><i class="material-icons">clear</i></span>\n' +
        '</button>\n' +
        'Učastník úspešne registrovaný.\n' +
        '</div>\n' +
        '</div>';
}



function register($form) {
    var mail = $("input[id=mail]").val();
    var mailData = 'EMAIL=' + mail.replace("@", "%40");

    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: mailData,
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        error: function (err) { alert("Could not connect to the registration server. Please try again later."); },
        success: function (data) {
            if (data.result != "success") {
                console.log("something went wrong");
            } else {
                console.log("sucess");
            }
        }
    });
}