//
//	spinner_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {
	var intervalUpId;
	var intervalDownId;
	$(document).on('elf-update', '.elf-spinner-control', function(e, v) {
		$(this).prop('value', v);
		var _$input = $(this).children('input');
		_$input.val(power(_$input, (v * 1)));
		return false;
	});

	$(document).on('change', '.elf-spinner-control', function(e) {
		e.stopPropagation();
		var _$input = $(this).children('input');
		var v = _$input.val();
		if (isNaN(v)) { v = $(this).val() } else { v = invert(_$input, v) }
		calc(_$input, (v * 1));
	});

	$('.elf-spinner-up-control').on('mouseout', function(e) {
		if (intervalUpId !== null)
		{
			clearInterval(intervalUpId);
			intervalUpId = null;
		}
	});
	$('.elf-spinner-down-control').on('mouseout', function(e) {
		if (intervalDownId !== null)
		{
			clearInterval(intervalDownId);
			intervalDownId = null;
		}
	});
	$('.elf-spinner-up-control').on('click', function(e) {
//		inc(e, this);
	});
	$('.elf-spinner-up-control').on('mousedown', function(e) {
		t = this;
		if (e.button == 0) {
			if (intervalUpId == null)
			{
				inc(e, t);
				intervalUpId = setTimeout(function() {
					clearTimeout(intervalUpId);
					intervalUpId = setInterval(
						function() {
							inc(e, t);
						},
						100
					);
				}, 800);
			}
		}
	});
	$('.elf-spinner-up-control').on('mouseup', function(e) {
		if (e.button == 0) {
			if (intervalUpId !== null) {
				clearInterval(intervalUpId);
				intervalUpId = null;
			}
		}
	});
	$('.elf-spinner-down-control').on('mousedown', function(e) {
		t = this;
		if (e.button == 0) {
			if (intervalDownId == null)
			{
				dec(e, t);
				intervalDownId = setTimeout(function() {
					clearTimeout(intervalDownId);
					intervalDownId = setInterval(
						function() {
							dec(e, t);
						},
						100
					);
				}, 800);
			}
		}
	});
	$('.elf-spinner-down-control').on('mouseup', function(e) {
		if (e.button == 0) {
			if (intervalDownId !== null) {
				clearInterval(intervalDownId);
				intervalDownId = null;
			}
		}
	});

	$('.elf-spinner-down-control').on('click', function(e) {
//		dec(e, this);
	});

	function calc(_$input, v) {
		if (isNaN(v)) {
			v = _$input.prop('defaultValue');
		}
		var min = _$input.attr('min'); if (!min) min = 0;
		var max = _$input.attr('max'); if (!max) max = 0;
		min *= 1; max *= 1;
		if (v < min) v = min;
		if (v > max) v = max;
		_$input.val(power(_$input, v));
		_$input.parent().val(v);
		_$input.parent().trigger('elf-change', v);
	}

	function power(_$, v) {
		var n = _$.attr('power');
		if (n) {
			v = v * Math.pow(10, n);
			if (n < 0) v = v.toFixed(Math.abs(n));
		}
		return v;
	}

	function invert(_$, v) {
		var n = _$.attr('power');
		if (n) { v = Math.round(v * Math.pow(10, -n)); }
		return v;
	}

	function inc(e, t) {
		e.stopPropagation();
		var _$input = $(t).siblings('input');
		var v = _$input.parent().val() * 1;
		calc(_$input, v + 1);
	}

	function dec(e, t) {
		e.stopPropagation();
		var _$input = $(t).siblings('input');
		var v = _$input.parent().val() * 1;
		calc(_$input, v - 1);
	}

});
