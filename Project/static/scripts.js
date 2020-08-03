// https://stackoverflow.com/questions/22297964/bootstrap-tabs-next-previous-buttons-for-forms
// https://codepen.io/michalwyrwa/pen/GBaPPj
$(document).ready(function() {

    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').show();
        } else {
            $('#back-to-top').hide();
        }
    });
    // scroll body to 0px on click
    $('#back-to-top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
        return false;
    });

    $('.btnNext').click(function(event) {
        event.preventDefault();
        $('.nav > .nav-item > .active').parent().next('li').find('a').trigger('click');
        event.stopPropagation();
    });
    
    $('.btnPrevious').click(function(event) {
        event.preventDefault();
        $('.nav > .nav-item > .active').parent().prev('li').find('a').trigger('click');
        event.stopPropagation();
    });

    // This is kludgy, but when there is not a lot of time it is a solution to the problem
    $('#destin').change(function() {
        let destin = $('#destin').val();

        $('#depart').empty();

        switch (destin) {
            case 'luna':
                $('#depart').append($('<option></option>').attr('value', '2020-08-28').text('8-28-2020'));
                $('#depart').append($('<option></option>').attr('value', '2020-09-29').text('9-29-2020'));
                $('#depart').append($('<option></option>').attr('value', '2020-10-26').text('10-26-2020'));
                break;
            case 'mercury':
                $('#depart').append($('<option></option>').attr('value', '2020-11-24').text('11-24-2020'));
                $('#depart').append($('<option></option>').attr('value', '2021-11-07').text('11-07-2021'));
                $('#depart').append($('<option></option>').attr('value', '2022-10-19').text('10-19-2022'));
                break;
            case 'venus':
                $('#depart').append($('<option></option>').attr('value', '2021-10-11').text('10-11-2021'));
                break;
            case 'mars':
                $('#depart').append($('<option></option>').attr('value', '2022-08-07').text('8-7-2022'));
                $('#depart').append($('<option></option>').attr('value', '2024-09-26').text('9-26-2024'));
                $('#depart').append($('<option></option>').attr('value', '2026-11-15').text('11-15-2026'));
                break;
            case 'jupiter':
                $('#depart').append($('<option></option>').attr('value', '2021-05-04').text('5-4-2021'));
                $('#depart').append($('<option></option>').attr('value', '2022-06-07').text('6-7-2022'));
                $('#depart').append($('<option></option>').attr('value', '2023-07-10').text('7-10-2023'));
                break;
        }
    });

    $('#confirm').click(function(event) {
        if ($(this).is(':checked')) {
            $('.btnSubmit').removeClass('btn-warning');
            $('.btnSubmit').addClass('btn-success');
            $('.btnSubmit').removeAttr('disabled');
        } else {
            $('.btnSubmit').removeClass('btn-success');
            $('.btnSubmit').addClass('btn-warning');
            $('.btnSubmit').attr('disabled', true);
        }
        
    });

    $('#booking').submit(function(event) {
        event.preventDefault();
        $('#contact-tab').addClass('disabled');
        $('#trip-tab').addClass('disabled');
        $('#confirm-tab').addClass('disabled');
        $('#download-tab').removeClass('disabled');
        $('.nav > .nav-item > .active').parent().next('li').find('a').trigger('click');

        var request = new XMLHttpRequest();

        let nameFirst = $('#nameFirst').val();
        let nameLast = $('#nameLast').val();
        let address = $('#inputAddress').val() + ", " + $('#inputAddress2').val() + ", " 
            + $('#inputCity').val() + ", " + $('#inputState').val() + " " + $('#inputZip').val();
        let state = $('#inputState').val();
        let destin = $('#destin option:selected').val();
        let depart = $('#depart option:selected').val();

        var content = 
            {namefirst: nameFirst, namelast: nameLast, address: address, state: state, destin: destin, depart: depart};

        request.open('POST', '/api', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.responseType = 'blob';
        request.send(JSON.stringify(content));

        request.addEventListener('load', function() {
            if (request.status >= 200 && request.status < 400) {
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.style = "display: none;";
                // var link = $('#download-link');

                var blob = new Blob([request.response], {type: 'application/pdf'});

                let fileURL = URL.createObjectURL(blob);

                a.href = fileURL;
                a.download = "ticket.pdf";

                // link.attr("href", fileURL);
                // link.attr("download", "ticket.pdf");
                // link.attr("target", "_blank");

                a.click();

                // link.click();
                URL.revokeObjectURL(fileURL);

            } else {
                console.error("BAD");
            }
        });

        event.stopPropagation();
    });
});


