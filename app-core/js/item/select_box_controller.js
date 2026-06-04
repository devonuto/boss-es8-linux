//
//	select_box_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	$(document).on('elf-update', '.elf-select-box-control', function(e, v) {
		var all = $('#' + $(this).attr('id') + '-box a');
		var opt = all.eq(v);
		all.removeAttr('checked');
		opt.attr('checked', 'checked');
		$(this).children('p').text(opt.text());
		return false;
	});

	var parent, box = null;

	function hide() {
		if (box) {
			$(box).unbind('keydown');
			$(box).hide().unwrap().appendTo($(parent));
			$(parent).focus();
			box = null;
		}
	}
	function skipEmpty(x, dir, offset) {
		if (offset == null) offset = 0;
		for (var i = offset; i < x.length; i++) {
			var y = x[i];
			if (y.text != "") {
				return x.index() + (i * dir);
			}
		}
		return x.index();
	}

	$(document).on('click', '.elf-select-box-control', function(e) {
		e.stopPropagation();
		hide();

		var _$ = $(this);
		parent = '#' + _$.attr('id');
		box = parent + '-box';

		var left   = _$.offset().left;
		var top    = _$.offset().top + _$.outerHeight();
		var width  = _$.outerWidth();
		var height = $(box).height();
		if (top + height > $(document).height()) {
			top = _$.offset().top - height;
		}

		$(box).css('left',  left  + 'px');
		$(box).css('top',   top   + 'px');
		$(box).css('width', width + 'px');

		var wrapper = $('<div class="select-popup-wrapper"></div>');
		$(document.body).append(wrapper);
		$(box).appendTo(wrapper).show();

		var opt = $(box).children('a[checked]');
		if (opt.length) opt[0].scrollIntoView(true);

		$(box).bind('keydown', function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
			var a = parent + '-box a';
			var v = $(a + '[checked]').index();
			var step = Math.floor($(box).height() / $(a).eq(v).height());

			var x;
			     if (e.keyCode == 13) /* enter      */ { $(a).eq(v).trigger('click'); return; }
			else if (e.keyCode == 27) /* esc        */ { hide(); return; } 
			else if (e.keyCode == 33) /* page up    */ {
				x = $(a).eq(v).prevAll(':visible');
				var idx = Math.min(step, x.length) - 1; if (idx < 0) return;
				x = $(a).eq(skipEmpty(x, -1, idx));
			}
			else if (e.keyCode == 34) /* page down  */ {
				x = $(a).eq(v).nextAll(':visible');
				var idx = Math.min(step, x.length) - 1; if (idx < 0) return;
				x = $(a).eq(skipEmpty(x, +1, idx));
			}
			else if (e.keyCode == 35) /* end        */ { x = $(box).find('a:visible:last'); }
			else if (e.keyCode == 36) /* home       */ { x = $(box).find('a:visible:first'); }
			else if (e.keyCode == 38) /* up   arrow */ {
				x = $(a).eq(v).prevAll(':visible');
				x = $(a).eq(skipEmpty(x, -1));
			}
			else if (e.keyCode == 40) /* down arrow */ {
				x = $(a).eq(v).nextAll(':visible');
				x = $(a).eq(skipEmpty(x, +1));
			}
			else return;

			if (x.length == 0) return;

			v = x.index();
			$(a).removeAttr('checked');
			$(a).eq(v).attr('checked', 'checked');
			/* adjust scrolling */
			var o = $(a).eq(v)[0];
			var boxHeight = o.offsetParent.clientHeight;
			var scrollTop = o.offsetParent.scrollTop;
			var scrollEnd = scrollTop + boxHeight - o.clientHeight;
			if (o.offsetTop < scrollTop) { $(box).scrollTop(o.offsetTop); }
			if (o.offsetTop > scrollEnd) { $(box).scrollTop(o.offsetTop + scrollTop - scrollEnd); }
		});
		$(box).focus();

	});
	
	$(document).on('keydown', '.elf-select-box-control', function(e) {
		e.stopPropagation();
		if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
		var a = '#' + $(this).attr('id') + '-box a';
		var v = $(a + '[checked]').index();
		var x;
		if (e.keyCode == 38) /* up   arrow */ {
			x = $(a).eq(v).prevAll(':not(:contains("\t*"))');
			var next = skipEmpty(x, -1);
			if (next != v) {
				$(this).trigger('elf-update', next);
				$(this).trigger('elf-change', next);
			}
		}
		else if (e.keyCode == 40) /* down arrow */ {
			x = $(a).eq(v).nextAll(':not(:contains("\t*"))');
			var next = skipEmpty(x, +1);
			if (next != v) {
				$(this).trigger('elf-update', next);
				$(this).trigger('elf-change', next);
			}
		}
		else return;
	});

	$(document).on('click', '.elf-select-box-option-control', function(e) {
		e.stopPropagation();
		$(box).children('a').removeAttr('checked');
		$(this).attr('checked', 'checked');
		$(parent).children('p').text($(this).text());
		hide();
		$(parent).trigger('elf-change', $(this).index());
	});

	$(window).resize(function() { hide(); });
	$(document).on(pointer.down, '.select-popup-wrapper', function(e) { e.preventDefault(); hide(); });
	$(document).on(pointer.down, '.elf-select-box', function(e) { e.stopPropagation(); });

});
