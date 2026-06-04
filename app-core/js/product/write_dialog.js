$(function () {
    var _selected_class = 'selected';


    function goFunc(item) {
        $es.work.save = item;
    }

    $('#bDialogWriteExecute').on('click', function(e,v){
        (function () {
            $es.work.system.ID_SYSTEM_CURRENT_NUM = $es.work.save;
            $es.saveSystem();
            $es.savePatch($es.work.save);
            return $es.push(0, 0, false, MSG('IDM_NOW_WRITING'));
        })()
        .then(function (e) {
            return $es.push($es.work.save + 1, $es.work.save + 1, false, MSG('IDM_NOW_WRITING'));
        })
        .then(function (e) {
            $es.midi.patchChangeRequest($es.work.save);
            $es.loadPatch($es.work.save, true);
            var popup = $('#dialog_write').closest('.page-popup-style');
            popup.hide().unwrap().appendTo('#layout-wrapper');
        })
        .catch(function (e) {
            var popup = $('#dialog_write').closest('.page-popup-style');
            popup.hide().unwrap().appendTo('#layout-wrapper');
        });
    });

    $('#bWrite').on('click', function(e,v){
        $es.patchTable.make($('#dialog_write'), goFunc);
        $("#pc_select_table tr td").removeClass(_selected_class);

        $es.work.save = $es.work.target;
        var row = parseInt($es.work.save / 8) + 1;
        var col = $es.work.save % 8 + 1;
        var obj = $('#pc_select_table tr').get(row)
        obj = $(obj).children('td').get(col);
        $(obj).addClass(_selected_class);

        setTimeout(function(){
            var tbl = $('#dialog_write').find('.item-frame-style');
            var sel = $(tbl).find('.selected');
            var o = $(sel).offset();
            $(tbl).scrollTop(o.top - $(tbl).offset().top);
        }, 0);

    });


});

