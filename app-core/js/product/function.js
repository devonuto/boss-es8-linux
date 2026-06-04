
$(function () {
    const PATCH = 0;
    const SYSTEM = 1;
    const PCMAP = 2;
    const LIBRARIAN = 3;
    const OPTION = 4;

    var typeList = [
        /* PATCH    */ ['#CONTENTS_EDITOR', '#LIST_BANK', '#LIST_NUM', '#fTop'],
        /* SYSTEM    */ ['#CONTENTS_EDITOR', '#LIST_BANK', '#LIST_NUM', '#fTop'],
        /* PCMAP     */ ['#CONTENTS_EDITOR', '#LIST_BANK', '#LIST_NUM'],
        /* LIBRARIAN */ ['#LIST_BANK_BLANK', '#LIST_NUM_BLANK'],
        /* OPTION    */ ['#LIST_BANK_BLANK', '#LIST_NUM_BLANK']
    ];
    var functionList = [
        { text: 'Patch',        id: '#PATCH',           type: PATCH,},
        { text: 'PlayOption',   id: '#PLAY_OPTION',     type: SYSTEM },
        { text: 'Preference',   id: '#PREFERENCE',      type: SYSTEM },
        { text: 'MidiOthers',   id: '#MIDI_SETTING',    type: SYSTEM },
        { text: 'PcMap',        id: '#PC_MAP',          type: PCMAP },
        { text: 'Librarian',    id: '#LIBRARIAN',       type: LIBRARIAN },
        { text: 'Option',       id: '#OPTION',          type: OPTION },
    ];

    var func = $.map(functionList, function(n, i){
        return '#lFunction' + n.text;
    }).join();

    $(func).on('click', function(e) {
        (function(obj) {
            var key = obj.id.match(/lFunction([A-z0-9]+)/)[1];
            var lastIndex = -1;

            $es.pcMap.unmake();
            $.each(typeList, function(i, id){
                $.each(id, function(ii, iid){
                    $(iid).hide();
                })
            });
            $.each(functionList, function(i, f){
                var obj = $('#lFunction' + f.text).children('p'); 
                if (obj.hasClass('selected-function')){
                    lastIndex = i;
                }
                obj.removeClass('selected-function');
                $(f.id).hide();
            });
            $(obj).children('p').addClass('selected-function');

            var n = $.grep(functionList, function(e){
                return e.text == key;
            })[0];
            function updateLastFunction(n) {
                    if (lastIndex >= 0) {
                        switch (functionList[lastIndex].type) {
                            case LIBRARIAN:
                                $('#spinnerBank').trigger('elf-changed');
                                break;
                            case SYSTEM:
                            case PCMAP:
                                if ((n.type != SYSTEM) && (n.type != PCMAP)) {
                                    if ($es.isChangeSystem()) {
                                        $es.saveSystem();
                                        $es.push(0, 0, false);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
            };
            switch (n.type) {
                case PCMAP:
                    $es.pcMap.make();
                    break;
                case LIBRARIAN:
                    (function() {
                        return $es.pullNameList(0, NUMOF_PATCH, false);
                    })()
                    .then(function (e) {
                        $es.librarian.update();
                        updateLastFunction(n);
                    })
                    .catch(function(e){
                        $es.librarian.update();
                        updateLastFunction(n);
                    });
                    break;
                default:
                    updateLastFunction(n);
                    break;
            }
            $(n.id).show();
            $.each(typeList[n.type], function(i, id) {
                $(id).show();
            });
        })(this);
    });

    function functionPanel() {}
    functionPanel.prototype = {
        init: function() {
            $('#lFunctionPatch').trigger('click');
        },
    }
    $es.functionPanel = new functionPanel();
});
