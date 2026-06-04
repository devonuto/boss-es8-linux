//
//	native.js
//
//	Copyright 2015 Roland Corporation. All rights reserved.
//

(function(window) {

	var _ = function() {};

	var native = {

		app: {
			ready: function() { _('$$app_ready'); },
			storage: function(data) { if (data !== undefined) _('$$app_storage', data); else return _('$$app_storage'); },
			clipboard: function(data) { if (data !== undefined) _('$$app_clipboard', data); else return _('$$app_clipboard'); },
			importfile: function(filter) { _('$$app_importfile', (filter ? JSON.stringify(filter) : undefined)); },
			exportfile: function(file) { _('$$app_exportfile', file); },
			control: function(req) { _('$$app_control', req) },
			exit: function() { _('$$app_exit'); },

			event: {
				command: function(param1, param2) {}
			}
		},

		midi: {
			input: {
				endpoints: function() { return JSON.parse(_('$$midi_inendpoints')); },
				connect: function(ep) { _('$$midi_inconnect', (ep ? JSON.stringify(ep) : undefined)); },
				disconnect: function(ep) { _('$$midi_indisconnect', (ep ? JSON.stringify(ep) : undefined)); }
			},
			output: {
				endpoints: function() { return JSON.parse(_('$$midi_outendpoints')); },
				connect: function(ep) { _('$$midi_outconnect', (ep ? JSON.stringify(ep) : undefined)); },
				disconnect: function(ep) { _('$$midi_outdisconnect', (ep ? JSON.stringify(ep) : undefined)); }
			},
			send: function(msg) { _('$$midi_send', msg); },
			panel: function() { _('$$midi_panel'); },

			event: {
				message: function(msg, timestamp) {},
				changed: function() {},
				connectfailed: function(ep) {},
				error: function(code) {}
			}
		},

		thru: {
			input: {
				endpoints: function() { return JSON.parse(_('$$thru_inendpoints')); },
				connect: function(ep) { _('$$thru_inconnect', (ep ? JSON.stringify(ep) : undefined)); },
				disconnect: function(ep) { _('$$thru_indisconnect', (ep ? JSON.stringify(ep) : undefined)); }
			},
			output: {
				endpoints: function() { return JSON.parse(_('$$thru_outendpoints')); },
				connect: function(ep) { _('$$thru_outconnect', (ep ? JSON.stringify(ep) : undefined)); },
				disconnect: function(ep) { _('$$thru_outdisconnect', (ep ? JSON.stringify(ep) : undefined)); }
			},
			send: function(msg) { _('$$thru_send', msg); },
			panel: function() { _('$$thru_panel'); },

			event: {
				changed: function() {},
				connectfailed: function(ep) {},
				error: function(code) {}
			}
		},

		player: {
			open: function(file) { return _('$$player_open', file); },
			play: function() { _('$$player_play'); },
			pause: function() { _('$$player_pause'); },
			stop: function() { _('$$player_stop'); },
			locate: function(time) { _('$$player_locate', time * 1.0); },
			volume: function(gain) { return _('$$player_volume', gain); },
			file: function() { return _('$$player_file'); },
			status: function() { return _('$$player_status'); },
			channels: function() { return _('$$player_channels'); },
			peakpower: function(cahnnel) { return _('$$player_peakpower', cahnnel); },
			time: function() { return _('$$player_time'); },
			totaltime: function() { return _('$$player_totaltime'); },

			event: {
				eof: function(file) {},
				stop: function(file) {},
				error: function(file) {}
			}
		},

		recorder: {
			create: function(file, format) { return _('$$recorder_create', file, format * 1); },
			record: function() { _('$$recorder_record'); },
			pause: function() { _('$$recorder_pause'); },
			stop: function() { _('$$recorder_stop'); },
			volume: function(gain) { return _('$$recorder_volume', gain); },
			file: function() { return _('$$recorder_file'); },
			status: function() { return _('$$recorder_status'); },
			channels: function() { return _('$$recorder_channels'); },
			peakpower: function(cahnnel) { return _('$$recorder_peakpower', cahnnel); },
			time: function() { return _('$$recorder_time'); },

			event: {
				stop: function(file) {},
				error: function(file) {}
			}
		},

		rwc: {
			discovery: function() { _('$$rwc_discovery'); },
			connect: function(dev) { _('$$rwc_connect', JSON.stringify(dev)); },
			disconnect: function() { _('$$rwc_disconnect'); },
			device: function() { var dev = _('$$rwc_device'); return (dev ? JSON.parse(dev) : null); },
			send: function(msg) { _('$$rwc_send', msg); },
			inputmode: function(mode) { _('$$rwc_inputmode', mode); },
			timeout: function(sec) { return _('$$rwc_timeout', sec); },
			keepalive: function(sec) { return _('$$rwc_keepalive', sec); },

			event: {
				found: function(dev) {},
				connected: function(dev) {},
				connectfailed: function(dev) {},
				closed: function(dev) {},
				message: function(msg, timestamp) {},
				error: function(dev) {}
			}
		},

		http: {
			download: function(url, to) { return _('$$http_download', url, to); },
			cancel: function(id) { _('$$http_cancel', id); },

			event: {
				progress: function(id, total, amount) {},
				download: function(id, file) {},
				error: function(id, url) {}
			}
		},

		fs: {
			separator: function() { return _('$$fs_separator'); },
			path: function(where) { return _('$$fs_path', where); },
			volumes: function() { return JSON.parse(_('$$fs_volumes')); },
			contents: function(path) { return JSON.parse(_('$$fs_contents', path)); },
			stat: function(path) { return JSON.parse(_('$$fs_stat', path)); },
			exec: function(file) { _('$$fs_exec', file); },
			mkdir: function(path) { _('$$fs_mkdir', path); },
			unlink: function(path) { _('$$fs_unlink', path); },
			copy: function(from, to) { _('$$fs_copy', from, to); },
			move: function(from, to) { _('$$fs_move', from, to); },
			unzip: function(zip, folder) { _('$$fs_unzip', zip, folder); },
			readString: function(file) { return _('$$fs_readString', file); },
			readData: function(file) { return _('$$fs_readData', file); },
			writeString: function(file, text) { _('$$fs_writeString', file, text); },
			writeData: function(file, data) { _('$$fs_writeData', file, data); },
			appendString: function(file, text) { _('$$fs_appendString', file, text); },
			appendData: function(file, data) { _('$$fs_appendData', file, data); },
			openfilename: function(filter) { _('$$fs_openfilename', (filter ? JSON.stringify(filter) : undefined)); },
			savefilename: function(name, ext)  { _('$$fs_savefilename', name, ext); },
			unmount: function(path) { _('$$fs_unmount', path); },
 
			event: {
				openfilename: function(file) {},
				savefilename: function(file) {},
				unmounted: function(path) {},
				unmountfailed: function(path, reason) {}
			}
		},

		recognizer: {
			start: function() { _('$$recognizer_start'); },
			stop: function() { _('$$recognizer_stop'); },

			event: {
				partial: function(text) {},
				final: function(text) {},
				error: function(reason) {}
			}
		},

		stop: function() {},    /* for iOS, calling from applicationDidEnterBackground */
		restart: function() {}, /* for iOS, calling from applicationWillEnterForeground */

		exec: function(args) { return encode(_.apply(null, args)); } /* for target.html */

	};

	if (typeof window.$$app !== 'undefined') {
		_ = function() {
			var a = arguments[0].split('_');
			var o = a[0]; var f = a[1];
			if (typeof arguments[2] !== 'undefined')
				return window[o][f](arguments[1], arguments[2]);
			if (typeof arguments[1] !== 'undefined')
				return window[o][f](arguments[1]);
			return window[o][f]();
		}
	} else if (navigator.userAgent.indexOf('roland.quattro') != -1) {
		_ = function() {
			var xhr = new XMLHttpRequest();
			xhr.open('HEAD', '/!quattro?' + (+new Date()), false);
			xhr.setRequestHeader('method', arguments[0]);
			if (typeof arguments[1] !== 'undefined')
				xhr.setRequestHeader('arg1', encodeURIComponent(arguments[1]));
			if (typeof arguments[2] !== 'undefined')
				xhr.setRequestHeader('arg2', encodeURIComponent(arguments[2]));
			xhr.send(null);
			return decode(xhr.responseText);
		}
	} else if (typeof window.$$xhrport !== 'undefined') {
		_ = function() {
			var xhr = new XMLHttpRequest();
			var url = 'http://localhost:' + window.$$xhrport + '/' + arguments[0];
			if (typeof arguments[1] !== 'undefined')
				url += ';' + encodeURIComponent(arguments[1]);
			if (typeof arguments[2] !== 'undefined')
				url += ',' + encodeURIComponent(arguments[2]);
			xhr.open('GET', url, false);
			xhr.send(null);
			return decode(xhr.responseText);
		}
	}

	function encode(x) {
		     if (typeof x === 'undefined') return 'v';
		else if (typeof x === 'boolean')   return 'b' + x;
		else if (typeof x === 'number')    return 'f' + x;
		else if (typeof x === 'string')    return 's' + x;
		/* other */ return 'v';
	}

	function decode(str) {
		var x = str.slice(1);
		switch (str.charAt(0)) {
			case 'b': return Boolean(x);
			case 'd': return parseInt(x);
			case 'f': return parseFloat(x);
			case 's': return x;
			case 'r': native.restart();
			case 'v': return undefined;
		}
		throw new Error(x);
	}

	var getevent = function() {
		var args, prop, type;
		var ev;
		while (ev = _('$$app_getevent')) {
			args = ev.split('\f');
			prop = args.shift();
			type = args.shift();
			if (native[prop] && native[prop].event[type]) {
				native[prop].event[type].apply(native, args);
			}
		}
	};

	window.$native = native; /* export window object */
	window.$event = { start: function(delay) { window.setInterval(getevent, delay ? delay : 50); } };

	if (typeof window.$$xhrport !== 'undefined') {
		window.$event = {
			received: function(ev) {
				var args = ev.split('\f');
				var prop = args.shift();
				var type = args.shift();
				if (native[prop] && native[prop].event[type]) {
					native[prop].event[type].apply(native, args);
				}
			},
			start: function() { window.webkit.messageHandlers.getevent.postMessage(''); }
		};
	}
 
})(window);
