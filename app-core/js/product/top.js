$(function(){
     function EditPatchName(ev) {
        function  hexFormat(value) {
            return "0x" + hex2(value);
        }
        function ConvertToCode(value) {
            var str = [];
            var i;
            for (i = 0; i < value.length; i++) {
                str.push(hexFormat(value[i].charCodeAt(0)));
            }
            for (; i < 16; i++) {
                str.push(hexFormat(' '.charCodeAt(0)));
            }
            return str;
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
        var val;
        var e = ev.currentTarget;
        var value = DisplayString($es.work.patch.ID_PATCH_NAME);
        $(e).html('<input class="editValTop" type="text" value="' + value + '" maxlength="16">');
        $('.editValTop').focus();
        $('.editValTop').select();
        $('.editValTop').keyup(function (event) {
            val = String($(this).val()).trim();
            val = val.split("\\").join('');
            
            if (event.keyCode < 32 || event.keyCode > 126) {
                // limit in ASCII CODE 0x20 – 0x7e
                if (event.keyCode === 13 || event.keyCode === 27) { // User pressed Enter on keyboard
                    $(e).html('<p>' + val + '</p>');
                    // Save value to model
                    $es.work.patch.ID_PATCH_NAME = ConvertToCode(val);
                } else {
                    return;
                }
            }
        });
        $('.editValTop').on('change', function (e) {
            val = String($(this).val()).trim();
            val = val.split("\\").join('');
            // Save value to model
            $es.work.patch.ID_PATCH_NAME = ConvertToCode(val);

        });

        $('.editValTop').focusout(function (ev) {
            val = String($(this).val()).trim();
            val = val.split("\\").join('');
            var ei = ev.currentTarget;
            var e = ei.parentElement;
            $(e).html('<p>' + val + '</p>');
            // Save value to model
            $es.work.patch.ID_PATCH_NAME = ConvertToCode(val);

        });
        $('.editValTop').dblclick(function(e){
            e.preventDefault();
            e.stopPropagation();
        });
    }

    $('#ID_TEMP_CURRENT_NUM').on('es-changed', function (e, v) {
        var sel = $('#' + this.id);
        if (v == undefined) {
            sel.trigger('es-changed', $es.work.target);
        } else {
            if ($es.work.target != v) {
                if ($es.dialog.isOpened() == false) {
                    $es.patchChange(v, false);
                } else {
                    setTimeout(function(){
                        sel.trigger('es-changed', v); // retrigger !!
                    }, 0);
                }
            } else {
                var bank = parseInt(v / 8);
                var idx = v % 8;
                sel.empty();
                sel.append($('<p></p>', {text: ("00" + bank).substr(-2)+'.'+ (idx + 1)}));
                $('#spinnerBank').trigger('elf-change', [bank, true]);
            }
        }
    });
    for (var i = 0; i < 16; i++) {
        $('#ID_PATCH_NAME-' + i).on('es-changed', function (e,v) {
            var sel = $('#' + this.id);
            sel.hide();
            $('#ID_PATCH_NAME').trigger('es-changed', 0);
        });
    }
    $('#ID_PATCH_NAME').on('es-changed', function(e,v){
        var sel = $('#' + this.id);
        sel.empty();
        sel.append($('<p></p>', {align: "left", text: byte2String($es.work.patch.ID_PATCH_NAME) }));
    });
    $('#ID_PATCH_NAME').on('click', function(e,v){
        EditPatchName(e);
    })
    var loopList = [
        "#ID_TEMP_CURRENT_NUM",
        '#ID_SYSTEM_PREFERENCE_LOOP7_RETURN_MODE',
        '#ID_SYSTEM_PREFERENCE_LOOP8_RETURN_MODE',
        '#ID_PATCH_OUTPUT_SELECT'
    ].join();

    $(loopList).on('elf-changed', function(e,v){
        $es.loopStructure.update();
    });

    setInterval(function(){
        function ctrlButton(id, compare) {
            var obj = $(id);
            if (compare) {
                obj.prop("disabled", false);
                obj.css('cursor', 'pointer');
                obj.css('opacity', '1');
            } else {
                obj.prop("disabled", true);
                obj.css('cursor', 'not-allowed');
                obj.css('opacity', '0.2');
            }
        }
        ctrlButton('#bWrite', $es.midi.isConnect() && $es.isChangePatch());
        ctrlButton('#bPull', $es.midi.isConnect());
        // ctrlButton('#bPush', $es.midi.isConnect());
    }, 300);
});
