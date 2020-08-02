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
});


