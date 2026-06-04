//
//	check_box_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	$(document).on('elf-update', '.elf-check-box-control', function(e, v) {
		$(this).children('input').prop('checked', (v == '1') ? true : false);
		return false;
	});

	$(document).on('change', '.elf-check-box-control', function(e) {
		e.stopPropagation();
		var v = ($(this).children('input').prop('checked')) ? '1' : '0';
		$(this).trigger('elf-change', v);
	});

});
