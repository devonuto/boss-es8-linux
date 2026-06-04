$(function(){

    $('#lDialogAboutTitle').empty().append($('<p></p>', {text: window.ProductSetting.name}));
    $('#lDialogAboutVersion').empty().append($('<p></p>', {text: 'Ver ' + window.ProductSetting.versionNumber + ' ' + window.ProductSetting.buildNumber}));
    $('#lDialogAboutCopyright').empty().append($('<p></p>', {text: window.ProductSetting.copyright}));

    var license = ($('<div class="license_information_separator"></div>'));
    license.append($('<p></p>', {align: "left", text: "jQuery JavaScript Library v1.10.2"}));
    license.append($('<p></p>', {align: "left", text: "http://jquery.com/"}));
    license.append($('<p></p>', {align: "left", text: "Includes Sizzle.js"}));
    license.append($('<p></p>', {align: "left", text: "http://sizzlejs.com/"}));
    license.append($('<p></p>', {align: "left", text: "Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors"}));
    license.append($('<p></p>', {align: "left", text: "Released under the MIT license"}));
    license.append($('<p></p>', {align: "left", text: "http://jquery.org/license"}));
    $('#lDialogAboutInfo').empty().append(license);

    license = ($('<div class="license_information_separator"></div>'));
    license.append($('<p></p>', {align: "left", text: "jQuery UI Widget 1.12.1"}));
    license.append($('<p></p>', {align: "left", text: "http://jqueryui.com"}));
    license.append($('<p></p>', {align: "left", text: "Copyright jQuery Foundation and other contributors"}));
    license.append($('<p></p>', {align: "left", text: "Released under the MIT license."}));
    license.append($('<p></p>', {align: "left", text: "http://jquery.org/license"}));
    $('#lDialogAboutInfo').append(license);

});
