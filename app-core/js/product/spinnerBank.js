
$(function () {
    function make(idx, num) {

        var idxStr = idx + 1;
        var sel = $('#bListNum' + idxStr); 
        var patchNum = num * 8 + idx;
        var cur = $es.work.target;
        if (cur == patchNum) {
            sel.css('background-color', '#5b8495');
        } else {
            sel.css('background-color', '');
        }
        sel.empty();
        sel.append($('<p></p>', {align: "left", text: byte2String($es.container.patch[patchNum].ID_PATCH_NAME) }));
        $('#sListNum' + idxStr).trigger('elf-update', num);
    }
    function loadN(idx) {
        var item = _items[$('#spinnerBank').attr('id')];
        var num = item.val;
        $es.loadPatch(num * 8 + idx, true);
    }

    for (var i = 0 ; i < 8; i++) {
        $('#bListNum' + (i + 1)).on('click', function(e) {
            var idx = parseInt(this.id.replace(/[^0-9^\.]/g, "")) - 1;
            $es.dialog.openAutoClose('#dialog_working', 300, function(){loadN(idx);});
        });
    }

    /* on elf-changed event */
    $('#spinnerBank').on('elf-changed', function (e, v) {
        if (v == undefined) {
            v = parseInt($es.work.target / 8);
        }
        for (var i = 0; i < 8; i++) {
            make(i, v);
        }
        if ($es.midi.isConnect()) {
            $es.bank.set(v);
        }
    });
});
