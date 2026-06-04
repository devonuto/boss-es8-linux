//
//	knob_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	var LIMIT = 165; /* -165 ~ 165 degree */
	var COEF  = 8;

	$(document).on('elf-update', '.elf-knob-control', function(e, v) {

		var _$ = $(this);
		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		min *= 1; max *= 1; v *= 1;
		if (min >= max) return false;

		var step = (LIMIT * 2) / (max - min);
		if (v < min) v = min;
		if (v > max) v = max;
		var deg = -LIMIT + (step * (v - min));
		_$.children('div').css('transform', 'rotate(' + deg + 'deg)');
		_$.prop('value', v);

		return false;
	});

	var binding = false;

	$(document).on(pointer.down, '.elf-knob-control', function(e) {

		e.stopPropagation();

		if (e.which > 1) return;
		var touch = (e.which == 0);

		var _$ = $(this);

		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		min *= 1; max *= 1;
		if (min >= max) return;

		if (touch) { e.pageY = e.originalEvent.touches[0].pageY }
		var lastY = e.pageY;
		var v0 = (_$.val() * 1);
		var step = (LIMIT * 2) / (max - min);

		binding = true;
		$(document).bind(pointer.move, function(e) {
			if (touch) { e.pageY = e.originalEvent.touches[0].pageY }
			var dy = Math.floor((e.pageY - lastY) * COEF / step);
			var v = v0 - dy;
			if (v < min) v = min;
			if (v > max) v = max;
			if (v == _$.val()) return false;

			var deg = -LIMIT + (step * (v - min));
			_$.children('div').css('transform', 'rotate(' + deg + 'deg)');
			_$.prop('value', v);
			_$.trigger('elf-change', v);
			return false;
		});

	});

	$(document).on(pointer.up, function(e) {
		if (binding) {
			$(document).unbind(pointer.move);
			binding = false;
		}
	});

});
