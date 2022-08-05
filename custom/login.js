$ = jQuery;
import lib from "./lib.js";

$('.js-submit').click(function(){

   var username = $('.js-username').val();
   var password = $('.js-password').val();
   
   $('.js-username').css('border','none');
   $('.js-password').css('border','none');

   if(username.length == 0 && password.length == 0){
    $('.js-username').css('border','1px solid red');
    $('.js-password').css('border','1px solid red');
    return;
   }

   if(username.length == 0){
    $('.js-username').css('border','1px solid red');
    return;
   }
   
   if(password.length == 0){
    $('.js-password').css('border','1px solid red');
    return;
   }
   login();
});

// press ENTER key
$('.js-password').keydown(function (e) {
  if (e.keyCode == 13) {
    $('.js-submit').click();
  }
});

// press ENTER key
$('.js-username').keydown(function (e) {
  if (e.keyCode == 13) {
    $('.js-submit').click();
  }
});

// Clear
$('.js-username').on('input', function(){
    init();
});

// Clear
$('.js-password').on('input', function(){
    init();
});

async function login(){
    var username = $('.js-username').val();
    var password = $('.js-password').val();
    
    const data = await lib.auth(username,password);
    
    if(data == false){
        $('.js-username').css('border','1px solid red');
        $('.js-password').css('border','1px solid red');
        $('.js-error-alert').fadeIn(500);
        return;
    }

    lib.store(data.token,data.userId);
    const r_url = `${lib.protocol}//${lib.host}:${lib.port}/scan.html`;
    const el    = $('.js-progress');
    $('.js-success-alert').fadeIn(500);
    lib.countdown(el,r_url);
}

function init(){
    $('.js-username').css('border','none');
    $('.js-password').css('border','none');
    $('.js-error-alert').hide();
    $('.js-success-alert').hide();
    $('.js-progress').hide();
}

