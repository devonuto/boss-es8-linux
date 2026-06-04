//
//	select_panel_controller.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

$(function() {

	$(document).on('elf-update', '.elf-select-panel-control', function(e, v) {
		var all = $('#' + $(this).attr('id') + '-panel img');
		var opt = all.eq(v);
		all.prop('selected', false);
		opt.prop('selected', true);
		$(this).css('background-image', 'url("' + opt.attr('src') + '")');
		return false;
	});

	var parent, panel = null;

	function hide() {
		if (panel) {
			$(panel).unbind('keydown');
			$(panel).hide().unwrap().appendTo($(parent));
			panel = null;
		}
	}

	$(document).on('click', '.elf-select-panel-control', function(e) {
		e.stopPropagation();
		hide();

		var _$ = $(this);
		parent = '#' + _$.attr('id');
		panel = parent + '-panel';

		var wrapper = $('<div class="select-popup-wrapper"></div>');
		$(document.body).append(wrapper);
		$(panel).appendTo(wrapper);

		var left = _$.offset().left;
		var top  = _$.offset().top + _$.outerHeight();
		var width  = $(panel).width();
		var height = $(panel).height();
		if (left + width > $(document).width()) {
			left -= ((left + width - 8) - $(document).width());
		}
		if (top + height > $(document).height()) {
			top -= ((top + height - 8) - $(document).height());
		}

		$(panel).css('left', left + 'px');
		$(panel).css('top',  top  + 'px');
		$(panel).show();

		$(panel).bind('keydown', function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;
			if (e.keyCode == 27) { hide(); return; } /* esc */ 
		});
		$(panel).focus();

	});

	$(document).on('click', '.elf-select-panel-option-control', function(e) {
		e.stopPropagation();
		hide(); 
		$(parent).css('background-image', 'url("' + $(this).attr('src') + '")');
		$(parent).trigger('elf-change', $(this).index());
	});

	$(window).resize(function() { hide(); });
	$(document).on(pointer.down, '.select-popup-wrapper', function(e) { e.preventDefault(); hide(); });
	$(document).on(pointer.down, '.elf-select-panel', function(e) { e.stopPropagation(); });

});
