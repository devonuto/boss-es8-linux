//
//	message.js
//
//	Copyright 2016 Roland Corporation. All rights reserved.
//

function Message_en() {}
function Message_ja() {}
Message_ja.prototype = new Message_en();

language = 'en';
messageSet = {
	en: new Message_en,
	ja: new Message_ja,
};

(function(window) {
	language = (navigator.userLanguage || navigator.language).substr(0, 2);
	if (language != 'ja') language = 'en';
	window.MSG = function(id) { return messageSet[language][id]; }
})(window);

/* for ENGLISH */
Message_en.prototype.IDM_CANCEL				= "CANCEL"
Message_en.prototype.IDM_CLOSE				= "CLOSE"
Message_en.prototype.IDM_INVALID_FILE		= "Invalid data format."
Message_en.prototype.IDM_READ_TIMEOUT		= "MIDI Connection error."

/*-----------------------------------------------------------------------------------------*/
/* ES-8 Editor original Error message */
Message_en.prototype.ERROR_DATAMISMATCH		= "Data Mismatch"
Message_en.prototype.ERROR_LOADING		= "Read error."
Message_en.prototype.CANNOT_WRITE               = "Write error."
Message_en.prototype.ERROR_VERSION		= "Version Mismatch"
Message_en.prototype.ERROR_CHECKSUM		= "Check Sum Error"

/* ES-8 Editor original Warning message */
Message_en.prototype.WARNING_NO_MORE_MIXER	= "No more mixers are available."

/* ES-8 Editor original working message */
Message_en.prototype.IDM_NOW_WORKING		= "Now working..."
Message_en.prototype.IDM_NOW_WRITING		= "Now writing..."
Message_en.prototype.IDM_NOW_READING		= "Now reading..."
Message_en.prototype.IDM_NOW_EXPORTING		= "Now exporting..."
Message_en.prototype.IDM_WAIT			= "Please wait until the process is completed."
Message_en.prototype.IDM_CHOOSE_PATCH		= "Choose the patch"

Message_en.prototype.IDM_EXECUTE		= "EXECUTE"
Message_en.prototype.IDM_IMPORT			= "All patch data will be replaced with import data."
Message_en.prototype.IDM_PULL			= "Pull out the latest current patch data from ES-8."
Message_en.prototype.IDM_PULL_ALL		= "Pull out all data from ES-8."
Message_en.prototype.IDM_PULL_BANK		= "Pull out the current bank patch data from ES-8."
Message_en.prototype.IDM_PULL_NAMELIST		= "Pull out the patch name lists from ES-8."
Message_en.prototype.IDM_PULL_SYSTEM		= "Pull out the system data from ES-8."
Message_en.prototype.IDM_PUSH_ALL		= "Push all data to ES-8."

/* ES-8 Editor local error message */
Message_en.prototype.COPY_EMPTY                 = "please copy patch before paste."
Message_en.prototype.NOT_SELECTED_CELL          = "Please, select cell to replace."
Message_en.prototype.SELECTED_MULTI_CELL        = "Please select only one cell."
Message_en.prototype.ERROR_NOT_SUPPORTED	= "Not Supported"
Message_en.prototype.ERROR_UNKNOWN		= "Unknown error";
Message_en.prototype.ERROR_KEY_NOT_FOUND	= "Key not found!!!";
Message_en.prototype.WARNING_CANNOT_MIX_VALUE	= "Cannot mix value";
Message_en.prototype.WARNING_NOT_EXIST_VALUE	= "Not exist value";
Message_en.prototype.WARNING_LENGTH_OF_POSITION_INCORRECT = "length of position incorrect.";
Message_en.prototype.WARNING_CIRCLE 		= "this node in Circle Bracket.";
Message_en.prototype.WARNING_SEPARATE 		= "can not change to separate.";
Message_en.prototype.WARNING_INVALID_NODE 	= "Invalid node.";
Message_en.prototype.WARNING_INVALID_ITEM 	= "Invalid item.";
Message_en.prototype.WARNING_POSITION 		= "Position of drag invalid.";


/*-----------------------------------------------------------------------------------------*/
/* for JAPANESE */
