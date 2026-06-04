$(function () {
    var list = [
        'pCtlExpUpperMemoryManual',
        'pCtlExpUpperMute',
        'pCtlExpUpperBankD',
        'pCtlExpUpperBankU',
        'pCtlExpLowerNum1',
        'pCtlExpLowerNum2',
        'pCtlExpLowerNum3',
        'pCtlExpLowerNum4',
        'pCtlExpLowerNum5',
        'pCtlExpLowerNum6',
        'pCtlExpUpperNum7',
        'pCtlExpUpperNum8',
        'pCtlExpCtl1',
        'pCtlExpCtl2',
        'pCtlExpCtl3',
        'pCtlExpCtl4',
        'pCtlExpExp1',
        'pCtlExpExp2',
    ];
    var listPatch = $.map(list, function(n,i){
        return n + 'Patch';
    });
    var listSystem = $.map(list, function(n,i){
        return n + 'System';
    });
    
    var divListPatch = $.map(listPatch, function(n, i){
        return '#' + n;
    }).join();
    var divListSystem = $.map(listSystem, function(n, i){
        return '#' + n;
    }).join();

    $('[id^="ID_SYSTEM_CTL_SW-"],[id^="ID_SYSTEM_EXP_SW-"]').on('elf-changed', function(e, v){
        var arr = this.id.match(/[A-Z_]+_(CTL|EXP)_SW+-([0-9]+)/);
        var index = parseInt(arr[2]) + ((arr[1] == 'EXP') ? 16 : 0);

        setTimeout(function(index){
            $('#' + listPatch[index] + ',#' + listSystem[index]).trigger('elf-changed');
        }, 0, index);
    });
    $(divListPatch).on('elf-changed', function(e,v) {
        var arr = this.id.match(/pCtlExp(Ctl|Exp)[0-9]+/);
        var offset = 0;
        var swId = 'ID_SYSTEM_CTL_SW';
        if (arr) {
            if (arr[1] == 'Exp') {
                offset = 16;
                swId = 'ID_SYSTEM_EXP_SW';
            }
        }
        var listN = parseInt($.inArray(this.id, listPatch)) - offset;
        if ($es.getParamValue(swId, listN)) {
            $('#' + this.id).hide();
        } else {
            $('#' + this.id).show();
        }
    });
    $(divListSystem).on('elf-changed', function(e,v) {
        var arr = this.id.match(/pCtlExp(Ctl|Exp)[0-9]+/);
        var offset = 0;
        var swId = 'ID_SYSTEM_CTL_SW';
        if (arr) {
            if (arr[1] == 'Exp') {
                offset = 16;
                swId = 'ID_SYSTEM_EXP_SW';
            }
        }
        var listN = parseInt($.inArray(this.id, listSystem)) - offset;
        if ($es.getParamValue(swId, listN)) {
            $('#' + this.id).show();
        } else {
            $('#' + this.id).hide();
        }
    });
});
