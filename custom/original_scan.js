(function($) {
    "use strict"; 
    var host     = 'renify.local/rest'
    var protocol = 'http:';
    var port     = document.location.port ? document.location.port : '80'

    var video           = document.createElement("video");
    var canvasElement   = document.getElementById("canvas");
    var canvas          = canvasElement.getContext("2d");
    var detect          = $('input[name="state"]');

   $('.js-spinner').hide() 
   $('.js-scan').click(function(){

  $('.js-scan').hide();
    setBorderError();
    startWebcam();
  });


   function startWebcam(){
        detect[0].value = '1';
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
          video.srcObject = stream;
          video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
          video.play();
             $('.js-camera ').hide();
          requestAnimationFrame(render);
          $('.qr_stop').click(function(){
              stream.getVideoTracks().forEach(function(track) {
                  track.stop();
              });
          });
        });
    }

    function render() {
      // loadingMessage.innerText = "⌛ Loading video..."
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvasElement.hidden   = false;
          canvasElement.height = 400;
          canvasElement.width  = 400;

        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code      = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          // drawLine(code.location.topLeftCorner, code.location.topRightCorner,       "#FF3B58");
          // drawLine(code.location.topRightCorner, code.location.bottomRightCorner,   "#FF3B58");
          // drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
          // drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner,     "#FF3B58");

          $('#js-qr').html(' ');
          new QRCode(document.getElementById('js-qr'),code.data);

          canvasElement.height = 0;
          canvasElement.width  = 0;
          canvasElement.hidden = true;
          video.hidden = true;
          detect[0].value = '0';
          console.log(code.data);
          $('#canvas').attr('width',400);
          $('#canvas').attr('height',400);

          $('.js-camera ').show();
          $('.js-scan').show();
          setBorderOk();
          setTimer();
          // requestUSer(code.data);
        } 
      }

      if(detect[0].value == '1'){
        requestAnimationFrame(render);
      }
    }

    function setBorderOk(){
        $('.box').css('border', '5px solid green');
    }

    function setBorderError(){
        $('.box').css('border', '1px solid red');
    }

    function setTimer(){
        setTimeout(function(){
            console.log('init')
            setBorderError();
            $('.js-scan').hide();
            startWebcam();
        },3000)
    }

    async function requestUSer(qr){
        var token = localStorage.token;
        var uid   = localStorage.uid;

        var headers = {
          "X-AUTH-TOKEN" : token,
          "REQUEST-ID"   : uid,
          "method": "GET"
        }

        var url = `${protocol}//${host}/api/v1/student/status`;
        var data = await fetch(url, {headers})
        .then((response) => response.json())
        .then((result) => {
           return result
        }).catch(() => {
            return false;
        });

        console.log(data.status)
        var path = document.location.pathname
        if(data.status == true){
            $('.js-logoff').show();
            if(path == '/'){
                setButtonAuth()
            }

        }

        if(data.status == false){
            if(path.startsWith('/scan')){
                var width = $(document).width();
                if(width < 500){
                    $('.js-alert-message').css('margin-top','3rem')
                }
                $('.scanner').css('margin-top',0)
                $('.js-alert-message').show();
                countdown();
            }   
        }
    }

})(jQuery);    