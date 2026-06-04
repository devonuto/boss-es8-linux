//
//	import.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

try  {
	function _load(url) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.send(null);
		return xhr.responseText;
	}
	var _ITEM_DATA  = _load('export/item.json');
	var _LAYOUT_DIV = _load('export/layout.div');
	_items = JSON.parse(_ITEM_DATA);
	_ITEM_DATA = null;
} catch (e) { alert(e); }

$(function() {
	if (!_LAYOUT_DIV) {
		_LAYOUT_DIV = '<p>Chrome needs option "--allow-file-access-from-files"</p>';
	}
	$('#layout-wrapper').append(_LAYOUT_DIV);
	_LAYOUT_DIV = null;
});
