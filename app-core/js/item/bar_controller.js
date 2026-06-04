//
//	bar_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	$(document).on('elf-update', '.elf-bar-control', function(e, v) {

		var _$ = $(this);

		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		min *= 1; max *= 1; v *= 1;
		if (min >= max) return false;

		if (v < min) v = min;
		if (v > max) v = max;
		_$.children('p').text(v);
		_$.prop('value', v);
		draw_bar(_$);

		return false;
	});

	var binding = false;
	var v_tap = null;

	$(document).on(pointer.down, '.elf-bar-control', function(e) {

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

		var pair = _$.attr('lower-than') || _$.attr('upper-than');
		if (pair && !_$.attr('linking')) { pair = null; }

		var v0 = (_$.val() * 1);
		var offset = 0;
		var bar_move;

		if (_$.width() > _$.height()) {
			if (touch) { e.pageX = e.originalEvent.touches[0].pageX }
			var lastX = e.pageX;
			var width = _$.width();
			if (pair) {
				if (_$.attr('upper-than')) offset = width;
				width += $('#' + pair).width();
			}
			var step = width / (max - min);
			var rc = _$[0].getBoundingClientRect();
			var tap = e.pageX - (rc.left + window.pageXOffset) + offset;
			if (tap < width / 2) {
				if (v0 > min) v_tap = (v0 - 1);
			} else {
				if (v0 < max) v_tap = (v0 + 1);
			}
			bar_move = function(e) {
				if (touch) { e.pageX = e.originalEvent.touches[0].pageX }
				var dx = Math.floor((e.pageX - lastX) / step);
				var v = v0 + dx;
				if (v < min) v = min;
				if (v > max) v = max;
				return v;
			};
		} else {
			if (touch) { e.pageY = e.originalEvent.touches[0].pageY }
			var lastY = e.pageY;
			var height = _$.height();
			if (pair) {
				if (_$.attr('lower-than')) offset = height;
				height += $('#' + pair).height();
			}
			var step = height / (max - min);
			var rc = _$[0].getBoundingClientRect();
			var tap = e.pageY - (rc.top + window.pageYOffset) + offset;
			if (tap > height / 2) {
				if (v0 > min) v_tap = (v0 - 1);
			} else {
				if (v0 < max) v_tap = (v0 + 1);
			}
			bar_move = function(e) {
				if (touch) { e.pageY = e.originalEvent.touches[0].pageY }
				var dy = Math.floor((e.pageY - lastY) / step);
				var v = v0 - dy;
				if (v < min) v = min;
				if (v > max) v = max;
				return v;
			};
		}

		binding = true;
		$(document).bind(pointer.move, function(e) {
			v_tap = null;
			var v = bar_move(e);
			if (v != _$.val()) {
				_$.children('p').text(v);
				_$.prop('value', v);
				_$.trigger('elf-change', v);
				draw_bar(_$);
			}
			return false;
		});

	});

	$(document).on(pointer.up, function(e) {
		if (binding) {
			$(document).unbind(pointer.move);
			binding = false;
		}
	});

	$(document).on('click', '.elf-bar-control', function(e) {
		e.stopPropagation();
		if (v_tap !== null) {
			var _$ = $(this);
			_$.children('p').text(v_tap);
			_$.prop('value', v_tap);
			_$.trigger('elf-change', v_tap);
			draw_bar(_$);
			v_tap = null;
		}
	});

	function draw_bar(_$, reent) {

		var _$bar = _$.children('div');

		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		var v = _$.val();
		min *= 1; max *= 1; v *= 1;

		var pair = _$.attr('lower-than') || _$.attr('upper-than');
		if (pair && !_$.attr('linking')) { pair = null; }

		var offset = 0;

		if (_$.width() > _$.height()) {
			var width = _$.width();
			if (pair) { 
				if (_$.attr('upper-than')) offset = width;
				width += $('#' + pair).width();
			}
			var step = width / (max - min);
			var x0 = step * (v - min);
			var x1 = (min < 0 && 0 < max) ? step * (0 - min) : 0;
			if (pair) { x1 = step * ($('#' + pair).val() - min); }
			x0 = Math.floor(x0 - offset);
			x1 = Math.floor(x1 - offset);
			_$bar.css('left',  Math.min(x0,  x1) + 'px');
			_$bar.css('width', Math.abs(x0 - x1) + 'px');
		} else {
			var height = _$.height();
			if (pair) {
				if (_$.attr('lower-than')) offset = height;
				height += $('#' + pair).height();
			}
			var step = height / (max - min);
			var y0 = height - (step * (v - min));
			var y1 = (min < 0 && 0 < max) ? height - (step * (0 - min)) : height;
			if (pair) { y1 = height - (step * ($('#' + pair).val() - min)) }
			y0 = Math.floor(y0 - offset);
			y1 = Math.floor(y1 - offset);
			_$bar.css('top',    Math.min(y0,  y1) + 'px');
			_$bar.css('height', Math.abs(y0 - y1) + 'px');
		}

		if (pair && !reent) { draw_bar($('#' + pair), true); }
	}

});
