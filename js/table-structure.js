$(function() {
	var $navTables = $('#nav-tables'),
		$tableStructureFields = $('#table-structure-fields'),
		$form = $tableStructureFields.find('form'),
		$tableFields = $tableStructureFields.find('table'),
		$templateSelectType = $('#template-select-type'),
		$templateSelectTargetClass = $('#template-select-target-class'),
		$tableName = $('#table-name');
	var selectedTable;

	$('#btn-refresh-tables').click(function() {
		var $loading = $navTables.siblings('.loading-icon').show();
		AJAX(GET, API_URL.SCHEMAS, function(data) {
			$loading.hide();
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

			if (selectedTable) {
				$navTables.find('a:contains(' + selectedTable + ')').click();
				selectedTable = undefined;
			}
		});
	}).click();

	$('#btn-create-table').click(function() {
		$tableFields.children('tbody').empty();
		$tableStructureFields.show().prev('div').show();
		$('#cb-all').prop('checked', false);
		$tableName.val('').parent().show();
		$navTables.find('li.active').removeClass('active');
		appendFieldTr();
		$('#btn-delete-table').attr('disabled', true);
	});

	var generateRow = function(k, v) {
		if ($.inArray(k, CONSTANT.RESERVED_FIELD_NAMES) > -1) {
			return;
		}

		var str = ['<tr data-field-name="', k, '">'];
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
		str.push('<td><div class="form-group has-feedback"><input type="text" class="form-control" required /><span class="glyphicon form-control-feedback" aria-hidden="true"></span><div class="help-block with-errors"></div></div></td>');
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
		$tableName.val($t.text()).parent().hide();
		$('#btn-delete-table').attr('disabled', false);
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
	});

	$('#btn-append-field').click(function() {
		appendFieldTr();
	});

	$('#table-structure-fields form').validator({
		nativeEx: VALIDATOR_NATIVE_EXTEND
	});

	$form.on('submit', function(e) {
		if (e.isDefaultPrevented()) {
			return false;
		}

		var $loading = $('#loading-icon-table-structure').show();
		var postData = {
			className: $tableName.val(),
			fields: {}
		};

		$tableFields.find('tbody tr.field-editor').each(function() {
			var $t = $(this),
				$sel1 = $t.find('select:first'),
				$sel2 = $t.find('select:last');
			postData.fields[$t.find('input:text').val()] = {
				type: $sel1.val(),
				targetClass: $sel2.is(':visible') ? $sel2.val() : undefined
			};
		});

		$tableFields.find('tbody tr:has(:checkbox:checked)').each(function() {
			var $t = $(this),
				type = $t.find('td:eq(2)').text(),
				target = $t.find('td:eq(3)').text();
			postData.fields[$t.data('field-name')] = {
				"__op": 'Delete',
				type: type,
				targetClass: target || undefined
			};
		});

		if ($.isEmptyObject(postData.fields)) {
			$loading.hide();
			return false;
		}

		AJAX($tableName.is(':visible') ? POST : PUT, API_URL.SCHEMAS + '/' + $tableName.val(), JSON.stringify(postData), function(data) {
			$loading.hide();
			selectedTable = $tableName.val();
			$('#btn-refresh-tables').click();
		});
		return false;
	});

	$('#btn-delete-table').click(function() {
		if ($(this).is('[disabled]')) {
			return;
		}

		var str = ['是否删除表 ', $tableName.val(), ' ？'];
		bootbox.confirm(str.join(''), function(ans) {
			if (ans) {
				var $loading = $('#loading-icon-table-structure').show();
				AJAX(DELETE, API_URL.SCHEMAS + '/' + $tableName.val(), function() {
					$loading.hide();
					$('#btn-refresh-tables').click();
					$tableStructureFields.hide().prev('div').hide();
				});
			}
		});
	});
});
