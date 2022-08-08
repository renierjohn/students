$ = jQuery;
import library   from "./common.js?v=1.1";
const lib = library.lib;

var video           = document.createElement("video");
var canvasElement   = document.getElementById("canvas");
var canvas          = canvasElement.getContext("2d");
var detect          = $('input[name="state"]');

$(document).ready(()=>{
   init();
})

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
      requestUSer(code.data);
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
        console.log('Reset Cam')
        setBorderError();
        $('.js-scan').hide();
        startWebcam();
    },3000)
}

async function requestUSer(qr){
    $('.js-profile').css('border','none');
    $('.js-qr').css('border','none');
    $('.js-spinner').show();
    $('.js-grade').hide();
    $('.js-name-id').hide();

    qr = encodeURIComponent(qr);
    const data = await lib.fetch(`scan/${qr}`);
    console.log(data)
    if(data.status == false){
      $('.js-profile').css('border','1px solid red')
      $('.js-qr').css('border','1px solid red')
      return;
    }

    // SHOW DATA / REMOVE SPINNER
    $('.js-spinner').hide();
    $('.js-grade').show();
    $('.js-name-id').show();

    $('.js-name-id').html(data.data.name);
    $('.js-grade').html(data.data.level);
    $('.js-profile').attr('src',`${lib.protocol}//${lib.backend_host}/${data.data.image}`);
    saveToRealTimeDatabase(data);
}    


async function init(){
  const data = await lib.fetch('firebase');
  console.log(data.data);
  firebase.initializeApp(data.data);
}

function saveToRealTimeDatabase(data) {
     const db = firebase.database();
     db.ref(`/students/${lib.currentDate()}`).update(data.data);
}