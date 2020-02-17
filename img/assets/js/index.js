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

    var opalStart = $('#opalStart').is(":checked");
    var opalPro = $('#opalPro').is(":checked");
    // var opalExtrem = $('#opalExtrem').is(":checked");

    var kidName = document.getElementById("kidName").value;
    var kidBorn = document.getElementById("kidBorn").value;
    var kidPhone = document.getElementById("kidPhone").value;
    var kidMail = document.getElementById("kidMail").value;

    var kidCity = document.getElementById("kidCity").value;
    var kidSchool = document.getElementById("kidSchool").value;

    var kidHealth = document.getElementById("kidHealth").value;
    var kidNote = document.getElementById("kidNote").value;

    var parentName = document.getElementById("parentName").value;
    var parentPhone = document.getElementById("parentPhone").value;
    var parentMail = document.getElementById("parentMail").value;

    var S = $('#S').is(":checked");
    var M = $('#M').is(":checked");
    var L = $('#L').is(":checked");
    var XL = $('#XL').is(":checked");

    var permisions = $('#privacy').is(":checked");

    if (permisions == false) {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Podtvrďte spracovanie osobných údajov prosím');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    if (kidName === "" || kidBorn === "" || kidPhone === "" || kidMail === "" || kidCity === "") {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Prosím vyplnte všetky potrebné polia');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    if ((parentName === "" || parentPhone === "" || parentMail === "") && (opalStart || opalPro)) {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Prosím vyplnte kontakt na rodiča');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    if (S == false && M == false && L == false && XL == false) {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Prosím vyberte si veľkost trička');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    var tShirtPicked = 0;

    if (S == true) tShirtPicked++;
    if (M == true) tShirtPicked++;
    if (L == true) tShirtPicked++;
    if (XL == true) tShirtPicked++;

    if (tShirtPicked > 1) {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Prosím vyberte si len jednu veľkosť trička');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    if (opalStart === false && opalPro === false) {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Prosím vyberte tábor ktorého sa chcete zúčastniť');
        document.getElementById('formError').appendChild(div);
        inputAllRight = false;
    }

    var campsPicked = 0;
    if (opalStart === true) campsPicked++;
    if (opalPro === true) campsPicked++;
    // if(opalExtrem === true) campsPicked++;

    if (campsPicked > 1) {
        var div = document.createElement('div');
        div.innerHTML = getErrorMessage('Prosím vyberte si len jeden tábor do ktorého sa chcete registrovať. Pre registrovanie do dvoch táborov použite registračný formulár znova');
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
        var dbName = '';

        if (opalStart === true) dbName = "start2019"
        if (opalPro === true) dbName = "pro2019"
        // if (opalExtrem === true) dbName = "extrem2019"

        var tShirtSize = '';
        if (S === true) tShirtSize = "S"
        if (M === true) tShirtSize = "M"
        if (L === true) tShirtSize = "L"
        if (XL === true) tShirtSize = "XL"


        var myJson = {
            registerTime: { datetime },
            kidName: { kidName },
            kidBorn: { kidBorn },
            kidPhone: { kidPhone },
            kidMail: { kidMail },
            kidCity: { kidCity },
            kidSchool: { kidSchool },
            kidHealth: { kidHealth },
            kidNote: { kidNote },
            parentName: { parentName },
            parentPhone: { parentPhone },
            parentMail: { parentMail },
            tShirt: { tShirtSize }
        };

        uploadNewRegistration(dbName, myJson);
    
    
        var $form = $('form');
        var mail = $("input[id=kidMail]").val();
        register($form, opalPro, mail);
        var mailParent = $("input[id=parentMail]").val();
        register($form, opalPro, mailParent);


        $("#opalStart").prop("checked", false);
        $("#opalPro").prop("checked", false);
        // $("#opalExtrem").prop("checked", false);

        document.getElementById("kidName").value = "";
        document.getElementById("kidBorn").value = "";
        document.getElementById("kidPhone").value = "";
        document.getElementById("kidMail").value = "";

        document.getElementById("kidCity").value = "";
        document.getElementById("kidSchool").value = "";

        document.getElementById("kidHealth").value = "";
        document.getElementById("kidNote").value = "";

        document.getElementById("parentName").value = "";
        document.getElementById("parentPhone").value = "";
        document.getElementById("parentMail").value = "";

        $("#S").prop("checked", false);
        $("#M").prop("checked", false);
        $("#L").prop("checked", false);
        $("#XL").prop("checked", false);

        $("#privacy").prop("checked", false);
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


function register($form, pro, mail) {
    var mailData = 'EMAIL=' + mail.replace("@", "%40");
    var urlHtml = $form.attr('action');

    if (pro == true) {
        urlHtml = urlHtml + '16ba81aa1e&c=?';
    } else {
        urlHtml = urlHtml + '1be63aced3&c=?';
    }
  
    $.ajax({
        type: $form.attr('method'),
        url: urlHtml,
        data: mailData,
        cache: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        error: function (err) { alert("Could not connect to the registration server. Please try again later."); },
        success: function (data) {
            if (data.result != "success") {
                console.log(data);
                console.log("something went wrong");
            } else {
                console.log("sucess");
            }
        }
    });
}