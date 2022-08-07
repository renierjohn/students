// const cloudflare_host =  'renify.local/rest';//'rest-api.renier.workers.dev';
// const backend_host  =   'renify.local'//'renifysite.com';
// const host          = document.location.hostname;
// const protocol 			= document.location.protocol;
// const port          = document.location.port ? document.location.port: '80';

const token         = localStorage.token;
const uid           = localStorage.uid;

const CONFIG = {
	prod:{
		headers :{
				  'token' : token ? token : ' ',
				  'uid'   : uid ? uid : ' ',
				  method  : 'GET'
				},
		cloudflare_host: 'rest-api.renier.workers.dev',
		backend_host   : 'renifysite.com',
		host           : 'student.renifysite.com',
		protocol       : 'https:',
		port           : 80
	},
	dev:{
		headers :{
				  'X-AUTH-TOKEN' : token ? token : '',
				  'REQUEST-ID'   : uid ? uid : 0,
				  method         : 'GET'
				},
		cloudflare_host: 'renify.local/rest',
		backend_host   : 'renify.local',
		host           : 'localhost:8080',
		protocol       : 'http:',
		port           :  8080
	}
}

const ENV = CONFIG.prod;

const lib = {
	fetch: async function(endpoint,hasHeader = true){
				
				if((token == undefined || token == false) && hasHeader  == true ){
					return {status:false};
				}

				var headers = ENV.headers

				if(hasHeader == false){
					headers = {};
				}

				const url  = `${ENV.protocol}//${ENV.cloudflare_host}/api/v1/student/${endpoint}`;

		    const data = await fetch(url, {headers})
        .then((response) => response.json())
        .then((result) => {
           return result
        }).catch(() => {
            return {status:false};
        });
        return data;
	},
	auth: async function(uname,pass){
				const url  = `${ENV.protocol}//${ENV.backend_host}/api/v1/auth/token`;
		    const data = await fetch(url, {
												 method : "POST",
											   body   : JSON.stringify({login:uname,password:pass})
									    })
							        .then((response) => response.json())
							        .then((result) => {
							           return result
							        }).catch(() => {
							            return false;
							        });
        return data;
	},
	query: async function(endpoint){
				const url  = `${ENV.protocol}//${ENV.backend_host}${endpoint}`;
		    const data = await fetch(url)
        .then((response) => response.json())
        .then((result) => {
           return result
        }).catch(() => {
            return {status:false};
        });
        return data;
	},
	store: function(s_token,s_uid){
		localStorage.setItem('token',s_token);
		localStorage.setItem('uid',s_uid);
	},
	countdown:async function(element,redirect_url){
		element.show();
    var i = 100;
    var counterBack = await setInterval(async function(){
      i --;
      if (i > 0)
      	{ element.css('width', i + '%'); }
      else {
        clearInterval(counterBack);
        document.location.href = redirect_url;
      }}, 50);
    
	},
	currentDate:function(){
		  const date = new Date();
		  const year = date.getFullYear();
		  var mo     = date.getMonth();
		  var day    = date.getDate();
		  if(mo < 10){
		  	mo = `0${String(mo + 1)}`;
		  }
		  if(day < 10){
		  	day = `0${String(day)}`;
		  }
		  return `${String(year)}_${mo}_${day}`;
	},
	calculateElapse:function(ts){
		var current_t =  String(Date.now()).substr(0,10);
	  var diff      = (parseFloat(current_t) - ts)/60;
	  return diff.toFixed(0);
	},
	host: ENV.host,
	port: ENV.port,
	protocol:ENV.protocol,
	backend_host:ENV.backend_host
}

export default lib;
