//
//	librarian_setting.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

function LibrarianSetting1() {

	this.rows = 128;
	this.blockSet = [];
	this.temporarySet = {};

	this.readStart = function(midi) {}
	this.readStop = function(midi) {}
	this.writeStart = function(midi) {}
	this.writeCommand = function(midi) {}
	this.writeStop = function(midi) {}
	this.writeTemporaryStart = function(midi, row) {}
	this.writeTemporaryStop = function(midi) {}
	this.previewStart = function(midi) {}
	this.previewStop = function(midi) {}

	this.columnInfo = [
		{ type: 'text12', width: '12' },
	];
	this.value = function(paramSet, column) {
		return 'INIT TONE   ';
	}
	this.setValue = function(paramSet, column, value) {
	}
}

function LibrarianSetting2() {

	this.rows = 64;
	this.blockSet = [];
	this.temporarySet = {};

	this.readStart = function(midi) {}
	this.readStop = function(midi) {}
	this.writeStart = function(midi) {}
	this.writeCommand = function(midi) {}
	this.writeStop = function(midi) {}
	this.writeTemporaryStart = function(midi, row) {}
	this.writeTemporaryStop = function(midi) {}
	this.previewStart = function(midi) {}
	this.previewStop = function(midi) {}

	this.columnInfo = [
		{ type: 'text12', width: '12' },
	];
	this.value = function(paramSet, column) {
		return 'INIT RHYTHM ';
	}
	this.setValue = function(paramSet, column, value) {
	}
}
