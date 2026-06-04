//
//	radio_button_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	$(document).on('elf-update', '.elf-radio-button-control', function(e, v) {
		$(this).children('input:eq(' + v + ')').prop('checked', true);
		return false;
	});

	$(document).on('change', '.elf-radio-button-control', function(e) {
		e.stopPropagation();
		var id = $(this).attr('id');
		var v = $(this).children('input[name=' + id + ']:checked').val();
		$(this).trigger('elf-change', v);
	});

});
