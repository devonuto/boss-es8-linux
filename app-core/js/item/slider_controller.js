//
//	slider_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	$(document).on('elf-update', '.elf-slider-control', function(e, v) {

		var _$ = $(this);

		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		min *= 1; max *= 1; v *= 1;
		if (min >= max) return false;

		if (v < min) v = min;
		if (v > max) v = max;
		_$.prop('value', v);
		draw_thumb(_$);

		return false;
	});

	var binding = false;

	$(document).on(pointer.down, '.elf-slider-control', function(e) {

		e.stopPropagation();

		if (e.which > 1) return;
		var touch = (e.which == 0);

		var _$ = $(this);
		var _$thumb = _$.children('div');

		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		min *= 1; max *= 1;
		if (min >= max) return;

		var slider_move;

		if (_$.width() > _$.height()) {
			var thumb = _$thumb.width();
			var width = _$.width() - thumb;
			var step = width / (max - min);
			slider_move = function(e) {
				if (touch) { e.pageX = e.originalEvent.touches[0].pageX }
				var rc = _$[0].getBoundingClientRect();
				rc.left += window.pageXOffset;
				var left = e.pageX - rc.left - (thumb / 2);
				if (left < 0) left = 0;
				if (left > width) left = width;
				return Math.floor((left / step) + min);
			};
		} else {
			var thumb = _$thumb.height();
			var height = _$.height() - thumb;
			var step = height / (max - min);
			slider_move = function(e) {
				if (touch) { e.pageY = e.originalEvent.touches[0].pageY }
				var rc = _$[0].getBoundingClientRect();
				rc.top += window.pageYOffset;
				var top = e.pageY - rc.top - (thumb / 2);
				if (top < 0) top = 0;
				if (top > height) top = height;
				return Math.floor(((height - top) / step) + min);
			};
		}

		var v = slider_move(e);
		if (v != _$.val()) {
			_$.prop('value', v);
			_$.trigger('elf-change', v);
			draw_thumb(_$);
		}

		binding = true;
		$(document).bind(pointer.move, function(e) {
			var v = slider_move(e);
			if (v != _$.val()) {
				_$.prop('value', v);
				_$.trigger('elf-change', v);
				draw_thumb(_$);
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

	function draw_thumb(_$) {

		var _$thumb = _$.children('div');

		var min = _$.attr('min'); if (!min) min = 0;
		var max = _$.attr('max'); if (!max) max = 0;
		var v = _$.val();
		min *= 1; max *= 1; v *= 1;

		var color = _$.css('color');
		var bkcolor = _$.css('background-color');

		var center = _$.attr('center');
		if ((center === undefined) && (min < 0 && 0 < max)) center = 0;

		if (_$.width() > _$.height()) {
			var thumb = _$thumb.width();
			var width = _$.width() - thumb;
			var step = width / (max - min);
			var left = step * (v - min);
			_$thumb.css('left', Math.floor(left) + 'px');

			x0 = Math.floor((left + (thumb / 2)) * 100 / _$.width());
			x1 = (center !== undefined) ? step * (center - min) + (thumb / 2) : 0;
			x1 = Math.floor(x1 * 100 / _$.width());
			bar = 'linear-gradient(to right,' +
				bkcolor + ' 0%,' +
				bkcolor + ' ' + Math.min(x0, x1) + '%,' +
				color   + ' ' + Math.min(x0, x1) + '%,' +
				color   + ' ' + Math.max(x0, x1) + '%,' +
				bkcolor + ' ' + Math.max(x0, x1) + '%,' +
				bkcolor + ' 100%)';
		} else {
			var thumb = _$thumb.height();
			var height = _$.height() - thumb;
			var step = height / (max - min);
			var top = height - (step * (v - min));
			_$thumb.css('top', Math.floor(top) + 'px');

			y0 = Math.floor((top + (thumb / 2)) * 100 / _$.height());
			y1 = (center !== undefined) ? height - (step * (center - min)) + (thumb / 2) : _$.height();
			y1 = Math.floor(y1 * 100 / _$.height());
			bar = 'linear-gradient(to bottom,' +
				bkcolor + ' 0%,' +
				bkcolor + ' ' + Math.min(y0, y1) + '%,' +
				color   + ' ' + Math.min(y0, y1) + '%,' +
				color   + ' ' + Math.max(y0, y1) + '%,' +
				bkcolor + ' ' + Math.max(y0, y1) + '%,' +
				bkcolor + ' 100%)';
		}

		_$.css('background-image', bar);

	}

});
