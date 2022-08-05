$ = jQuery;
import lib from "./lib.js";

checkLoginStatus();

$('.js-logoff').click(function(e){
    e.preventDefault();
    lib.store('','');
    document.location.href = `${lib.protocol}//${lib.host}:${lib.port}/index.html`;
});

async function checkLoginStatus(){
    const data = await lib.fetch('status')
    const path = document.location.pathname
    if(data.status == true){
        $('.js-logoff').show();
        if(path == '/'){
            setButtonAuth();
        }
    }

    if(data.status == false){
        if(path.startsWith('/scan')){
            const redirect_url = `${lib.protocol}//${lib.host}:${lib.port}/index.html`;
            var width = $(document).width();
            if(width < 500){
                $('.js-alert-message').css('margin-top','3rem')
            }
            $('.scanner').css('margin-top',0)
            $('.js-alert-message').show();
             const js_progress  = $('.js-progress');   
            lib.countdown(js_progress,redirect_url);
        }   
    }
}

function setButtonAuth(){
    $('.js-login-btn').attr('href','#');
    $('.js-login-btn').attr('data-target','#loginModal');
    $('.js-login-btn').attr('data-toggle','modal');
}

