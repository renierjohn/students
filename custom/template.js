const templates = {
	render_default:function(){
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
	},
	render_detail:function(lib,dat){
		const style   = detectVisibleFromCache(dat.id) ? 'border:1px solid green;' : '';
    const checked = style.length > 0 ? `<i class="fa-solid fa-check"></i>` : '';
		return `
				<div class="col-md-4 js-list-detail" style="display:none">
          <div class="card mb-4 box-shadow" style="${style}">
            <input type="hidden" class="js-uid" value="${dat.id}" >
            <input type="hidden" class="js-qr-detail" value="${dat.hash}" >
            <img class="card-img-top" src="${lib.protocol}//${lib.backend_host}/${dat.image}" data-src="" alt="Student Image">
            <div class="card-body">
              <p class="card-text">${checked} ${dat.name}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">

                </div>
                <small class="text-muted">Grade ${dat.level}</small>
              </div>
            </div>
          </div>
        </div>
		`;
	},
	render_recent:function(lib,dat,active){
		const elapse = lib.calculateElapse(dat.ts);
		return `
      <a href="#" class="js-list-item list-group-item list-group-item-action ${active}" aria-current="true" style="display:none">
	      <input type="hidden" class="js-img" value="${lib.protocol}//${lib.backend_host}/${dat.image}" >
	      <input type="hidden" class="js-qr-input" value="${dat.hash}" >
	      <input type="hidden" class="js-uid-input" uid="${dat.uid}" value="${dat.uid}" >
	      <div class="d-flex w-100 justify-content-between">
	        <h5 class="mb-1 js-name">${dat.name}</h5>
	        <small>${elapse} min ago</small>
	      </div>
	      <small>GRADE <span class="js-grade">${dat.level}</span></small>
	    </a>
		`;
	}

}

function detectVisibleFromCache(uid){
  const cache      = $('.js-cache').val();
  if(cache.length == 0){
    return false;
  }
  const cache_json = JSON.parse(cache);
  var flag = false;
  
  if(cache_json.length == 0){
    return flag;
  }

  cache_json.forEach((json) => {
   if(json.uid == uid){
     flag = true;
   } 
  });
  return flag;
}

export default templates;