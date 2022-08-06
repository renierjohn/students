$ = jQuery;
import lib from "./lib.js";

renderRecent();
renderLists();

$('.js-more').click(async (e)=>{
  $('.js-spinner').show();
  e.preventDefault()
    const limit = $('.js-more').attr('limit');
    const start = $('.js-more').attr('start');
    console.log(limit,start)
    var s       = parseInt(start) + parseInt(limit); 
    $(this).attr('start',s);
    const data  = await lib.query(`/api/student/list?l=${limit}&s=${s}`);

    if(data.more_flag == false){
        $('.js-more').hide();
    }

    const template = render(data);
    $('.js-list-all-wrapper').append(template);
    $('.js-spinner').hide();
});

function init(){
  $('.js-list-item').click(function(e){
    e.preventDefault()
    if($(this).hasClass('active')){
      return;
    }
    $('.js-qr').fadeOut('fast');
    $('.js-qr').children().remove();
    $('.js-list-item').removeClass('active');
    $(this).addClass('active');

    var name  = $(this).children().find('.js-name').html();
    var grade = $(this).find('.js-grade').html();
    var img   = $(this).find('.js-img').val();
    var hash  = $(this).find('.js-qr-input').val();
    $('.js-name-id').html(name);
    $('.js-grade-id').html(grade);
    $('.js-profile').attr('src',img);
    new QRCode(document.getElementById('js-qr'),hash);
    $('.js-qr').children().first().hide();
    $('.js-qr').fadeIn('fast');
    
  });
  $('.js-spinner').hide();
}

async function renderRecent(){
  const data = await lib.fetch('recent',false);
  if(data.status == false){
    return;
  }
  var template = '';
  data.data.forEach((dat,idx) => {
    var elapse = calculateElapse(dat.ts);
    var active = idx == 0 ? 'active' : '';

    if(idx == 0){
        $('.js-qr').html(' ');
        $('.js-name-id').html(dat.name);
        $('.js-grade-id').html(dat.level);
        $('.js-profile').attr('src',`${lib.protocol}//${lib.backend_host}/${dat.image}`);
        new QRCode(document.getElementById('js-qr'),dat.hash)
    }

    template += `
        <a href="#" class="js-list-item list-group-item list-group-item-action ${active}" aria-current="true">
          <input type="hidden" class="js-img" value="${lib.protocol}//${lib.backend_host}/${dat.image}" >
          <input type="hidden" class="js-qr-input" value="${dat.hash}" >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1 js-name">${dat.name}</h5>
            <small>${elapse} min ago</small>
          </div>
          <small>GRADE <span class="js-grade">${dat.level}</span></small>
        </a>
    `;
  });
  $('.js-list-wrapper').html(' ');
  $('.js-list-wrapper').html(template);
  init();
}

async function renderLists(){
  const json = await lib.query(`/sites/default/files/public/students_flag/${lib.currentDate()}.json`);
  const data = await lib.query('/api/student/list');
 
  $('.js-more').attr('limit',data.limit);
  $('.js-list-all-wrapper').html('');
  const template = render(data);
  $('.js-list-all-wrapper').html(template);
  console.log(data,json);
}

function render(data){
   var template = '';
   data.students.forEach((dat,idx) => {
    template += `
        <div class="col-md-4 js-list-detail">
          <div class="card mb-4 box-shadow">
            <input type="hidden" class="js-uid" value="${dat.id}" >
            <input type="hidden" class="js-qr-detail" value="${dat.hash}" >
            <img class="card-img-top" src="${lib.protocol}//${lib.backend_host}/${dat.image}" data-src="" alt="Student Image">
            <div class="card-body">
              <p class="card-text">${dat.name}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">

                </div>
                <small class="text-muted">Grade ${dat.level}</small>
              </div>
            </div>
          </div>
        </div>
    `;
  });
  return template
}

function calculateElapse(ts){
  var current_t =  String(Date.now()).substr(0,10);
  var diff      = (parseFloat(current_t) - ts)/60;
  return diff.toFixed(0);
}

// FOR REALTIME Render
function append(){
  $('.js-list-item').removeClass('active');
  template = `<a href="#" class="js-list-item list-group-item list-group-item-action active" aria-current="true" style="display:none">
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1 js-name">N/A</h5>
                      <small>0 min ago</small>
                    </div>
                    <small>GRADE <span class="js-grade">N/A</span></small>
                  </a>`
  $('.js-list-wrapper').prepend(template);
  $('.js-list-item').first().slideDown(500);

  if($('.js-list-item').length > 8){
     $('.js-list-item').last().fadeOut(500).remove();
  }                  
}