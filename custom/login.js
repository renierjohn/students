(function($) {
    "use strict";   
    console.log('init login')
    var host     = 'renifysite.com'
    var protocol = 'https:';
    
    $('.js-submit').click(function(){
        console.log('clicked')
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
       console.log(username,password) 
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

    function login(){
        var username = $('.js-username').val();
        var password = $('.js-password').val();
        var creds    = JSON.stringify({login:username,password:password});
        fetch(`${protocol}//${host}/api/v1/auth/token`, {
          method: 'POST',
          body:creds
        })
        .then((response) => response.json())
        .then((result) => {
           $('.js-success-alert').fadeIn(500);
           localStorage.setItem('token',result.token);
           localStorage.setItem('uid',result.userId);
           countdown();
        }).catch(() => {
            $('.js-username').css('border','1px solid red');
            $('.js-password').css('border','1px solid red');
            $('.js-error-alert').fadeIn(500);
        })
    }

    function init(){
        $('.js-username').css('border','none');
        $('.js-password').css('border','none');
        $('.js-error-alert').hide();
        $('.js-success-alert').hide();
        $('.js-progress').hide();
    }

    function redirect(){
        document.location.href = `${protocol}//${host}/scan.html`
    }

    
    function countdown(){
        $('.js-progress').show();
        var i = 100;
        var counterBack = setInterval(function(){
          i --;
          if (i > 0) { $('.progress-bar').css('width', i + '%');}
          else {clearInterval(counterBack);redirect();
          }}, 50);
    }    
    

})(jQuery);