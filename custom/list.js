$ = jQuery;
import library   from "./common.js?v=1.1";
import templates from "./template.js?v=1.1" 
const  lib = library.lib;

$(document).ready(()=>{
  renderRecent();
})

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
   renderFilteredLists();
    // $.debounce(1000,renderFilteredLists());
     // var typingTimer = setTimeout(renderFilteredLists(),5000);
     // clearTimeout(typingTimer);
});

function initrecent(){
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

// RENDER LISTS DETAIL
function render(data){
   var template = '';
   if(data.students.length == 0){
      return templates.render_default();
   };

    data.students.forEach((dat,idx) => {
    template += templates.render_detail(lib,dat);
  });
  return template
}

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

async function renderRecent(){
  const data = await lib.query('/api/student/recents');
  if(data.status == false){ // cant access when logoff
    renderLists();
    return;
  }

  if(data.data_flag != null){
    $('.js-cache').val(JSON.stringify(data.data_flag));
  }

  var template = '';
  data.data.forEach((dat,idx) => {
    var active = idx == 0 ? 'active' : '';

    if(idx == 0){
        $('.js-qr').html(' ');
        $('.js-name-id').html(dat.name);
        $('.js-grade-id').html(dat.level);
        $('.js-profile').attr('src',`${lib.protocol}//${lib.backend_host}/${dat.image}`);
        new QRCode(document.getElementById('js-qr'),dat.hash)
    }

    template += templates.render_recent(lib,dat,active);
 
  });
  $('.js-list-wrapper').html(' ');
  $('.js-list-wrapper').html(template);
  $('.js-list-item').show();
  initrecent();
  renderLists(); //render list details
}

async function renderLists(){
  const data = await lib.query('/api/student/list');
 
  $('.js-more').attr('limit',data.limit);
  $('.js-list-all-wrapper').html('');
  const template = render(data);
  $('.js-list-all-wrapper').html(template);
  $('.js-list-detail').fadeIn('fast');
  $('.js-spinner').hide();
}

export default {
  lib,templates
};