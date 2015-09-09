const CONSTANT = {
	APPLICATION_ID: 'applicationID',
	MASTER_KEY: 'masterKey',
	REST_API_KEY: 'restAPIKey',
	RESERVED_FIELD_NAMES: ['ACL', 'createdAt', 'updatedAt'],
	FIELD_TYPES: []
};

const API_URL_BASE = 'https://api.bmob.cn/1';

const API_URL = {
	SCHEMAS: API_URL_BASE + '/schemas'
}

const ICON_LOADING = '<i class="fa fa-refresh fa-spin"></i>'

var APPLICATION_ID, REST_API_KEY, MASTER_KEY;

function info(msg, callback) {
	$.notify({
		icon: 'fa fa-info-circle',
		message: msg
	}, {
		type: 'info',
		position: 'fixed',
		delay: 1500,
		placement: {
			from: "top",
			align: "center"
		},
		animate: {
			enter: 'animated fadeInDown',
			exit: 'animated fadeOutUp'
		},
		onClosed: callback
	});
}

function warn(msg, callback) {
	$.notify({
		icon: 'fa fa-question-circle',
		message: msg
	}, {
		type: 'warning',
		position: 'fixed',
		delay: 1500,
		placement: {
			from: "top",
			align: "center"
		},
		animate: {
			enter: 'animated fadeInDown',
			exit: 'animated fadeOutUp'
		},
		onClosed: callback
	});
}

function error(msg, callback) {
	$.notify({
		icon: 'fa fa-exclamation-circle',
		message: msg
	}, {
		type: 'danger',
		position: 'fixed',
		delay: 1500,
		placement: {
			from: "top",
			align: "center"
		},
		animate: {
			enter: 'animated fadeInDown',
			exit: 'animated fadeOutUp'
		},
		onClosed: callback
	});
}

var gui = require('nw.gui');
if (process.platform === "darwin") {
	var mb = new gui.Menu({
		type: 'menubar'
	});
	mb.createMacBuiltin('BmobClient', {
		hideEdit: false,
	});
	gui.Window.get().menu = mb;
}

function GET(url) {
	var data, callback;
	if ($.isFunction(arguments[1])) {
		callback = arguments[1];
	} else {
		data = arguments[1];
		callback = arguments[2];
	}

	$.ajax(url, {
		data: data || {},
		headers: {
			'X-Bmob-Application-Id': APPLICATION_ID,
			'X-Bmob-REST-API-Key': REST_API_KEY,
			'X-Bmob-Master-Key': MASTER_KEY
		},
		complete: function(xhr, ts) {
			if (ts != 'success') {
				switch (xhr.status) {
					case 401:
						error('REST API Key或者Master Key设置错误！');
						break;
					default:

				}
			}
			if (callback) {
				callback(xhr.responseJSON, xhr.status);
			}
			console.log(xhr.responseJSON);
		}
	});
}
