//
//	item_logic.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

pointer = { down: 'mousedown', move: 'mousemove', up: 'mouseup' };

if (navigator.userAgent.indexOf('iPhone') > 0 ||
	navigator.userAgent.indexOf('iPad') > 0 ||
	navigator.userAgent.indexOf('iPod') > 0 ||
	navigator.userAgent.indexOf('Android') > 0) {
	pointer = { down: 'touchstart', move: 'touchmove', up: 'touchend' };
}

$(function() {

	/* parameter logics */

	var Parameter = null;

	if (window.Parameter === undefined && window.parent.Parameter) {
		window.Parameter = window.parent.Parameter;
	}
	if (window.Parameter) {
		Parameter = window.Parameter;
	}

	if (Parameter) {
		var observer = {
			notify: function(bid, start, end) {
				for (var n in _items) {
					if (_items[n].pid) {
						parameter_update(_items[n], bid, start, end);
					}
				}
			}
		};
		Parameter.addObserver(observer);
		window.onbeforeunload = function() {
			Parameter.removeObserver(observer);
		}
		window.onpagehide = window.onbeforeunload; /* for iOS Safari */
	}

	function parameter_load(item) {
		var v;
		if (item.opt) {
			if (window.__opt === undefined) { __opt = {}; }
			if (__opt[item.pid + '=' + item.opt_type] === undefined) {
				__opt[item.pid + '=' + item.opt_type] = item.init;
			}
			v = __opt[item.pid + '=' + item.opt_type];
		} else if (Parameter) {
			v = Parameter.value(item.pid, item.size, item.vofs);
		} else {
			v = item.init;
		}
		update_item(item, v);
	}

	function parameter_change(item, v) {
		var pid = item.pid;
		if (item.opt)  { pid += ('=' + item.opt_type); __opt[pid] = v; }
		if (Parameter) { Parameter.setValue(item.pid, item.size, item.vofs, v); }
		if (__bind[pid]) {
			var bind = __bind[pid];
			for (var i = 0, num = bind.length; i < num; i++) {
				if (bind[i] == item.id) continue;
				update_item(_items[bind[i]], v);
			}
		}
	}

	function parameter_update(item, bid, start, end) {
		var pid = item.pid;
		if (item.opt) {
			if (_bid(pid).lastIndexOf(_bid(bid), 0) != 0) return;
			var addr = pid.substr(pid.lastIndexOf('%') + 1) * 1;
			if (start <= addr && addr < end) {
				var oid = bid + '%' + item.opt_addr;
				var type = Parameter.value(oid, INTEGER1x7, 0);
				if (type != item.opt_type) return;
				var v = Parameter.value(bid + '%' + addr , item.size, item.vofs);
				__opt[bid + '%' + addr + '=' + type] = v;
				if (pid.lastIndexOf(bid, 0) != 0) return;
				$('#' + item.id).trigger('elf-change', [v, true]);
			}
		} else { /* normal parameter */
			if (pid.lastIndexOf(bid, 0) != 0) return;
			var addr = pid.substr(pid.lastIndexOf('%') + 1) * 1;
			if (start <= addr && addr < end) {
				var v = Parameter.value(pid, item.size, item.vofs);
				$('#' + item.id).trigger('elf-change', [v, true]);
			}
		}
	}

	/* item logics */

	var controls = [
		'.elf-check-box-control',
		'.elf-radio-button-control',
		'.elf-text-input-control',
		'.elf-select-box-control',
		'.elf-select-list-control',
		'.elf-select-panel-control',
		'.elf-spinner-control',
		'.elf-spinner-up-control',
		'.elf-spinner-down-control',
		'.elf-knob-control',
		'.elf-slider-control',
		'.elf-dial-control',
		'.elf-bar-control',
	];
	controls = controls.join();

	$(document).on('elf-change', controls, function(e, v, update_only, reent) {
		var item = _items[$(this).attr('id')];
		item.val = v;
		if (update_only) {
			$('#' + item.id).trigger('elf-update', v);
		} else {
			if (item.pid)  { parameter_change(item, v); }
			if (!reent) {
				if (item.lower) { $('#' + item.lower).trigger('elf-constraint', [v, true ]); }
				if (item.upper) { $('#' + item.upper).trigger('elf-constraint', [v, false]); }
			}
		}
		item_logic(item, v);
		if (item.trig) { $('#' + item.id).trigger('elf-changed', [v, update_only]); }
		return false;
	});

	var responders = [
		'.elf-knob-control',
		'.elf-slider-control',
		'.elf-dial-control',
		'.elf-bar-control',
	];
	responders = responders.join();

	$(document).on('keydown', responders, function(e) {
		e.stopPropagation();
		if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
		var _$ = $(this);
		var v = _$.val();
		     if (e.keyCode == 37) { v--; } /* right arrow */
		else if (e.keyCode == 38) { v++; } /* up    arrow */
		else if (e.keyCode == 39) { v++; } /* left  arrow */
		else if (e.keyCode == 40) { v--; } /* down  arrow */
		else return;
		_$.trigger('elf-update', v);
		if (v == _$.val()) {
			_$.trigger('elf-change', v);
		}
	});

	$(document).on('click', '.elf-step-value', function(e) {
		e.stopPropagation();
		var item = _items[$(this).attr('id')];
		var e = new $.Event('keydown');
		if (item.inc) { e.keyCode = 38; $('#' + item.inc).trigger(e); return; }
		if (item.dec) { e.keyCode = 37; $('#' + item.dec).trigger(e); return; }
	});

	var constraints = [
		'.elf-spinner-control',
		'.elf-knob-control',
		'.elf-slider-control',
		'.elf-dial-control',
		'.elf-bar-control',
	];
	constraints = constraints.join();

	$(document).on('elf-constraint', constraints, function(e, v, lower) {
		var _$ = $(this);
		if (lower) {
			if (v <= _$.val()) return false;
		} else {
			if (v >= _$.val()) return false;
		}
		_$.trigger('elf-update', v);
		if (v == _$.val()) {
			_$.trigger('elf-change', [v, false, true]);
		}
		return false;
	});

	$(document).on('click', '.elf-popup', function(e) {
		e.stopPropagation();
		var item = _items[$(this).attr('id')];
		if (item.popup == '--close') {
			popup_close($(this).closest('.page-popup-style').attr('id'));
		} else {
			popup_open(item.popup);
		}
	});

	function update_item(item, v) {
		$('#' + item.id).trigger('elf-update', v);
		item_logic(item, v);
	}

	function item_logic(item, v) {
		item.val = v;
		if (item.stringer) { $('#' + item.stringer).trigger('elf-update', v); }
		if (item.replace && item.block) { replace_pid(item, v); }
		if (item.frame) {
			if (item.order && v < item.order.length) { v = item.order[v]; }
			$('#'+ item.frame).children().hide();
			$('#'+ item.frame).children().eq(v).show();
		}
	}

	function replace_pid(item, v) {
		var key = item.block.split(/[0-9]+\)$/g)[0];
		var num = item.block.match(/[0-9]+\)$/g);
		if (!num) return;
		num = (num[0].slice(0, -1) * 1) + (v * 1);

		$('#'+ item.replace).find('.elf-parameter').each(function() {
			var target = _items[$(this).attr('id')];
			var token = target.pid.split('%');
			for (var i = 0, len = token.length - 1; i < len; i++) {
				var b = token[i];
				if (b.lastIndexOf(key, 0) == 0) {
					token[i] = key + num + ')';
					target.pid = token.join('%');
					return;
				}
			}
		});

		bind_item();

		$('#'+ item.replace).find('.elf-parameter').each(function() {
			parameter_load(_items[$(this).attr('id')]);
		});
	}

	function bind_item() {
		window.__bind = {};
		for (var n in _items) {
			if (!_items[n].pid) continue;
			var item = _items[n];
			var pid = item.pid;
			if (item.opt) { pid += ('=' + item.opt_type); }
			if (__bind[pid] === undefined) { __bind[pid] = []; }
			__bind[pid].push(item.id);
		}
	}

	window.popup_open = function(id) {
		var wrapper = $('<div class="page-popup-wrapper"></div>');
		$(document.body).append(wrapper);
		$('#' + id).appendTo(wrapper).show();
	}

	window.popup_close = function(id) {
		$('#' + id).hide().unwrap().appendTo('#layout-wrapper');
	}

	window.update_language = function() {
		$('p[msg^="IDM"],label[msg^="IDM"],a[msg^="IDM"]').each(function() {
			var idm = $(this).attr('msg');
			if (idm) { $(this).text(MSG(idm)); }
		});
	};

	update_language();

	bind_item();

	/* load all pamameters */
	for (var n in _items) {
		if (_items[n].pid) {
			parameter_load(_items[n]);
		} else if (_items[n].init !== undefined ){
			update_item(_items[n], _items[n].init);
		}
	}

});
