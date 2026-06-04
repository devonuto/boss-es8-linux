$(function(){
    var _selected_class = 'selected';
    var _selectFunc;

    function patchTable() {};
    patchTable.prototype = {
        make: function (obj, selectFunc) {
            var tbl = '<table id="pc_select_table"><thead><tr>\n\
                            <th style="width: 4%">BANK</th>\n\
                            <th style="width: 12%">NUM1</th>\n\
                            <th style="width: 12%">NUM2</th>\n\
                            <th style="width: 12%">NUM3</th>\n\
                            <th style="width: 12%">NUM4</th>\n\
                            <th style="width: 12%">NUM5</th>\n\
                            <th style="width: 12%">NUM6</th>\n\
                            <th style="width: 12%">NUM7</th>\n\
                            <th style="width: 12%">NUM8</th>\n\
                            </tr></thead><tbody></tbody></table>';
            $(obj).children('.item-frame-style').empty().append(tbl);
            var st = '';
            var bank = '';
            for (var i = 0; i < NUMOF_PATCH / 8; i++) {
                st += '<tr>';
                if (i < 10) {
                    bank = '0' + i;
                } else {
                    bank = '' + i;
                }
                st += '<td>' + bank + '</td>';
                for (var j = 0; j < 8; j++) {
                    st += '<td>';
                    st += byte2String($es.container.patch[i * 8 + j].ID_PATCH_NAME);
                    st += '</td>';
                }
                st += '</tr>';
            }

            $('#pc_select_table tbody').append(st);
            _selectFunc = selectFunc;
        }
    };
    $es.patchTable = new patchTable();

    $(document).on('mousedown', '#pc_select_table td:not(:first-child)', function(e,v){
        $("#pc_select_table tr td").removeClass(_selected_class);
        $(this).addClass(_selected_class);

        $("#pc_select_table tbody td:not(:first-child)").each(function () {
            if ($(this).hasClass(_selected_class)) {
                var item = $(this).closest('tr').index() * 8 + ($(this).index() - 1);
                _selectFunc(item);
            }
        });

    });


    function goFunc(item) {
        function loadN(item) {
            $es.loadPatch(item, true);
            var popup = $('#dialog_pc').closest('.page-popup-style');
            popup.hide().unwrap().appendTo('#layout-wrapper');
        }

        $es.dialog.openAutoClose('#dialog_working', 300, function(){loadN(item);});
    }

    $('#ID_TEMP_CURRENT_NUM').on('click', function(e,v){
        $es.patchTable.make($('#dialog_pc'), goFunc);
        $("#pc_select_table tr td").removeClass(_selected_class);

        var row = parseInt($es.work.target / 8) + 1;
        var col = $es.work.target % 8 + 1;
        var obj = $('#pc_select_table tr').get(row)
        obj = $(obj).children('td').get(col);
        $(obj).addClass(_selected_class);

        setTimeout(function(){
            var tbl = $('#dialog_pc').find('.item-frame-style');
            var sel = $(tbl).find('.selected');
            var o = $(sel).offset();
            $(tbl).scrollTop(o.top - $(tbl).offset().top);
        }, 0);
    });
    

});
