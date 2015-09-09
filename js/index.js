$(function() {
	var $divContent = $('#divContent'),
		$navTop = $('#nav-main-top');

	var refreshNav = function() {
		APPLICATION_ID = localStorage.getItem(CONSTANT.APPLICATION_ID);

		MASTER_KEY = localStorage.getItem(CONSTANT.MASTER_KEY);
		if (APPLICATION_ID && MASTER_KEY) {
			$navTop.find('li:eq(0)').removeClass('disabled');
		} else {
			$navTop.find('li:eq(0)').addClass('disabled');
		}

		REST_API_KEY = localStorage.getItem(CONSTANT.REST_API_KEY);
		if (APPLICATION_ID && REST_API_KEY) {
			$navTop.find('li:eq(1)').removeClass('disabled');
		} else {
			$navTop.find('li:eq(1)').addClass('disabled');
		}
	};

	$(document).on('click', '#nav-main-top li:not(.disabled) a', function() {
		var $t = $(this),
			$p = $t.parents('li'),
			index = $p.index(),
			$c = $divContent.children('div:eq(' + index + ')');
		if ($p.hasClass('active')) {
			return;
		}

		$p.addClass('active').siblings('li').removeClass('active');
		if ($c.is(':empty')) {
			$c.load($c.data('url')).show().siblings('div').hide();
		} else {
			$c.show().siblings('div').hide();
		}
	});

	$(document).on('change', '#applicationID', function() {
		localStorage.setItem(CONSTANT.APPLICATION_ID, $(this).val());
		refreshNav();
		info('application ID 保存成功！');
	});

	$(document).on('change', '#masterKey', function() {
		localStorage.setItem(CONSTANT.MASTER_KEY, $(this).val());
		refreshNav();
		info('Master Key 保存成功！');
	});

	$(document).on('change', '#restAPIKey', function() {
		localStorage.setItem(CONSTANT.REST_API_KEY, $(this).val());
		refreshNav();
		info('REST API Key 保存成功！');
	});

	$(document).on('click', '.btn-clear', function() {
		$(this).parent().prev('input').val('').change();
	});

	refreshNav();

	$navTop.find('li:not(disabled):first a').click();
});
