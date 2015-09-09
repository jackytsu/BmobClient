$(function() {
	var $btnRefreshTables = $('#btn-refresh-tables'),
		$navTables = $('#nav-tables'),
		$tableStructureFields = $('#table-structure-fields'),
		$tableFields = $tableStructureFields.children('table'),
		$templateSelectType = $('#template-select-type'),
		$templateSelectTargetClass = $('#template-select-target-class');

	$btnRefreshTables.click(function() {
		$btnRefreshTables.attr('disabled', true).children('i').addClass('fa-spin');
		GET(API_URL.SCHEMAS, function(data) {
			$btnRefreshTables.attr('disabled', false).children('i').removeClass('fa-spin');
			if (!data) {
				error('Application ID设置错误！');
				return;
			}

			var $select = $templateSelectTargetClass.children('select');
			$select.empty();
			$navTables.empty();
			$.each(data.results, function() {
				var $link = $('<li><a href="javascript:void(0);">' + this.className + '</a></li>');
				$link.appendTo($navTables);
				$link.children('a').data('fields', this.fields);
				$select.append('<option value="' + this.className + '">' + this.className + '</option>')
			});
		});
	}).click();

	var generateRow = function(k, v) {
		if ($.inArray(k, CONSTANT.RESERVED_FIELD_NAMES) > -1) {
			return;
		}

		var str = ['<tr>'];
		var id = 'cb-' + k;
		str.push('<td align="center"><label class="control-label" for="', id, '"><input type="checkbox" id="', id, '" /></label></td>');
		str.push('<td><label class="control-label" for="', id, '">', k, '</label></td>');
		str.push('<td><label class="control-label" for="', id, '">', v['type'], '</label></td>');
		str.push('<td><label class="control-label" for="', id, '">', v['targetClass'], '</label></td>');
		str.push('</tr>');
		$tableFields.children('tbody').append(str.join(''));
	};

	var appendFieldTr = function() {
		var str = ['<tr class="field-editor">'];
		str.push('<td align="center" style="vertical-align: middle;"><button class="btn btn-danger btn-xs"><i class="fa fa-times"></i></button></td>')
		str.push('<td><input type="text" class="form-control" /></td>');
		str.push('<td>', $templateSelectType.html(), '</td>');
		str.push('<td>', $templateSelectTargetClass.html(), '</td>');
		str.push('</tr>');
		$tableFields.children('tbody').append(str.join(''));
		$tableFields.find('tbody tr:last select[name=targetClass]').hide();
	}

	$(document).on('click', '#nav-tables a', function() {
		var $t = $(this),
			fields = $t.data('fields');
		$t.parent('li').addClass('active').siblings('li').removeClass('active');

		$tableFields.children('tbody').empty();
		$.each(fields, generateRow);
		$tableStructureFields.show().prev('div').show();
		$('#cb-all').prop('checked', false);
	});

	$(document).on('change', '[name=type]', function() {
		var $t = $(this),
			$tr = $t.parents('tr'),
			$s = $tr.find('[name=targetClass]');
		$s.toggle($t.val() == 'Pointer' || $t.val() == 'Relation');
	});

	$(document).on('click', '#table-structure-fields thead :checkbox', function() {
		var $t = $(this);
		$tableFields.find('tbody input').prop('checked', $t.is(':checked'));
	});

	$(document).on('click', '.field-editor button', function() {
		$(this).parents('tr').remove();
		if ($tableFields.find('tr.field-editor').length == 0) {
			$tableFields.children('tfoot').hide();
		}
	});

	$('#btn-append-field').click(function() {
		appendFieldTr();
		$tableFields.children('tfoot').show();
	});

	$('#btn-field-cancel').click(function() {
		$tableFields.find('tr.field-editor').remove();
		$tableFields.children('tfoot').hide();
	})
});
