(function($) {
    "use strict"; 

//     import randomSquare from './lib';
// console.log(randomSquare)

   //  var host     = 'renify.local/rest'
   //  var protocol = 'http:';
   //  var port     = document.location.port ? document.location.port : '80'
   //  checkLoginStatus();

   //  $('.js-logoff').click(function(e){
   //      e.preventDefault();
   //      localStorage.setItem('token','');
   //      redirect();
   //  });

   // async function checkLoginStatus(){
   //      var token = localStorage.token;
   //      var uid   = localStorage.uid;

   //      var headers = {
   //        "X-AUTH-TOKEN" : token,
   //        "REQUEST-ID"   : uid,
   //        "method": "GET"
   //      }

   //      if(token == undefined){
   //          headers = {
   //              "REQUEST-ID" : 0,
   //              "method": "GET"
   //          };
   //      }
   //      var url = ' http://renify.local/rest/api/v1/student/status';
   //      // var url = `${protocol}//${host}/api/v1/student/status`;
   //      var data = await fetch(url, {headers})
   //      .then((response) => response.json())
   //      .then((result) => {
   //         return result
   //      }).catch(() => {
   //          return false;
   //      });

   //      console.log(data.status)
   //      var path = document.location.pathname
   //      if(data.status == true){
   //          $('.js-logoff').show();
   //          if(path == '/'){
   //              setButtonAuth()
   //          }

   //      }

   //      if(data.status == false){
   //          if(path.startsWith('/scan')){
   //              var width = $(document).width();
   //              if(width < 500){
   //                  $('.js-alert-message').css('margin-top','3rem')
   //              }
   //              $('.scanner').css('margin-top',0)
   //              $('.js-alert-message').show();
   //              countdown();
   //          }   
   //      }
   //  }

   //  function setButtonAuth(){
   //      $('.js-login-btn').attr('href','#');
   //      $('.js-login-btn').attr('data-target','#loginModal');
   //      $('.js-login-btn').attr('data-toggle','modal');
   //  }

   //  function countdown(){
   //      $('.js-progress').show();
   //      var i = 100;
   //      var counterBack = setInterval(function(){
   //        i --;
   //        if (i > 0) { $('.progress-bar').css('width', i + '%');}
   //        else {clearInterval(counterBack);redirect();
   //        }}, 50);
   //  }

   //  function redirect(){
   //      document.location.href = `${protocol}//student.${host}:${port}/index.html`
   //  }  

})(jQuery);    