//
//	stringer_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	$(document).on('elf-update', '.elf-stringer-control', function(e, v) {
		var format = $(this).attr('format');
		if (format) {
			var value = (v * 1);
			var str = eval(format);
			$(this).children('p').text(str);
		} else {
			$(this).children('p').hide();
			$(this).children('p').eq(v).show();
		}
		return false;
	});

});
