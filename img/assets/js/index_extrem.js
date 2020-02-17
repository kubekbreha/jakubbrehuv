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

    var kidName = document.getElementById("kidName").value;
    var kidBorn = document.getElementById("kidBorn").value;
    var kidPhone = document.getElementById("kidPhone").value;
    var kidMail = document.getElementById("kidMail").value;

    var permisions = $('#privacy').is(":checked");
    var car = $('#car').is(":checked");

    if (permisions == false) {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Podtvrďte spracovanie osobných údajov prosím');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    if (kidName === "" || kidBorn === "" || kidPhone === "" || kidMail === "") {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Prosím vyplnte všetky potrebné polia');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }


    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    if (inputAllRight) {
        var dbName = 'extrem2019';

        var myJson = {
            registerTime: { datetime },
            kidName: { kidName },
            kidBorn: { kidBorn },
            kidPhone: { kidPhone },
            kidMail: { kidMail },
            canCar: { car }
        };

        uploadNewRegistration(dbName, myJson);

        var $form = $('form');
        register($form);


        $("#opalStart").prop("checked", false);
        $("#opalPro").prop("checked", false);
        // $("#opalExtrem").prop("checked", false);

        document.getElementById("kidName").value = "";
        document.getElementById("kidBorn").value = "";
        document.getElementById("kidPhone").value = "";
        document.getElementById("kidMail").value = "";

        $("#privacy").prop("checked", false);
        $('#car').prop("checked", false);
    }
}


function uploadNewRegistration(camp, imageUrl) {
    var refAlbum = database.ref('registration/' + camp);
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
    var mail = $("input[id=kidMail]").val();
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