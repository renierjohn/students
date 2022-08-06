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
    $('.js-list-detail').fadeIn('fast');
    $('.js-spinner').hide();
});

$('.js-select-grade').change(function(e){
   const val = $(this).val();
   renderFilteredLists();
});

$('.js-select-gender').change(function(e){
   const val = $(this).val();
   renderFilteredLists();
});

$('.js-select-visible').change(function(e){
   const val = $(this).val();
   // renderFilteredLists();
});

$('.js-search-student').on('input',function(e){
   const val = $(this).val();
   console.log(val);
   renderFilteredLists();
});

async function renderFilteredLists(){
  $('.js-more').attr('start',0);
  const limit   = $('.js-more').attr('limit');
  const grade   = $('.js-select-grade').val();
  const gender  = $('.js-select-gender').val();
  const visible = $('.js-select-visible').val();
  const search  = $('.js-search-student').val();
  var query = `?l=${limit}`;
 
  if(gender != 0){
    query = `${query}&g=${gender}`;
  }
  
  if(grade != 0){
    query = `${query}&lvl=${grade}`; 
  }

  if(search.trim().length != 0){
    query = `${query}&n=${search}`; 
  }

console.log(query)

  const data = await lib.query(`/api/student/list?${query}`);
  $('.js-more').show();
  $('.js-list-all-wrapper').html('');
  const template = render(data);
  $('.js-list-all-wrapper').html(template);
  $('.js-list-detail').fadeIn('fast');

  if(data.more_flag == false){
    $('.js-more').hide();
  }
}

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
}

async function renderRecent(){
  const data = await lib.query('/api/student/list');
  if(data.status == false){ // cant access when logoff
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
  $('.js-list-detail').fadeIn('fast');
  $('.js-spinner').hide();
}

function render(data){
   var template = '';
   if(data.students.length == 0){
      return `
       <div class="col-md-4 js-list-detail">
                <div class="card mb-4 box-shadow">
                  <img class="card-img-top" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22208%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20208%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18263c30fa1%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A11pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18263c30fa1%22%3E%3Crect%20width%3D%22208%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2266.9453125%22%20y%3D%22117.3%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" data-src="holder.js/100px225?theme=thumb&bg=55595c&fg=eceeef&text=Thumbnail" alt="Card image cap">
                  <div class="card-body">
                    <p class="card-text">NO DATA</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted">N/A</small>
                    </div>
                  </div>
                </div>
              </div>
              `;
   };

   data.students.forEach((dat,idx) => {
    template += `
        <div class="col-md-4 js-list-detail" style="display:none">
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