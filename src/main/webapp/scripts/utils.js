//show button
function hideElement(element) {
	element.style.display = 'none';
}
//hide button
function showElement(element, style) {
	var displayStyle = style ? style : 'block';
	element.style.display = displayStyle;
}

function showLoadingMessage(msg) {
	var itemList = document.querySelector('#item-list');
	itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i> ' +
		msg + '</p>';
}

function showWarningMessage(msg) {
	var itemList = document.querySelector('#item-list');
	itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-triangle"></i> ' + msg + '</p>';
}

function showErrorMessage(msg) {
	var itemList = document.querySelector('#item-list');
	itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i> ' + msg + '</p>';
}

function showRegisterResult(registerMessage) {
    document.querySelector('#register-result').innerHTML = registerMessage;
}

function clearRegisterResult() {
    document.querySelector('#register-result').innerHTML = '';
}

function showModal() {
	var modal = document.getElementById("myModal");
	showElement(modal);
	$(".filterToggle").click(function(){
		$(".collapse").collapse('toggle');
	});
}

/**
 * List nearby items based on the data received
 * @params items - An array of item JSON objects
 */
function listItems(items) {
	var itemList = document.querySelector('#item-list');
	itemList.innerHTML = ''; //clear current results;

	for (var i = 0; i < items.length; i++) {
		addItem(itemList, items[i]);
	}
}

/**
 * List trial detail information based on the data received
 * @params detail - An array of detail JSON objects
 */
function listDetails(trail){
    var itemList = document.querySelector('#item-list');
    itemList.innerHTML = ''; // clear current results
    addDetails(itemList, trail);
}

//PLEASE CHANGE HERE!!!!
function addDetails(itemList, trail){
	//create the <li> tag and specify the id and class attributes
	var li = $create('li', {
		id: trail.id,
		className: 'trailDetail'
	});
	//set the data attributes <li data-item_id="xxxxx">
	li.dataset.trail_id = trail.id;

	//trail image
	if(trail.imgSmallMed){
		li.appendChild($create('img', {
			src : trail.imgSmallMed
		}));
	} else{
		li.appendChild($create('img', {
			src : 'https://via.placeholder.com/100'
		}));
	}

	//trail name
	var trailName = $create('a', {
		className: 'trail-name',
	});
	trailName.innerHTML = trail.name;
	li.appendChild(trailName);

	//section
	var section = $create('div');
	//trail length
	var trailLength = $create('a', {
		className: 'trail-length',
	});
	trailLength.innerHTML = trail.length;
	li.appendChild(trailLength);

	//section
	var section = $create('div');

	// address
	var address = $create('p', {
		className : 'trail-address'
	});
	address.innerHTML = trail.location;
	li.appendChild(address);

	itemList.appendChild(li);
}

/**
 * Add a single item to the list
 * @params itemList - The <id="item-list"> tag (DOM container)
 * @params item - The item data (JSON object)
 * <li class="item"> <image alt="item image"
 * src="https://cdn2.apstatic.com/photos/hike/7039883_smallMed_1555092747.jpg" />
 * <div> <a class="item-name" href="#" target="_blank">Trail</a>
 * <p class="item-category">black</p>
 * </div>
 * <p class="item-address">Superior, Colorado</p>
 */
function addItem(itemList, item){
	setNearbys(user_Id, item.id); //add row to nearbys db
	var item_id = 'item-' + item.id;

	//create the <li> tag and specify the id and class attributes
	var li = $create('li', {
		id: item_id,
		className: 'item',
		value: item.id
	});

	//set the data attributes <li data-item_id="xxxxx">
	li.dataset.item_id = item.id;
	//item image
	if (item.imgSmallMed) {
		li.appendChild($create('img', {
			src: item.imgSmallMed
		}));
	} else {
		li.appendChild($create('img', {
			src: 'https://via.placeholder.com/100'
		}));
	}

	//section
	var section = $create('div');

	//title
	var title = $create('a', {
		className: 'item-link',
		href : '#',
	});
	title.innerHTML = item.name;
	title.onclick = function(){
		loadTrailInfo(item);
	}
	section.appendChild(title)

	li.appendChild(section);

	// address
	var address = $create('p', {
		className: 'item-address'
	});
	address.innerHTML = item.location;
	li.appendChild(address);

	itemList.appendChild(li);
}

/**
 * A helper function that creates a DOM element
 * @param tag
 * @param options
 * @returns {element}
 */
function $create(tag, options) {
	var element = document.createElement(tag);
	for (var key in options) {
		if (options.hasOwnProperty(key)) {
			element[key] = options[key];
		}
	}
	return element;
}

/**
 * A helper function that makes a navigation button active
 * @param btnId - The id of navigation button
 */
function activeBtn(btnId) {
	var btns = document.querySelectorAll('.main-nav-btn');

	//de-active all navigation buttons
	for (var i = 0; i < btns.length; i++) {
		btns[i].className = btns[i].className.replace(/\bactive\b/, '');
	}
	//active the one that has id = btnId
	var btn = document.querySelector('#' + btnId);
	btn.className += ' active';
}

/**
 * AJAX helper
 *@param method - GET|POST|PUT|DELETE
 *@param url - API end point
 *@param data - Request payload data
 *@param successCallback - Successful callback function
 *@param errorCallback - Error callback function
 */
function ajax(method, url, data, successCallback, errorCallback) {
	//step1: create an XMLHttpRequest object
	var xhr = new XMLHttpRequest();

	//step2: send the request to the server
	xhr.open(method, url, true);
	console.log(method);
	xhr.onload = function () {
		if (xhr.status === 200) {
			successCallback(xhr.responseText);
		} else {
			errorCallback();
		}
	};

	xhr.onerror = function () {
		console.log("The requext couldn't be completed.");
		errorCallback();
	};

	if (data === null) {
		xhr.send();
	} else {
		xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
		xhr.send(data);
	}
}