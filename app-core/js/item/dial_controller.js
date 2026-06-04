//
//	dial_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	var LIMIT = 150; /* -150 ~ 150 degree */
	var COEF  = 8;

	function draw_arc(_$canvas, degree) {

		var thickness = _$canvas.prev().css('font-size').replace('px', '');
		var fgcolor   = _$canvas.prev().css('color');
		var bgcolor   = _$canvas.prev().css('background-color');

		var canvas = _$canvas[0];
		var x = Math.floor(canvas.width  / 2);
		var y = Math.floor(canvas.height / 2);
		var r = Math.min(x, y) - thickness;

		var deg0 = (-LIMIT - 90) * Math.PI / 180;
		var deg1 = (degree - 90) * Math.PI / 180;
		var deg2 = ( LIMIT - 90) * Math.PI / 180;

		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (fgcolor) {
			ctx.beginPath();
			ctx.lineWidth = thickness;
			ctx.strokeStyle = fgcolor;
			ctx.arc(x, y, r, deg0, deg1, false);
			ctx.stroke();
			ctx.closePath();
		}
		if (bgcolor) {
			ctx.beginPath();
			ctx.lineWidth = thickness;
			ctx.strokeStyle = bgcolor;
			ctx.arc(x, y, r, deg1, deg2, false);
			ctx.stroke();
			ctx.closePath();
		}

	}

	$(document).on('elf-update', '.elf-dial-control', function(e, v) {

		var _$ = $(this);
		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		min *= 1; max *= 1; v *= 1;
		if (min >= max) return false;

		var step = (LIMIT * 2) / (max - min);
		if (v < min) v = min;
		if (v > max) v = max;
		var deg = -LIMIT + (step * (v - min));
		draw_arc(_$.children('canvas'), deg);
		_$.children('p').text(v);
		_$.prop('value', v);

		return false;
	});

	var binding = false;
	var v_tap = null;

	$(document).on(pointer.down, '.elf-dial-control', function(e) {

		e.stopPropagation();

		if (e.which > 1) return;
		var touch = (e.which == 0);

		var _$ = $(this);

		if (touch) {
			var handler = _$.attr('handler');
			if (window[handler]) { window[handler](e, _$); return; }
		}

		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		min *= 1; max *= 1;
		if (min >= max) return;

		if (touch) { e.pageY = e.originalEvent.touches[0].pageY }
		var lastY = e.pageY;
		var v0 = (_$.val() * 1);
		var step = (LIMIT * 2) / (max - min);

		if (touch) { e.pageX = e.originalEvent.touches[0].pageX }
		var rc = _$[0].getBoundingClientRect();
		var tap = e.pageX - (rc.left + window.pageXOffset);
		if (tap < _$.width() / 2) { v_tap = (v0 - 1); } else { v_tap = (v0 + 1); }

		binding = true;
		$(document).bind(pointer.move, function(e) {
			v_tap = null;

			if (touch) { e.pageY = e.originalEvent.touches[0].pageY }
			var dy = Math.floor((e.pageY - lastY) * COEF / step);
			var v = v0 - dy;
			if (v < min) v = min;
			if (v > max) v = max;
			if (v == _$.val()) return false;

			var deg = -LIMIT + (step * (v - min));
			draw_arc(_$.children('canvas'), deg);
			_$.children('p').text(v);
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

	$(document).on('click', '.elf-dial-control', function(e) {
		e.stopPropagation();
		if (v_tap !== null) {
			var _$ = $(this);
			_$.trigger('elf-update', v_tap);
			if (v_tap == _$.val()) {
				_$.trigger('elf-change', v_tap);
			}
			v_tap = null;
		}
	});

});
