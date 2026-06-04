//
//	editor_setting.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

function EditorSetting1() {

	this.blockSet = [];

	this.readStart = function(midi) {}
	this.readStop = function(midi) {}
	this.syncStart = function(midi) {}
	this.syncStop = function(midi) {}
	this.previewStart = function(midi, part) {}
	this.previewStop = function(midi) {}

	this.parts = 0;
}

function EditorSetting2() {

	this.blockSet = [];

	this.readStart = function(midi) {}
	this.readStop = function(midi) {}
	this.syncStart = function(midi) {}
	this.syncStop = function(midi) {}
	this.previewStart = function(midi, part) {}
	this.previewStop = function(midi) {}

	this.parts = 16;
	this.partSet = function(part) {
		return {}; /* return block ids corresponded to part */
	}
}
