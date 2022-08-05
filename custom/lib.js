const backend_host  = 'renifysite.com';
const host          = document.location.hostname;
const protocol 			= document.location.protocol;
const port          = document.location.port ? document.location.port: '80';
const token         = localStorage.token;
const uid           = localStorage.uid;

const token_header  = 'X-AUTH-TOKEN'; // prod -> token | dev -> X-AUTH-TOKEN
const uid_header    = 'REQUEST-ID';   // prod -> uid   | dev -> REQUEST-ID

const lib = {
	fetch: async function(endpoint,hasHeader = true){
				
				if((token == undefined || token == false) && hasHeader  == true ){
					return {status:false};
				}

				var headers = {
				  'token' : token ? token : ' ',
				  'uid'   : uid ? uid : ' ',
				  method         : 'GET'
				}

				if(hasHeader == false){
					headers = {};
				}

				const url  = `${protocol}//${backend_host}/api/v1/student/${endpoint}`;

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
				const url  = `${protocol}//${backend_host}/api/v1/auth/token`;
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
				const url  = `${protocol}//${backend_host}${endpoint}`;
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
	host: host,
	port: port,
	protocol:protocol,
	backend_host:backend_host
}

export default lib;
