$(function () {
    var _selected_items = [];
    var _selected_items_drag = [];
    var _lastSelected;
    var _tableRows;
    var _selected_class = 'selected';
    var _multiselected = false;
    var _isDrag = false;

    var _exportFileName = "";

    const contextActionCopy = 0;
    const contextActionPaste = 1;
    // const contextActionInsert = 2;
    const contextActionName = 2;
    const contextActionExport = 3;

    // Event click on button Import
    $(document).on('click', '#bLibrarianImport', function () {
        importFile();
    });

    $(document).on('click', '#bDialogImportExecute', function () {
        importFileExecute();
    });

    $(document).on('click', '#bLibrarianExport', function (e) {
        exportFile($es.container);
    });

    $(document).on('mousedown', '#librarian_table td:not(:first-child)', function (e) {    
        if (e.shiftKey) {
            var lastrow = $(_lastSelected).closest('tr').index();
            var lastcolumn = $(_lastSelected).index();
            var firstrow = $(this).closest('tr').index();
            var firstcolumn = $(this).index();

            var start = Math.min(firstrow, lastrow);
            var end = Math.max(firstrow, lastrow) + 1;
            var startc = Math.min(firstcolumn, lastcolumn);
            var endc = Math.max(firstcolumn, lastcolumn) + 1;

            for (var i = start; i < end; i++) {
                for (var j = startc; j < endc; j++) {
                    $(_tableRows[i]).children().eq(j).addClass(_selected_class);
                }
            }
            _lastSelected = $(this);
            _multiselected = true;

        } else if (e.ctrlKey || e.metaKey) {
            _lastSelected = $(this);
            _multiselected = true;
        } else {
            if (e.button === 0) {// Click
                if(!_multiselected){
                    $("#librarian_table td").removeClass(_selected_class);
                    $("#librarian_table tr").removeClass(_selected_class);
                }else{
                    _multiselected = false;
                }
                $(this).addClass(_selected_class);
            } else if (e.button === 2) { // right click
                if (!$(this).hasClass(_selected_class)) {
                    $("#librarian_table td").removeClass(_selected_class);
                    $("#librarian_table tr").removeClass(_selected_class);
                    $(this).addClass(_selected_class);
                }
                var action = 'Name';
                if ($('#librarian_table').find('.' + _selected_class).length > 1) {
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).addClass('disable');
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).children().eq(0).addClass('disable');
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).children().removeAttr('data-action');

                } else {
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).removeClass('disable');
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).children().eq(0).removeClass('disable');
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).children().attr('data-action', action);
                }
            }
            _lastSelected = $(this);
            copy_drag();
        }
    }).on('mouseup', '#librarian_table td:not(:first-child)', function (e) {
        if (e.shiftKey) {
        } else if (e.ctrlKey ||e.metaKey) {
            if (e.which === 1) {
                $(this).toggleClass(_selected_class);
            }else{
                $(this).addClass(_selected_class);
            }
            if (e.button === 2) {
                var action = 'Name';
                if ($('#librarian_table').find('.' + _selected_class).length > 1) {
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).addClass('disable');
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).children().eq(0).addClass('disable');
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).children().removeAttr('data-action');

                } else {
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).removeClass('disable');
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).children().eq(0).removeClass('disable');
                    $('.context-menu-tems').eq(0).children().eq(contextActionName).children().attr('data-action', action);
                }
            }
        } else {
            if (e.which === 1) {// Click
                if(!_multiselected){
                    $("#librarian_table td").removeClass(_selected_class);
                    $("#librarian_table tr").removeClass(_selected_class);
                }
                $(this).addClass(_selected_class);
            }
        }

    });

    $(document).on('click', '#librarian_table td:first-child', function (e) {
        if (e.shiftKey) {
            var last = $(_lastSelected).closest('tr').index();
            var first = $(this).closest('tr').index();
            var start = Math.min(first, last);
            var end = Math.max(first, last) + 1;
            $("#librarian_table tr td").removeClass(_selected_class);
            for (var i = start; i < end; i++) {
                $(_tableRows[i]).children().addClass(_selected_class);
            }
            _multiselected = true;

        } else if (e.ctrlKey || e.metaKey) {
            $(this).closest('tr').children().toggleClass(_selected_class);
            _lastSelected = $(this);
            _multiselected = true;
        } else {
            $("#librarian_table tr td").removeClass(_selected_class);
            $(this).closest('tr').children().addClass(_selected_class);
            _lastSelected = $(this);
            _multiselected = true;
        }
    });

    // handle hotkey Ctrl + A/C/V
    $(document).keydown(function (e) {
        // User pressed and hold Ctrl
        if (_isDrag) {
            if (e.keyCode === 27) {
                $(c.helper).remove();
                _isCancelDrop = true;
            }
        }
        else if (e.ctrlKey || e.metaKey) {
            switch (e.keyCode) {
                case 65: // User pressed "A" key: select all
                    select_All();
                    break;
                case 67: // User pressed "C" key: copy value to clipborad
                    copy();
                    break;
                case 86: // User pressed "V" key: replace
                    Paste('Replace');
                    break;
            }
        }
    });

    $(document).on('dblclick', '#librarian_table td:not(:first-child)', function (e) {
        e.stopPropagation();
        var currentEle = $(this);
        var value = $(this).text();
        nameEdit(currentEle, value);
    });

    $(document).on('click', '.context-menu-link', function (e) {
        var action = $(this).attr('data-action');
        var selected_cell;
        if(e.ctrlKey || e.metaKey){
            e.preventDefault();
        }
        switch (action) {
            case 'Copy': // Click copy on menu / Ctrl + C
                copy();
                break;
            case 'Replace': // Click replace on menu / Ctrl + V
                Paste('Replace');
                break;
            case 'Insert': // Click Insert on menu
                Paste('Insert');
                break;
            case 'Name': // Click Name on menu
                if ($('#librarian_table').find('.' + _selected_class).length <= 0) {
                    WarningDialog('NOT_SELECTED_CELL');
                } else if ($('#librarian_table').find('.' + _selected_class).length > 1) {
                    WarningDialog('SELECTED_MULTI_CELL');
                } else {
                    e.stopPropagation();
                    selected_cell = $('#librarian_table').find('.' + _selected_class).eq(0);
                    var currentEle = $(selected_cell);
                    var value = $(selected_cell).text();
                    nameEdit(currentEle, value);
                }
                break;
            case 'Export': // Click Export on menu
                individualExportFile();
                break;
            default :
                return;
                break;
        }
    });

    function WarningDialog(contain) {
        $es.dialog.openWarning(contain);
    }
    function ErrorDialog(contain) {
        $es.dialog.openError(contain);
    }

    function ConvertToCode(value) {
        var str = [];
        for (var i = 0; i < value.length; i++) {
            str.push(hexFormat(value[i].charCodeAt(0)));
        }
        if(str.length < 16){
            for(var i = str.length; i < 16; i++){
                str[i] = "0x20";
            }
        }
        return str;

    }
    function  hexFormat(value) {
        return "0x" + hex2(value);
    }

    function DisplayString(value) {
        var str = '';
        for (var i = 0; i < value.length; i++) {
            str += String.fromCharCode(value[i]);
        }
        function rtrim(text) {
            return (text || "").replace(/\s+$/g, "");
        }
        return rtrim(str);
    }

    function cell_item(row, col, num, value) {
        this.row = row;
        this.col = col;
        this.num = num;
        this.value = value;
    }

    function importFileExecute() {
        var o;
        try {
            o = JSON.parse($native.fs.readString(_importFileName));
        } catch (e) {
            ErrorDialog('ERROR_LOADING');
        }
        if (o.target !== $es.container.target || o.format !== $es.container.format) {
            WarningDialog('IDM_INVALID_FILE');
            return;
        } else {
            o.system.ID_SYSTEM_MIDI_SETTING_DEVICE_ID = $es.midi.deviceId();
            $es.container = o;
            (function () {
                return $es.push(0, NUMOF_PATCH, false, MSG('IDM_PUSH_ALL'));
            })()
            .then(function (e) {
                update_table();
            })
            .catch(function (e) {
                update_table();
            });
        }
    }
    function importFile() {
        var fs = $native.fs;
        fs.event.openfilename = function (file) {
            if (file) {
                _importFileName = file;
                $es.dialog.open('#dialog_import');
            }
        };
        var filter = [ProductSetting.extension];
        fs.openfilename(filter);
    }

    function makeExportFile() {
        return new Promise(function(resolve, reject) {
            var fs = $native.fs;
            fs.event.savefilename = function (to) {
                if (to) {
                    _exportFileName = to;
                    resolve();
                } else {
                    reject();
                }

            };
            var name = ProductSetting.name;
            var ext = ProductSetting.extension;
            try {
                fs.savefilename(name, ext);
            }
            catch (e) {
                reject(e);
            }
        });
    }

    function exportFile(target) {
        makeExportFile().then(function() {
            (function() {
                return $es.pull(0, NUMOF_PATCH, false, MSG('IDM_PULL_ALL'));
            })()
            .then(function (e) {
                try {
                    $native.fs.writeString(_exportFileName, JSON.stringify(target));
                } catch (e) {
                    ErrorDialog('CANNOT_WRITE');
                }
                update_table();
            })
            .catch(function (e) {
                update_table();
            });
        }, function(){
            update_table();
        });
    }

    function select_All() {
        $('#librarian_table td').addClass(_selected_class);
    }

    function copy() {
        _selected_items = [];
        var tmp_item;
        var selPull = [];

        var sel = $("#librarian_table tbody td:not(:first-child)").each(function() {
            if ($(this).hasClass(_selected_class)) {
                var num = $(this).closest('tr').index() * 8 + ($(this).index() - 1);
                selPull.push(function(){return $es.pullOne(num + 1)});
                selPull.push(function(){
                    return new Promise(function(resolve, reject) {
                        tmp_item = {'num': num, 'value': JSON.parse(JSON.stringify($es.container.patch[num]))};
                        _selected_items.push(tmp_item);
                        resolve();
                    });
                })
            }
        });
        selPull.push(function(){
            return new Promise(function(resolve, reject) {
                $es.dialog.closeWait();
                resolve();
            })
        });
        $es.dialog.openWait(selPull.length, MSG('IDM_NOW_READING'));

        selPull.reduce(function (prev, curr, indedx, array) {
            return prev.then(curr);
        }, Promise.resolve());
    }

    function individualExportFile() {
        _selected_items_drag = [];
        var tmp_item;
        var selPull = [];
        var sel = [];

        selPull.push(function() { return makeExportFile();});
        selPull.push(function() {
            return new Promise(function(resolve, reject){
                $es.dialog.openWait(sel.length, MSG('IDM_NOW_EXPORTING'));
                resolve();
            });
        });
        $("#librarian_table tbody td:not(:first-child)").each(function() {
            if ($(this).hasClass(_selected_class)) {
                var row = $(this).closest('tr').index();
                var col = $(this).index() - 1;
                var num = row * 8 + col;
                selPull.push(function(){return $es.pullOne(num + 1)});
                selPull.push(function(){
                    return new Promise(function(resolve, reject) {
                        tmp_item = new cell_item(row, col, num, JSON.parse(JSON.stringify($es.container.patch[num])));
                        _selected_items_drag.push(tmp_item);
                        resolve();
                    });
                });
                sel.push(num);
            }
        });
        selPull.push(function() {
            return new Promise(function(resolve, reject) {
                $es.dialog.closeWait();
                resolve();
            });
        });
        selPull.push(function(){
            return new Promise(function(resolve, reject) {
                if (_selected_items_drag.length > 0) {
                    var _tmp_container = $es.getNewContainer();

                    for (var i = 0; i < _selected_items_drag.length; i++) {
                        _tmp_container.patch[i] = _selected_items_drag[i].value;
                    }
                    try {
                        $native.fs.writeString(_exportFileName, JSON.stringify(_tmp_container));
                    } catch (e) {
                        ErrorDialog('CANNOT_WRITE');
                    }
                    update_table();
                } else {
                    ErrorDialog('COPY_EMPTY');
                }
                resolve();
            });
        });

        selPull.reduce(function (prev, curr, indedx, array) {
            return prev.then(curr);
        }, Promise.resolve());
    }

    function copy_drag() {
        _selected_items_drag = [];
        var item;
        $("#librarian_table tbody td:not(:first-child)").each(function () {
            if ($(this).hasClass(_selected_class)) {
                if (($(this).index() - 1) < 8) {
                    var row = $(this).closest('tr').index();
                    var col = $(this).index() - 1;
                    var num = row * 8 + col;
                    item = new cell_item(row, col, num, JSON.parse(JSON.stringify($es.container.patch[num])));
                    _selected_items_drag.push(item);
                }
            }
        });
    }

    function exchange(row, col)
    {
        var position_col = col;
        var position_row = row;
        if (_selected_items_drag.length > 0) {
            for (var i = 0; i < _selected_items_drag.length; i++) {
                position_col = (i + col) % 8;
                position_row = row + Math.floor((i + col) / 8);
                var srcNum = position_row * 8 + position_col;
                var targetNum = _selected_items_drag[i].row * 8 + _selected_items_drag[i].col;
                if ((srcNum < NUMOF_PATCH) && (targetNum < NUMOF_PATCH)) {
                    $es.container.patch[targetNum] = JSON.parse(JSON.stringify($es.container.patch[srcNum]));
                    $es.container.patch[srcNum] = JSON.parse(JSON.stringify(_selected_items_drag[i].value));
                    $es.midi.exchangePatch(targetNum, srcNum);
                }
            }
            update_table();
        } else {
            ErrorDialog('COPY_EMPTY');
        }
    }

    function Paste(mode) {
        $es.dialog.openAutoClose('#dialog_working', 300, function(){
            var position_row;
            var position_col;
            var selected_cell;


            if ($('#librarian_table').find('.' + _selected_class).length <= 0) {
                WarningDialog('NOT_SELECTED_CELL');
                return;
            } else if ($('#librarian_table').find('.' + _selected_class).length > 1) {
                WarningDialog('SELECTED_MULTI_CELL');
                return;
            } else {
                selected_cell = $('#librarian_table').find('.' + _selected_class).eq(0);
                position_col = $(selected_cell).index() - 1;
                position_row = $(selected_cell).closest('tr').index();
            }

            if (mode === 'Replace') {
                if (_selected_items.length > 0) {
                    var selPush = [];
                    var pushNum = [];
                    for (var i = 0; i < _selected_items.length; i++) {
                        var num = position_row * 8 + position_col + i;
                        if (num < NUMOF_PATCH) {
                            $es.container.patch[num] = JSON.parse(JSON.stringify(_selected_items[i].value));
                            pushNum.push(num + 1);
                            selPush.push(function(){return $es.pushOne(pushNum.shift())});
                        }
                    }
                    selPush.push(function(){
                        return new Promise(function(resolve, reject) {
                            update_table();
                            $es.dialog.closeWait();
                            resolve();
                        });
                    });
                    $es.dialog.openWait(selPush.length, MSG('IDM_NOW_WRITING'));
                    selPush.reduce(function (prev, curr, index, array) {
                        return prev.then(curr);
                    }, Promise.resolve());
                } else {
                    ErrorDialog('COPY_EMPTY');
                }
            } else if (mode === 'Insert') {
                // not supported this function
                ErrorDialog('ERROR_NOT_SUPPORTED');
            }
        });

    }

    function nameEdit(currentEle, value) {
        var row = $(currentEle).closest('tr').index();
        var col = $(currentEle).index() - 1;
        var val;
        function saveName(val) {
            // Save value to model
            var targetNum = row * 8 + col;
            $es.container.patch[targetNum].ID_PATCH_NAME = ConvertToCode(val);
            $(currentEle).html(DisplayString($es.container.patch[targetNum].ID_PATCH_NAME));
            $es.midi.setPatchName(targetNum, val);
        }

        $(currentEle).html('<input class="editVal" type="text" value="' + value + '" maxlength="16">');
        $('.editVal').focus();
        $('.editVal').select();
        $('.editVal').keyup(function (event) {
            val = String($(this).val()).trim();
            val = val.split("\\").join('');
            
            if (event.keyCode < 32 || event.keyCode > 126) {
                // limit in ASCII CODE 0x20 – 0x7e
                if (event.keyCode === 13 || event.keyCode === 27) { // User pressed Enter on keyboard
                    saveName(val);
                } else {
                    return;
                }
            }
        });
        $('.editVal').on('change', function (e) {
            val = String($(this).val()).trim();
            val = val.split("\\").join('');

            saveName(val);
        });

        $('.editVal').focusout(function (e) {
            val = String($(this).val()).trim();
            val = val.split("\\").join('');
//            $(currentEle).html(val);
            saveName(val);
        });
        $('.editVal').dblclick(function(e){
            e.preventDefault();
            e.stopPropagation();
        });
    }

    var c = {};
    var _isCancelDrop = false;
    
    function initDD() {
        
        $("#librarian_table td:not(:first-child)").draggable({
            containment: "#librarian_table",
            opacity: 0.8,
            helper:function(event) {
                if (_selected_items_drag.length > 1) {
                    var obj = '<div class="librarian-draggable-contents">';
                    var max = (_selected_items_drag.length > 8) ? 8 : _selected_items_drag.length;
                    var top = max * 2;
                    var left = max * 2;

                    for (i = max - 1; i >= 0; i--) {
                        var target = _selected_items_drag[i].value;
                        var name = DisplayString(target.ID_PATCH_NAME);
                        obj += '<div class="librarian-draggable-content_one" style="opacity:1; top:' + top + '; left:' + left + '">' + name + '</div>';
                        top -= 2;
                        left -= 2;
                    }
                    obj += '</div>';
                    return obj;
                } else {
                    return $(event.target).clone().css({
                        width: $(event.target).width() + 4
                    });
                }
            },
            start: function (event, ui) {
                copy_drag();
                c.td = this;
                c.helper = ui.helper;
                _isDrag = true;
            },
            stop: function( event, ui ) {
                _isDrag = false;
            }
        });

        $("#librarian_table td:not(:first-child)").droppable({
            hoverClass: 'selected-hover',
            tolerance: "pointer",
            accept: "#librarian_table td:not(:first-child)",
            drop: function (event, ui) {
                if (_isCancelDrop) {
                    _isCancelDrop = false;
                } else {
                    var ttt = this;
                    function exec() {
                        $(c.helper).remove();
                        _isDrag = false;
                        exchange($(ttt).closest('tr').index(), $(ttt).index() - 1);
                    }
                    $es.dialog.openAutoClose('#dialog_working', 300, exec);
                }

            }
        });
    }

    function update_table() {
        
        var tbl = '<table id="librarian_table" class="hover cell-border"><thead><tr>\n\
                        <th style="min-width: 34px; width: 34px;">BANK</th>\n\
                        <th style="min-width: 103px; width: 103px;">NUM1</th>\n\
                        <th style="min-width: 103px; width: 103px;">NUM2</th>\n\
                        <th style="min-width: 103px; width: 103px;">NUM3</th>\n\
                        <th style="min-width: 103px; width: 103px;">NUM4</th>\n\
                        <th style="min-width: 103px; width: 103px;">NUM5</th>\n\
                        <th style="min-width: 103px; width: 103px;">NUM6</th>\n\
                        <th style="min-width: 103px; width: 103px;">NUM7</th>\n\
                        <th style="min-width: 103px; width: 103px;">NUM8</th>\n\
                        </tr></thead><tbody></tbody></table>';
        $("#LIBRARIAN_BASE").html(tbl);
        var st = '';
        var bank = '';
        for (var i = 0; i < 100; i++) {
            st += '<tr>';
            if (i < 10) {
                bank = '0' + i;
            } else {
                bank = '' + i;
            }
            st += '<td>' + bank + '</td>';
            for (var j = 0; j < 8; j++) {
                st += '<td>';
                st += DisplayString($es.container.patch[i * 8 + j].ID_PATCH_NAME);
                st += '</td>';
            }
            st += '</tr>';
        }

        $('#librarian_table tbody').append(st);
        $('td:not(:first-child)').rightClick({menu: '#context-menu'});
        _tableRows = $('#librarian_table tbody').find('tr');
        initDD();
    }


    function librarian() {};
    librarian.prototype = {
        init : function() {
        //  for splus librarian
            $('#layout-wrapper').append($('<div id="context-menu"></div>'));
            $('#context-menu').append($('<ui class="context-menu-tems"></ui>'));
            $('#context-menu ui').append('<li class-"context-menu-tem"><a href="#" class="context-menu-link" data-action="Copy"><i class="fa fa-eye"></i> Copy</a></li>');
            $('#context-menu ui').append('<li class-"context-menu-tem"><a href="#" class="context-menu-link" data-action="Replace"><i class="fa fa-edit"></i> Paste </a></li>');
//            $('#context-menu ui').append('<li class-"context-menu-tem"><a href="#" class="context-menu-link" data-action="Insert"><i class="fa fa-times"></i> Paste (Insert) </a></li>');
            $('#context-menu ui').append('<li class-"context-menu-tem"><a href="#" class="context-menu-link" data-action="Name"><i class="fa fa-times"></i> Name</a></li>');
            $('#context-menu ui').append('<li class-"context-menu-tem"><a href="#" class="context-menu-link" data-action="Export"><i class="fa fa-times"></i> Export</a></li>');

            update_table();
        },
        update : function() {
            update_table();
        }
    };
    $es.librarian = new librarian();
    
});