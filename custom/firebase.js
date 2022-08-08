$ = jQuery;

import list from "./list.js?v=1.1";
const lib       = list.lib;
const templates = list.templates; 

$(document).ready(()=>{
	init();
});

async function init(){
	const data = await lib.fetch('firebase');
	console.log(data)
	firebase.initializeApp(data.data);
	const firestore = firebase.firestore();
  const db         = firebase.database();

  db.ref(`/students/${lib.currentDate()}`).on('value', (snapshot) => {
  		var data = {}
  		snapshot.forEach((childSnapshot) => {
		    var key =  childSnapshot.key;
		    var val = childSnapshot.val();
		    data[key] = val;
		  });

			if(data.uid == undefined){
				return;
			}

			setFlag(data)
			if(!isExists(data)){
				renderRecent(data);
			}
			// db.ref(`/students/${lib.currentDate()}`).remove()
  });
}

// REALTIME RENDER
function renderRecent(dat){
	const template = templates.render_recent(list.lib,dat,'active')
  $('.js-list-item').removeClass('active');
  $('.js-list-wrapper').prepend(template);
  $('.js-list-item').first().slideDown(500);

  if($('.js-list-item').length > 8){
     $('.js-list-item').last().fadeOut(500).remove();
  }     
}

function isExists(data){
	const uid = data.uid;
	return $('.js-list-wrapper').children().find(`[uid=${uid}]`).length > 0 ? true : false
}

function setFlag(data){
	const uid     = data.uid;
	const element = $('.js-list-all-wrapper').children().find(`input[value=${uid}]`);
	if(element.length == 0){
		return;
	}
	element.parent().css('border','1px solid green');
	element.parent().find('.card-text').prepend('<i class="fa-solid fa-check"></i>');
}

function resetFirebaseDB(){

}