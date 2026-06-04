$(function () {
    const oneWidth = 46;
    const oneOffset = 6;
    const oneInterval = oneWidth - oneOffset;
    const loopBoxW = 26;
    const lowerTop = 45;

    // var _work_patch = $es.work.patch;
    var _node_selected;
    var _html = '';
    // _html += '<div class="container">';
    // _html += '<div id="line"></div>';
    // _html += '<div id="loop"></div>';
    // _html += '<div id="list-node"></div>';
    // _html += '</div>';
    // $('#Loop_Structure').html(_html);

    var output_select = $es.work.patch.ID_PATCH_OUTPUT_SELECT;
    var node7 = $es.work.system.ID_SYSTEM_PREFERENCE_LOOP7_RETURN_MODE;
    var node8 = $es.work.system.ID_SYSTEM_PREFERENCE_LOOP8_RETURN_MODE;
    var _arr_position = '';

    // Get initial value
    // getLoopPosition();
    // update_loopStructure();

    function isInBracket(str, node) {
        var result = false;
        var i = str.indexOf(node);
        while (i < str.indexOf('$') && !result) {
            if (str[i] === '(' || str[i] === '[') {
                break;
            }
            if (str[i] === ']' || str[i] === ')') {
                result = true;
            }
            i++;
        }
        return result;
    }

    function isRectangleBeforeBracket(str, node) {
        var result = false;
        var i;
        if (node === 'root') {
            i = 0;
        } else {
            i = str.indexOf(node);
        }

        while (i < str.indexOf('$') && !result) {
            if ((str[i + 1] === '8') && (node8 > 0)) {
                break;
            }
            if (str[i] === ']' || str[i] === ')' || str[i] === '(' || str[i] === '[') {
                result = true;
            }
            i++;
        }
        return result;
    }

    function setLoopPosition() {
        if (_arr_position.length === 22) {
            $es.setLoopStructureByStr(_arr_position);
        } else {
            ErrorDialog('ERROR_UNKNOWN');
        }
    }

    function getLoopPosition() {
        output_select = $es.work.patch.ID_PATCH_OUTPUT_SELECT;
        node7 = $es.work.system.ID_SYSTEM_PREFERENCE_LOOP7_RETURN_MODE;
        node8 = $es.work.system.ID_SYSTEM_PREFERENCE_LOOP8_RETURN_MODE;
        _arr_position = $es.getLoopStructureStr();
    }

    function getIndex(value) {
        return prmstr.ID_PATCH_LOOP_POSITION_IDX.indexOf(value);
    }

    function getState_SW(value) {
        var index = getIndex(value);
        if (index !== -1) {
            return $es.work.patch.ID_PATCH_LOOP_SW_LOOP[index];
        } else {
            return index;
        }
    }

    function setState_SW(key, value) {
        var index = getIndex(key);
        if (index !== -1) {
            $es.work.patch.ID_PATCH_LOOP_SW_LOOP[index] = value;
        } else {
            ErrorDialog('ERROR_KEY_NOT_FOUND');
        }

    }

    function getState_CarryOver(value) {
        var index = getIndex(value);
        if (index !== -1) {
            return $es.work.patch.ID_PATCH_CARRY_OVER_LOOP[index];
        } else {
            return index;
        }
    }

    function setState_CarryOver(key, value) {
        var index = getIndex(key);
        if (index !== -1) {
            $es.work.patch.ID_PATCH_CARRY_OVER_LOOP[index] = value;
        } else {
            ErrorDialog('ERROR_KEY_NOT_FOUND');
        }

    }

    function isNode8Out(str, node) {
        var result = false;
        var index = str.indexOf('8');
        if (node === '8' && str[index - 1] === ']') {
            result = true;
        }
        return result;
    }

    function isNode8InMix(str, node) {
        var result = false;
        var index = str.indexOf('8');
        var indexNode = str.indexOf(node);
        if (str[index - 1] === '(' && indexNode < index) {
            result = true;
        }
        return result;
    }

    function isAfterBracket(str, node) {
        var result = false;
        var index = str.indexOf(node);
        if (str[index - 1] === ']' || str[index - 1] === ')') {
            result = true;
        }
        return result;
    }

    function isBeforeEnd(str, node) {
        var result = false;
        if (str[str.indexOf(node) + 1] === '$') {
            result = true;
        }
        return result;
    }

    function countMixer(posStr) {
        var mixCount = 0;
        var end = posStr.indexOf('$');
        var m1 = -1;
        for (i = 0; i < 2; i++) {
            m1 = posStr.indexOf('(', m1 + 1);
            if ((m1 >= 0) && (m1 < end)){
                var m2 = posStr.indexOf(')', m1);
                var sep = posStr.indexOf('|', m1);
                if (((node7 > 0) && (node8 > 0) &&  ((posStr[m2 + 1] == '8') && ((posStr[m2 - 1] == '7') || (posStr[sep - 1] == '7')))) ||
                    ((node8 > 0) && ((posStr[m2 + 1] == '$') && ((posStr[m2 - 1] == '8') || (posStr[sep - 1] == '8')))) ||
                    ((node7 > 0) && ((posStr[m2 + 1] == '$') && ((posStr[m2 - 1] == '7') || (posStr[sep - 1] == '7'))))
                   ) {
                    mixCount ++;
                }
                mixCount ++;
            }
        }
        return mixCount;
    }

    function checkMixer(req) {
        var mixCount = 0;
        for (i = 0; i < prmstr.ID_PATCH_LOOP_POSITION_IDX.length; i++) {
            var v = prmstr.ID_PATCH_LOOP_POSITION_IDX[i];
            var m = (((v == '7') && (node7 > 0)) || ((v == '8') && (node8 > 0))) ? 2 : 1;
            mixCount += (getState_CarryOver(v) * m);
        }
        mixCount += countMixer(_arr_position);
        return ((2 - mixCount) >= req);
    }

    $(document).on('click', '.node', function (e) {
        var value = $(this).attr('data-action');
        var menuItem;
        $('.menu-item').each(function (e) {
            menuItem = $(this).attr('data-action');
            if (_arr_position.indexOf('[:]') < 0 || isInBracket(_arr_position, value)
                    || isRectangleBeforeBracket(_arr_position, value)
                    || isMixEnd(_arr_position, '8', node8)
                    || isNode8InMix(_arr_position, value)
//                    || isBeforeEnd(_arr_position, value)
                    ) {
                if (menuItem === '2') {
                    $(this).switchClass('menu-item', 'menu-item-disable', 1);
                }
            }
            if (_arr_position.indexOf('(|)') < 0 || isInBracket(_arr_position, value)
                    || isMixEnd(_arr_position, '7', node7)
                    || isMixEnd(_arr_position, '8', node8)
                    || isNode8Out(_arr_position, value)
                    || isMix7(_arr_position)
                    || value === 'root') {
                if (menuItem === '1') {
                    $(this).switchClass('menu-item', 'menu-item-disable', 1);
                }
            }
        });
        $('.menu-item-disable').each(function (e) {
            menuItem = $(this).attr('data-action');
            if (_arr_position.indexOf('[:]') < 0 || isInBracket(_arr_position, value)
                    || isRectangleBeforeBracket(_arr_position, value)
                    || isMixEnd(_arr_position, '8', node8)
                    || isNode8InMix(_arr_position, value)
                    || isBeforeEnd(_arr_position, value)) {
            } else {
                if (menuItem === '2') {
                    $(this).switchClass('menu-item-disable', 'menu-item', 1);
                }
            }
            if (_arr_position.indexOf('(|)') < 0 || isInBracket(_arr_position, value)
                    || isMixEnd(_arr_position, '7', node7)
                    || isMixEnd(_arr_position, '8', node8)
                    || isNode8Out(_arr_position, value)
                    || isMix7(_arr_position)
                    || value === 'root') {
            } else {
                if (menuItem === '1') {
                    $(this).switchClass('menu-item-disable', 'menu-item', 1);
                }
            }
        });
        var pageX;
        pageX = e.pageX > 792 ? e.pageX - oneWidth : e.pageX;
        $('#select-menu').css({
            top: e.pageY + 'px',
            left: pageX + 'px',
            cursor: "default"
        }).show().click(function () {
            $('#select-menu').hide();
        });
        _node_selected = $(this);
    });

    $(":not(.node)").click(function () {
        $('#select-menu').hide();
    });

    $(document).on('click', '.circle', function (e) {
        if (getState_SW($(this).parent().attr('data-action')) === 0) {
            setState_SW($(this).parent().attr('data-action'), 1);
            $(this).removeClass('disable');
        } else {
            setState_SW($(this).parent().attr('data-action'), 0);
            $(this).addClass('disable');
        }

    });

    $(document).on('click', '.rectangle', function (e) {
        var pos = $(this).parent().attr('data-action');
        if (getState_CarryOver(pos) === 0) {
            var req = (((pos == '7') && (node7 > 0)) || ((pos == '8') && (node8 > 0))) ? 2 : 1;
            if (checkMixer(req)) {
                setState_CarryOver(pos, 1);
                $(this).removeClass('disable');
            } else {
                WarningDialog('WARNING_NO_MORE_MIXER');
            }
        } else {
            setState_CarryOver(pos, 0);
            $(this).addClass('disable');
        }
    });

    $(document).on('click', '.delete_separate', function (e) {
        _arr_position = delete_separate(_arr_position, $(this).attr('data-action'));
        update_loopStructure();
    });

    $(document).on('click', '.delete_mix', function (e) {
        _arr_position = delete_mix(_arr_position, $(this).attr('data-action'));
        update_loopStructure();
    });

    function mix_node(node) {
        var result = '';
        var isEnd = false;
        var isDelete = true;
        if (!isInBracket(_arr_position, node)) {
            if (_arr_position.length === 22) {
                if (_arr_position.indexOf(node) >= 0) {
                    if (_arr_position.indexOf('(|)') >= 0) {
                        for (var i = 0; i < _arr_position.length; i++) {
                            if (_arr_position[i] === node) {
                                result += '(' + _arr_position[i] + '|)';
                            } else {
                                if (_arr_position[i] === '$') {
                                    isEnd = true;
                                    result += _arr_position[i];
                                }
                                if (isEnd) {
                                    if (isDelete) {
                                        if ('[:]'.indexOf(_arr_position[i]) >= 0) {
                                            result += _arr_position[i];
                                        }
                                        if (_arr_position[i] === ')') {
                                            isDelete = false;
                                        }
                                    } else {
                                        result += _arr_position[i];
                                    }
                                } else {
                                    result += _arr_position[i];
                                }

                            }
                        }
                    } else {
                        WarningDialog('WARNING_CANNOT_MIX_VALUE');
                        result = _arr_position;
                    }

                } else {
                    WarningDialog('WARNING_NOT_EXIST_VALUE');
                    result = _arr_position;
                }
            } else {
                WarningDialog('WARNING_LENGTH_OF_POSITION_INCORRECT');
                result = _arr_position;
            }
        } else {
            WarningDialog('WARNING_CIRCLE');
            result = _arr_position;
        }

        return result;
    }
    function checkSeparate(result) {
        // check: ］の後ろに8もしくは＄が無い場合は、[:]をクリアする
        var indexSeparate = result.indexOf(']');
        if (indexSeparate !== -1) {
            if (indexSeparate < result.indexOf('$')) {
                if (!(((indexSeparate + 1) == result.indexOf('$')) || (((indexSeparate + 1) == result.indexOf('8')) && (node8 > 0)))) {
                    result = deleteSeparateCore(result, result.indexOf('['));
                }
            }
        }
        return result;
    }

    function separate(node) {
        var result = '';
        var isEnd = false;
        var isDelete = true;
        var indexNode;
        var isAfternode = false;
        if (!isInBracket(_arr_position, node) && !isRectangleBeforeBracket(_arr_position, node)) {
            if (_arr_position.length === 22) {
                if (node === 'root') {
                    indexNode = 0;
                    result += '[';
                } else {
                    indexNode = _arr_position.indexOf(node);
                }
                if (indexNode >= 0) {
                    if (_arr_position.indexOf('[:]') >= 0) {
                        if (node8 > 0) {
                            if (indexNode >= _arr_position.indexOf('8')) { 
                                isAfternode = true;
                            }
                        } else {
                            isAfternode = true;
                        }

                        for (var i = 0; i < _arr_position.length; i++) {
                            if (_arr_position[i] === node) {
                                result += _arr_position[i] + '[';
                            } else {
                                if (_arr_position[i] === '$') {
                                    isEnd = true;
                                    if (isAfternode) {
                                        result += ':]' + _arr_position[i];
                                    } else {
                                        result += _arr_position[i];
                                    }

                                }
                                if (isEnd) {
                                    if (isDelete) {
                                        if ('(|)'.indexOf(_arr_position[i]) >= 0) {
                                            result += _arr_position[i];
                                        }
                                        if (_arr_position[i] === ']') {
                                            isDelete = false;
                                        }
                                    } else {
                                        result += _arr_position[i];
                                    }
                                } else {
                                    if (!isAfternode) {
                                        if ((_arr_position[i] === '8') && (node8 > 0)) {
                                            result += ':]' + _arr_position[i];

                                        } else {
                                            result += _arr_position[i];
                                        }
                                    } else {
                                        result += _arr_position[i];
                                    }

                                }

                            }
                        }
                    } else {
                        WarningDialog('WARNING_SEPARATE');
                        result = _arr_position;
                    }

                } else {
                    ErrorDialog('ERROR_UNKNOWN');
                    result = _arr_position;
                }
            } else {
                WarningDialog('WARNING_LENGTH_OF_POSITION_INCORRECT');
                result = _arr_position;
            }
        } else {
            WarningDialog('WARNING_CIRCLE');
            result = _arr_position;
        }

        result = checkSeparate(result);

        return result;
    }

    function deleteSeparateCore(str, index) {
        var isNotDoneDelete = true;
        var result = '';
        for (var i = 0; i < index; i++) {
            result += str[i];
        }
        for (var i = index; i < str.length; i++) {
            if (isNotDoneDelete) {
                if ('[:]'.indexOf(str[i]) >= 0) {

                } else {
                    result += str[i];
                }
                if (str[i] === ']') {
                    isNotDoneDelete = false;
                }
            } else {
                result += str[i];
            }
        }
        return result + '[:]';
    }
    function delete_separate(str, node) {
        var index;
        if (node === 'root') {
            index = 0;
        } else {
            index = str.indexOf(node);
        }
        return deleteSeparateCore(str, index);
    }

    /*
     * Delete mix when user click on node have mix
     * @param {string} str
     * @param {char} node
     * @returns {String}
     */
    function delete_mix(str, node) {
        var index;
        if (node === 'root') {
            index = 0;
        } else {
            index = str.indexOf(node);
        }
        var isNotDoneDelete = true;
        var result = '';

        var j = index;
        var inLoop = true;

        while (j >= 0 && inLoop) {
            if (str[j] === '(') {
                inLoop = false;
                index = j;
            }
            j--;
        }

        for (var i = 0; i < index; i++) {
            result += str[i];
        }
        for (var i = index; i < str.length; i++) {
            if (isNotDoneDelete) {
                if ('(|)'.indexOf(str[i]) >= 0) {

                } else {
                    result += str[i];
                }
                if (str[i] === ')') {
                    isNotDoneDelete = false;
                }
            } else {
                result += str[i];
            }
        }
        return result + '(|)';
    }

    /*
     * Handle: user click on items on context-menu
     * 1: MIX; 2: separate
     */
    $(document).on('click', '.menu-item', function (e) {
        if ($(this).attr('data-action') === '1') {
            if (_node_selected) {
                var result = mix_node(_node_selected.attr('data-action'));
                var req = countMixer(result) - countMixer(_arr_position);
                if (checkMixer(req)) {
                    _arr_position = result;
                    update_loopStructure();
                } else {
                    WarningDialog('WARNING_NO_MORE_MIXER');
                }
            } else {
                WarningDialog('WARNING_INVALID_NODE');
                return;
            }
        } else if ($(this).attr('data-action') === '2') {
            if (_node_selected) {
                if (_node_selected.index() >= 0) {
                    _arr_position = separate(_node_selected.attr('data-action'));
                    update_loopStructure();
                } else {
                    WarningDialog('WARNING_INVALID_NODE');
                    return;
                }
            } else {
                WarningDialog('WARNING_INVALID_NODE');
                return;
            }
        } else {
            WarningDialog('WARNING_INVALID_ITEM');
            return;
        }
    });

    /*
     * swap position of node on line
     * EX: V12345678$(|)(|)[:][:] user drag 1 --> after 4. Result: V23415678$(|)(|)[:][:] V14[5:67]823$(|)(|)[:]
     */
    function swap_position(str, drag, drop) {
        var result = '';
        var swapLeft = false;
        var insert_Circle = false;
        var insert_Rect = false;
        var p_Circle;
        var p_Rect;
        if (drop.length > 1) {
            if (('87654321V').indexOf(drop[0]) !== -1) {
                drop = drop[0];
                swapLeft = true;
            }
            if (drop[0] === 'A') {
                insert_Circle = true;
                p_Circle = drop[1];
            }
            if (drop[0] === 'B') {
                insert_Rect = true;
                p_Rect = drop[1];
            }
        }

        if (drag === drop) {
            result = str;
        } else {
            if (insert_Circle) {
                var count = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str[i] !== drag) {
                        if (str[i] === '(') {
                            count++;
                            if (p_Circle == count) {
                                result += str[i] + drag;
                            } else {
                                result += str[i];
                            }
                        } else {
                            result += str[i];
                        }

                    }
                }
            } else if (insert_Rect) {
                var count = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str[i] !== drag) {
                        if (str[i] === '[') {
                            count++;
                            if (p_Rect == count) {
                                result += str[i] + drag;
                            } else {
                                result += str[i];
                            }
                        } else {
                            result += str[i];
                        }

                    }
                }
            } else if (drop === 'head') {
                result += drag;
                for (var i = 0; i < str.length; i++) {
                    if (str[i] !== drag) {
                        result += str[i];
                    }
                }
            } else if (drop === 'sin0') {
                // 最初に見つけた'['の次
                var sepCount = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str[i] !== drag) {
                        result += str[i];
                    }
                    if (str[i] === '[') {
                        if (sepCount == 0) {
                            result += drag;
                        }
                        sepCount ++;
                    }
                }
            } else if (drop === 'sin1') {
                // 2回目に見つけた'['の次
                var sepCount = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str[i] !== drag) {
                        result += str[i];
                    }
                    if (str[i] === '[') {
                        if (sepCount == 1) {
                            result += drag;
                        }
                        sepCount ++;
                    }
                }
            } else if (drop === 'sout0') {
                // 最初に見つけた ']'の手前
                var sepCount = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str[i] === ']') {
                        if (sepCount == 0) {
                            result += drag;
                        }
                        sepCount ++;
                    }
                    if (str[i] !== drag) {
                        result += str[i];
                    }
                }
            } else if (drop === 'sout1') {
                // 2回目に見つけた ']'の手前
                var sepCount = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str[i] === ']') {
                        if (sepCount == 1) {
                            result += drag;
                        }
                        sepCount ++;
                    }
                    if (str[i] !== drag) {
                        result += str[i];
                    }
                }
            } else {
                var index;
                var indexBegin = 0;
                var isOutBefore8 = false;
                var index8 = str.indexOf(']8$');
                var j;
                var inLoop;
                var index2Dot;
                var isSeparate = false;
                if (drop === 'border') {
                    index = str.indexOf('$') - 1;
                    drop = '$';
                    if (str[index] === ']') {
                        isSeparate = true;
                    }
                } else {
                    index = str.indexOf(drop);
                }

                if (index8 !== -1) {
                    isOutBefore8 = true;
                    j = index8 - 1;
                    inLoop = true;
                    while (j >= 0 && inLoop) {
                        if (str[j] === '[') {
                            inLoop = false;
                            indexBegin = j;
                        }
                        j--;
                    }
                }
                if (str.indexOf(drag) >= indexBegin && str.indexOf(drag) < index8 && index >= indexBegin && index < index8 || isOutBefore8 && drag === '8' || isOutBefore8 && drop === '8') {

                    j = index8 - 1;
                    inLoop = true;
                    index2Dot = 0;
                    var numBeforeDot = 0;

                    while (j >= 0 && inLoop) {
                        if (str[j] === ':') {
                            index2Dot = j;
                            inLoop = false;
                        }
                        j--;
                    }

                    inLoop = true;
                    while (j >= 0 && inLoop) {
                        if (str[j] === '[') {
                            inLoop = false;
                        }
                        numBeforeDot++;
                        j--;
                    }
                    var tmp_str = '';
                    for (var i = index2Dot; i < index8 + 2; i++) {
                        if (str.indexOf(drag) < index2Dot && index2Dot < str.indexOf(drop)
                            && drag !== '8' && drop !== '8'
                            && str.indexOf(drag) > indexBegin && str.indexOf(drag) < index8) {
                            if (swapLeft) {
                                if (str[i] === drop) {
                                    tmp_str += str[i] + drag;
                                } else {
                                    tmp_str += str[i];
                                }
                            } else {
                                if (str[i] === drop) {
                                    tmp_str += drag + str[i];
                                } else {
                                    tmp_str += str[i];
                                }
                            }

                        } else if (str.indexOf(drag) > index2Dot && index2Dot < str.indexOf(drop)
                            && drag !== '8' && drop !== '8'
                            && str.indexOf(drag) > indexBegin && str.indexOf(drag) < index8) {
                            if (str[i] === drag) {
                                tmp_str += drop;
                            } else if (str[i] === drop) {
                                tmp_str += drag;
                            } else {
                                tmp_str += str[i];
                            }

                        } else {
                            if (str[i] !== drag) {
                                tmp_str += str[i];
                            }
                        }
                    }
                    if (indexBegin > index && drag === '8') {
                        result = str;
                        WarningDialog('WARNING_POSITION');
                    } else {
                        for (var i = 0; i < str.length; i++) {
                            if (i < index2Dot || i > index8 + 1) {
                                if (drag === '8') {
                                    if (str[i] === drop) {
                                        result += tmp_str + '8';
                                    }
                                    if (index < 0) {
                                        if (str[i] === '$') {
                                            result += tmp_str + '8';
                                        }
                                    }
                                    result += str[i];
                                } else {
                                    if (index < 0) {
                                        if (str[i] === '$') {
                                            result += tmp_str;
                                        }
                                    }
                                    if (str.indexOf(drag) >= indexBegin && str.indexOf(drag) < index8 && index >= indexBegin && index < index8) {
                                        if (str.indexOf(drag) > str.indexOf(drop) && str.indexOf(drag) < index2Dot || str.indexOf(drag) > index2Dot && str.indexOf(drop) < index2Dot) {
                                            if (swapLeft) {
                                                if (str[i] === drop) {
                                                    result += str[i] + drag;
                                                } else if (str[i] === drag) {
                                                } else {
                                                    result += str[i];
                                                }

                                                if ((i + 1) === index2Dot) {
                                                    result += tmp_str;
                                                }
                                            } else {
                                                if (str[i] === drop) {
                                                    result += drag + str[i];
                                                } else if (str[i] === drag) {
                                                } else {
                                                    result += str[i];
                                                }

                                                if ((i + 1) === index2Dot) {
                                                    result += tmp_str;
                                                }
                                            }

                                        } else if (str.indexOf(drag) < index2Dot && index2Dot < str.indexOf(drop) || str.indexOf(drag) > index2Dot && index2Dot < str.indexOf(drop)) {
                                            if (str[i] !== drag) {
                                                result += str[i];
                                            }
                                            if ((i + 1) === index2Dot) {
                                                result += tmp_str;
                                            }
                                        } else {
                                            if (str[i] !== drag) {
                                                result += str[i];
                                            }
                                            if ((i + 1) === index2Dot) {
                                                result += drag + tmp_str;
                                            }
                                        }
                                    } else {
                                        if (str[i] !== drag) {
                                            result += str[i];
                                        }
                                        if ((i + 1) === index2Dot) {
                                            result += drag + tmp_str;
                                        }
                                    }

                                }

                            }
                        }
                    }

                } else {
                    if (drop === '$' && isSeparate) {
                        index2Dot = 0;
                        j = index;
                        inLoop = true;
                        while (j >= 0 && inLoop) {
                            if (str[j] === ':') {
                                index2Dot = j;
                                inLoop = false;
                            }
                            j--;
                        }
                        for (j = 0; j < index2Dot; j++) {
                            if (str[j] !== drag) {
                                result += str[j];
                            }
                        }
                        result += drag;
                        for (j = index2Dot; j < str.length; j++) {
                            if (str[j] !== drag) {
                                result += str[j];
                            }
                        }

                    } else {
                        if (swapLeft) {
                            for (var i = 0; i < str.length; i++) {
                                if (str[i] !== drag) {

                                    result += str[i];

                                    if (str[i] === drop) {
                                        result += drag;
                                    }
                                    if (index < 0) {
                                        if (str[i] === '$') {
                                            result += drag;
                                        }
                                    }

                                }
                            }
                        } else {
                            for (var i = 0; i < str.length; i++) {
                                if (str[i] !== drag) {
                                    if (str[i] === drop) {
                                        result += drag;
                                    }
                                    if (index < 0) {
                                        if (str[i] === '$') {
                                            result += drag;
                                        }
                                    }

                                    result += str[i];
                                }
                            }
                        }

                    }

                }


            }

            if (result) {
                // Check exits (|) before $ in string
                var indexMix = result.indexOf('(|)');
                if (indexMix !== -1) {
                    if (indexMix < result.indexOf('$')) {
                        result = result.substr(0, indexMix) + result.substr(indexMix + 3, result.length) + '(|)';
                    }
                }

                result = checkSeparate(result);

            }

        }

        return result;
    }

    /*
     * Move value to line
     * EX: V12(34|)45678$(|)[:][:] user drag 5 to line (34|) ==> V12(34|5)4678$(|)[:][:]
     */
    function swap_position_val(str, drag, drop) {
        var result = '';
        var index = str.indexOf(drop) + 2;
        for (var i = 0; i < str.length; i++) {
            if (str[i] !== drag) {
                if (i === index) {
                    result += drag;
                }
                result += str[i];
            }
        }
        result = checkSeparate(result);
        return result;
    }

    /*
     * Get num node before or after of node char
     * @param {string} str
     * @param {character} char
     * @param {bool} isBefore
     * @returns {Number}
     */
    function isElement(str, char, isBefore) {
        var outLoop = true;
        var count = 0;
        var index;
        var i;
        index = str.indexOf(char + '|');
        if (isBefore) {
            i = index;
            while (i >= 0 && outLoop) {
                if (str[i] !== '(') {
                    count++;
                }
                if (str[i] === '(')
                    outLoop = false;
                i--;
            }
        } else {
            i = index + 2;
            while (i < str.indexOf('$') && outLoop) {
                if (str[i] !== ')') {
                    count++;
                }
                if (str[i] === ')')
                    outLoop = false;
                i++;
            }
        }

        return count;
    }

    /*
     * Check case: (..7|..)8
     */
    function isMix7(str) {
        return isMixEnd(str, '7', node7, '8');
    }

    /*
     * Check case: (..8|..)?, (..7|..)?
     */
    function isMixEnd(str, char, node, out) {
        var index = str.indexOf((out == undefined) ? '$' : out);
        var i = index;
        var outLoop = true;
        var result = false;
        var isBegin = false;

        if (str[i - 1] === ')') {
            while (i >= 0 && outLoop) {
                if (str[i] === ')')
                    isBegin = true;
                if (isBegin) {
                    if ((str[i] === char) && (node > 0)) {
                        if ((str[i + 1] === ')') || (str[i + 1] === '|')) {
                            result = true;
                        }
                    }
                }
                if (str[i] === '(')
                    outLoop = false;
                i--;
            }
        }

        return result;
    }
    function isMixIn(str, char, node, input) {
        var index = (input == undefined) ? 0 : str.indexOf(input);
        var i = index;
        var outLoop = true;
        var result = false;
        var isBegin = false;

        if (str[i + 1] === '(') {
            while (i < str.length && outLoop) {
                if (str[i] === '(')
                    isBegin = true;
                if (isBegin) {
                    if ((str[i] === char) && (node > 0)) {
                        if ((str[i + 1] === ')') || (str[i + 1] === '|')) {
                            result = true;
                        }
                    }
                }
                if (str[i] === ')')
                    outLoop = false;
                i++;
            }
        }

        return result;
    }

    function is7BeforeMix8End(str) {
        var result = false;
        var index7 = str.indexOf('7');
        if (str[index7 + 1] === '(' && isMixEnd(str, '8', node8)) {
            var inLoop = true;
            var i = index7 + 1;
            while (i < str.indexOf('$') && inLoop) {
                if (str[i] === '|')
                    inLoop = false;
                if (str[i] === '8')
                    result = true;
                i++;
            }
        }
        return result;
    }

    function getNodeBeforeIndex(str, index) {
        var inLoop = true;
        var i = index;
        var result = str[index];
        while (i >= 0 && inLoop) {
            if (str[i] === '|') {
                result = str[i - 1];
                inLoop = false;
            }
            i--;
        }
        return result;
    }

    function numInbracket(str, index, charEnd, isBefore) {
        var result = 0;
        var i;
        if (isBefore) {
            i = index - 1;
            while (i >= 0) {
                if (str[i] === charEnd)
                    break;
                result++;
                i--;
            }
        } else {
            i = index + 1;
            while (i < str.indexOf('$')) {
                if (str[i] === charEnd)
                    break;
                result++;
                i++;
            }
        }
        return result;
    }

    function isIn2Circle(str, index, isBefore) {
        var result = false;
        if (isBefore) {
            if (str[index - 1] === '|') {
                var i = index - 1;
                while (i > 0) {
                    if (str[i] === '(') {
                        if (str[i - 1] === ')')
                            result = true;
                        break;
                    }
                    i--;
                }
            }
        } else {
            if (str[index + 1] === '|') {
                var i = index + 1;
                while (i < str.indexOf('$')) {
                    if (str[i] === ')') {
                        if (str[i + 1] === '(')
                            result = true;
                        break;
                    }
                    i++;
                }
            }
        }

        return result;
    }

    function update_loopStructure() {
        // Update value to model.
        setLoopPosition();
        getLoopPosition();

        // Handle draw node to screen.
        var s = '';
        var list_node = '';
        var p_left = oneWidth * 10 + 20;
        var tmp;
        var count = 0;
        var start = 0;
        var end = 0;
        var isCircle = false;
        var isslash = false;
        var isRect = false;
        var isTwoDot = false;
        var position_left = oneWidth * 10 + 16;
        var po_tmp;
        var hover = '';
        var node_tmp;
        var action_tmp = '';
        var area_mouse_over = '';
        var count_margin = 0;
        var before_slash = 0;
        var before_2dot = 0;
        var mixer_label = '';
        var mix = 0;
        var sep = 0;
        var sinLeft;

        function addMixNode(pos, left) {
            mixer_label += '<span class="mixer_id" style="left: ' + (left - 1) + 'px;"> M' + (mix + 1) + '</span>';
            mix ++;
            return '<span class="delete_mix" data-action="' + pos + '" style="left: ' + left + 'px;"></span>';
        }
        function addSeparateNode(pos, left) {
            return '<span class="delete_separate" data-action="' + pos + '" style="left: ' + left + 'px;"></span>';
        }
        function addNode(pos, left) {
            return '<span class="node" data-action="' + pos + '" style="left: ' + left + 'px;"></span>';
        }
        function addHover(action, left, top) {
            var ttt = (top != undefined) ? 'top: ' + top + 'px; ' : '';
            return '<span class="ui-hover" data-action="' + action + '" style="' + ttt + 'left: ' + left + 'px;"></span>';
        }
        function addMouseOver(action, width, left, top) {
            var ttt = (top != undefined) ? 'top: ' + top + 'px; ' : '';
            var www = (width != undefined) ? 'width: ' + width + 'px; ' : '';
            var lll = (left != undefined) ? 'left: ' + left + 'px; ' : '';
            return '<span class="area-mouse-over" data-action="' + action + '" style="' + ttt + lll + www + '"></span>';
        }
        function addHoverAndMouseOver(action, left_h, top_h, width_m, left_m, top_m)
        {
            hover += addHover(action, left_h, top_h);
            area_mouse_over += addMouseOver(action, width_m, left_m, top_m);
        }


        function appendLine(c, left, width, top, action, append) {
            var ttt = (top != undefined) ? 'top: ' + top + 'px; ' : '';
            var www = (width != undefined) ? 'width: ' + width + 'px; ' : '';
            var lll = (left != undefined) ? 'left: ' + left + 'px; ' : '';
            var aaa = (action != undefined) ? ' data-action="' + action + '" ' : '';
            var zzz = (append != undefined) ? append : '';
            $('#line').append('<span class=' + c + aaa + ' style="' + lll + www + ttt + zzz + '"></span>');
        }
        function isSeparater(lp) {
                return (lp === '(' || lp === '|' || lp === ')' || lp === '[' || lp === ']' || lp === ':');
        }
        function appendLineWMix(left, width, top, action, append)   { appendLine("line-w-mix",  left, width, top, action, append); }
        function appendLineWOver(left, width, top, action, append)  { appendLine("line-w-over", left, width, top, action, append); }
        function appendLineWMin(left, width, top, action, append)   { appendLine("line-wmin",   left, width, top, action, append); }
        function appendLineW(left, width, top, action, append)      { appendLine("line-w",      left, width, top, action, append); }
        function appendLineWS(left, width, top, action, append)      { appendLine("line-ws",      left, width, top, action, append); }

        function appendLineHShort(left, width, top, action, append) { appendLine("line-hshort", left, width, top, action, append); }
        function appendLineHMin(left, width, top, action, append)   { appendLine("line-hmin",   left, width, top, action, append); }
        function appendLineH(left, width, top, action, append)      { appendLine("line-h",      left, width, top, action, append); }
        function makeLabel(lp, pos) {
            var tmp = '<div class="cover" data-action = ' + lp;
            if (pos != undefined) {
                tmp =  tmp + ' style="top: 70px; margin-right:-' + pos + 'px">';
            } else {
                tmp = tmp + '>';
            }
            if (lp !== 'V') {
                tmp += '<div class="text">L' + lp + '</div>';
            } else {
                tmp += '<div class="text">' + lp + '</div>';
            }
            if (getState_SW(lp) === 0) {
                tmp += '<div class="circle disable"></div>';
            } else {
                tmp += '<div class="circle"></div>';
            }
            if (getState_CarryOver(lp) === 0) {
                tmp += '<div class="rectangle disable"></div>';
            } else {
                tmp += '<div class="rectangle"></div>';
            }
            tmp += '</div>';
            return tmp;
        }
        
        $('#line').empty();
        if (_arr_position.indexOf('[') === 0) {
            list_node += addSeparateNode("root", position_left);
        } else if (_arr_position.indexOf('(') === 0) {
            list_node += addNode("root", position_left);
        } else {
            list_node += addNode("root", position_left);
        }
        if ((_arr_position[0] === '(') || (_arr_position[0] === '[')) {
            addHoverAndMouseOver("head", (p_left + 8), undefined, 23, (p_left - 19 + 23));
        }
        if (_arr_position[0] === '[') {
            sinLeft = p_left;
            addHoverAndMouseOver("sin" + sep, sinLeft - 11 + 8, undefined, 11, sinLeft - 11);
        }

        position_left -= oneWidth;
        for (var i = 0; i < _arr_position.indexOf('$'); i++) {
            if (_arr_position[i] === '(') {
                isCircle = true;
                before_slash++;
                count = 0;
            }
            if (isCircle) {
                if (_arr_position[i] === '|') {
                    isslash = true;
                    count_margin = 0;
                    node_tmp = _arr_position[i - 1];
                }
                if (isCircle && !isslash && _arr_position[i] !== '(') {
                    count++;
                }
            }
            if (_arr_position[i] === ')') {
                isCircle = false;
                isslash = false;
            }
            if (_arr_position[i] === '[') {
                if (i > 0) {
                    sinLeft = p_left;
                    if (_arr_position[i + 1] === ':') {
                        addHoverAndMouseOver("sin" + sep, sinLeft - 11, undefined, 23, sinLeft - 11 - 8);
                    }
                }
                isRect = true;
                before_2dot++;
                count = 0;
            }
            if (isRect) {
                if (_arr_position[i] === ':') {
                    isTwoDot = true;
                    count_margin = 0;
                    node_tmp = _arr_position[i - 1];
                }
                if (isRect && !isTwoDot && _arr_position[i] !== '[') {
                    count++;
                }
            }
            if (_arr_position[i] === ']') {
                if (_arr_position[i - 1] == ':') {
                    addHoverAndMouseOver("sout" + sep, p_left - 11 + parseInt((sinLeft - p_left) / 2) + 8, lowerTop, sinLeft - p_left + 23, p_left - 11, lowerTop);
                }
                sep ++;
                isRect = false;
                isTwoDot = false;
            }

            if (isCircle && isslash) {
                if (!isSeparater(_arr_position[i])) {
                    po_tmp = ((count - count_margin) * oneWidth) - 9;
                    s += makeLabel(_arr_position[i], po_tmp);

                    count_margin++;

                    if (isIn2Circle(_arr_position, i, true)) {
                        addHoverAndMouseOver(_arr_position[i], (p_left - ((count_margin - 1 - count) * oneWidth) - oneOffset), lowerTop, 23,        (p_left - ((count_margin - 1 - count) * oneWidth) - 19), lowerTop);
                    } else {
                        addHoverAndMouseOver(_arr_position[i], (p_left - ((count_margin - 1 - count) * oneWidth)            ), lowerTop, undefined, (p_left - ((count_margin - 1 - count) * oneWidth) - 19), lowerTop);
                    }


                    if (count <= 0) {
                        position_left -= oneWidth;
                    }
                    if (_arr_position[i - 1] === '|') {
                        action_tmp = _arr_position[i];
                    }

                }
                if (count_margin === 1) {
                    if (count === 0) {
                        (function(){
                            var posEnd = numInbracket(_arr_position, (i - 1), ')', false);
                            addHoverAndMouseOver('A' + before_slash, (p_left - ((count_margin - 1) * oneWidth) - 23), undefined, (posEnd * oneWidth), (p_left - 19 - (posEnd * oneWidth) + 23));
                        })();
                    }

                }
            } else if (isRect && isTwoDot) {
                if (!isSeparater(_arr_position[i])) {
                    po_tmp = ((count - count_margin) * oneWidth) - 9;
                    s += makeLabel(_arr_position[i], po_tmp);

                    count_margin++;

                    addHoverAndMouseOver(_arr_position[i], (p_left + po_tmp + 9), lowerTop, undefined, (p_left + po_tmp - 10), lowerTop);

                }
                if (count_margin === 1) {
                    if (count === 0) {
                        (function(){
                            var posEnd = numInbracket(_arr_position, (i - 1), ']', false);
                            addHoverAndMouseOver('B' + before_2dot, (p_left + po_tmp + 9 - 23), undefined, (posEnd * oneWidth - 23), (p_left + po_tmp - 10 - ((posEnd - 1) * oneWidth)));
                        })();
                    }
                }
            } else {
                if (!isSeparater(_arr_position[i])) {
                    s += makeLabel(_arr_position[i]);

                    if (!isCircle || !isRect) {
                        if (_arr_position[i + 1] === '[') {
                            list_node += addSeparateNode(_arr_position[i], (position_left + ((_arr_position.substr(i + 1, 3) == '[:]') ? 2 : 0)));
                        } else if (_arr_position[i + 1] === '|') {
                            action_tmp = _arr_position[i];
                            (function(){
                                var posTop = numInbracket(_arr_position, (i + 1), '(', true);
                                var posEnd = numInbracket(_arr_position, (i + 1), ')', false);
                                if (posTop < posEnd) {
                                    addHoverAndMouseOver(_arr_position[i] + 'inLeft', (p_left - oneWidth), undefined, ((posEnd - posTop) * oneWidth), (p_left - 19 - (posEnd - posTop) * oneWidth));
                                } else {
                                    addHoverAndMouseOver(_arr_position[i] + 'out', (p_left - oneWidth + 8), undefined, 23, (p_left - 19 - 23));
                                }
                            })();
                        } else {
                            list_node += addNode(_arr_position[i], position_left);
                        }
                        if (_arr_position[i + 1] === ':') {
                            (function(){
                                var posTop = numInbracket(_arr_position, (i + 1), '[', true);
                                var posEnd = numInbracket(_arr_position, (i + 1), ']', false);
                                if (posTop < posEnd) {
                                    addHoverAndMouseOver(_arr_position[i] + 'inLeft', (p_left - oneWidth), undefined, ((posEnd - posTop) * oneWidth), (p_left - 19 - ((posEnd - posTop) * oneWidth)));
                                }
                            })();
                        }

                        position_left -= oneWidth;
                        if (_arr_position[i - 1] === '[') {
                            if (i - 2 >= 0) {
                                if (!isSeparater(_arr_position[i - 2])) {
                                    addHoverAndMouseOver(_arr_position[i - 2] + 'out', (p_left + 8), undefined, 23, (p_left - 19 + 23));
                                }
                            }
                            addHoverAndMouseOver(_arr_position[i], (p_left - oneOffset), undefined, 23, (p_left - 19));
                        } else if (_arr_position[i - 1] === '(') {
                            if (i - 2 >= 0) {
                                if (!isSeparater(_arr_position[i - 2])) {
                                    addHoverAndMouseOver(_arr_position[i - 2] + 'out', (p_left + 8), undefined, 23, (p_left - 19 + 23));
                                }
                            }
                            addHoverAndMouseOver(_arr_position[i], (p_left - oneOffset), undefined, 23, (p_left - 19));
                        } else if (_arr_position[i - 1] === ')') {
                            if ('87654321V'.indexOf(getNodeBeforeIndex(_arr_position, (i - 1))) !== -1) {
                                addHoverAndMouseOver(getNodeBeforeIndex(_arr_position, (i - 1)) + 'out', (p_left + 8), undefined, 23, (p_left - 19 + 23));
                            }
                            addHoverAndMouseOver(_arr_position[i], (p_left - oneOffset), undefined, 23, (p_left - 19));
                        } else {
                            addHoverAndMouseOver(_arr_position[i], p_left, undefined, undefined, (p_left - 19));
                        }

                        if (((_arr_position[i + 1] === '(') && (_arr_position[i + 2] === '|')) ||
                            ((_arr_position[i + 1] === '[') && (_arr_position[i + 2] === ':')) ) {
                            addHoverAndMouseOver(_arr_position[i] + 'out', (p_left + 8 - oneWidth), undefined, 23, (p_left - 19 - 23));
                        }

                        p_left -= oneWidth;

                    } else {
                        if (_arr_position[i + 1] === '[') {
                            list_node += addSeparateNode(_arr_position[i], (position_left - ((count - 1) * oneWidth)));
                        } else if (_arr_position[i + 1] === '|') {
                            list_node += addMixNode(_arr_position[i], (position_left - ((count - 1) * oneWidth)));
                        } else {
                            list_node += addNode(_arr_position[i], (position_left - ((count - 1) * oneWidth)));
                        }

                        addHoverAndMouseOver(_arr_position[i], (p_left - ((count - 1) * oneWidth)), undefined, undefined, (p_left - ((count - 1) * oneWidth) - 19));
                    }
                    if (_arr_position[i] === '7' && node7 === 1) {
                        if (isMix7(_arr_position) || isMixEnd(_arr_position, '7', node7)) {
                            (function () {
                                var num = isElement(_arr_position, '7', false); // lower 
                                var num2 = isElement(_arr_position, '7', true); // upper
                                if (num2 <= 1) {
                                    if (num <= 0) {
                                        appendLineHMin((p_left - oneOffset), undefined);
                                        appendLineWMin((p_left - oneOffset) - 2, 36);
                                    } else {
                                        if ((_arr_position.indexOf('8)', i) > 0) && (node8 > 0)) {
                                            appendLineWMix((p_left - oneOffset - ((num - 1) * oneWidth)), 26, 84);
                                            appendLineH((p_left - oneOffset - ((num - 1) * oneWidth)), undefined, 14);
                                        } else {
                                            appendLineHMin((p_left - oneOffset - ((num - 1) * oneWidth)), undefined, 14);
                                        }
                                        appendLineWMin((p_left - oneOffset - ((num - 1) * oneWidth)), (num * (oneWidth - 2)));
                                    }
                                } else {
                                    if (num <= 0) {
                                        appendLineHMin((p_left - oneOffset), undefined);
                                    } else {
                                        if (num2 >= num) {
                                            if ((_arr_position.indexOf('8)', i) > 0) && (node8 > 0)) {
                                                appendLineWMix((p_left - oneOffset), (((num2 - num + 1) * oneWidth) - 4), 84);
                                            }
                                            appendLineHMin((p_left - oneOffset), undefined, 14);
                                        } else {
                                            if ((_arr_position.indexOf('8)', i) > 0) && (node8 > 0)) {
                                                appendLineWMix((p_left - oneOffset - ((num - num2) * oneWidth)), (((num - num2) * oneWidth) - 4), 84);
                                            }
                                            appendLineHMin((p_left - oneOffset - ((num - num2) * oneWidth)), undefined, 14);
                                            appendLineWMin((p_left - oneOffset - ((num - num2) * oneWidth)), (((num - num2) * oneWidth) + 24));
                                        }

                                    }
                                }
                            })();
                        }
                        // if (is7BeforeMix8End(_arr_position)) {
                        //     appendLineWMin((p_left - oneOffset), 24);
                        // }
                    }
                    // if (_arr_position[i] === '8' && node7 === 1) {
                    //     if (isMix7(_arr_position)) {
                    //         appendLineWMin((p_left + 36), 16);
                    //     }
                    // }
                    if ((_arr_position[i] === '7') && (node7 > 0)) {
                        if ((node8 > 0) && ((_arr_position[i + 1] === '8') || (_arr_position.indexOf('7(8') > 0))) {
                            appendLineWMin(p_left - 8, loopBoxW);
                        }
                    }
                    if (_arr_position[i] === '8' && node8 === 1) {
                        if (isMixEnd(_arr_position, '8', node8)) {
                            (function(){
                                var num = isElement(_arr_position, '8', false); // lower
                                var num2 = isElement(_arr_position, '8', true); // upper
                                if (num2 <= 1) {
                                    if (num <= 0) {
                                        appendLineWMix((p_left - oneOffset), 50, 84);
                                        appendLineH((p_left + oneInterval), undefined, 14);

                                        appendLineH((p_left - oneOffset), undefined, 14);
                                        appendLineWMin((p_left - oneOffset), 36);
                                    } else {
                                        if ((_arr_position.indexOf('7)', i) > 0) && (node7 > 0)) {
                                            appendLineWMix((p_left - oneOffset - ((num - 1) * oneWidth)), 26, 84);
                                            appendLineH((p_left - oneOffset - ((num - 1) * oneWidth)), undefined, 14);
                                        } else {
                                            appendLineHMin((p_left - oneOffset - ((num - 1) * oneWidth)), undefined, 14);
                                        }
                                        if (isMixIn(_arr_position, '8', node8, '7')) {
                                            appendLineHMin((p_left + oneInterval), undefined, 14);
                                        }
                                        appendLineWMin((p_left - oneOffset - ((num - 1) * oneWidth)), (num * (oneWidth - 2)));
                                    }
                                } else {
                                    if (num <= 0) {
                                        appendLineWMix((p_left - oneOffset), ((num2 * oneWidth) + 4), 84);
                                        appendLineH((p_left + oneInterval + ((num2 - 1) * oneWidth)), undefined, 14);
                                        appendLineH((p_left - oneOffset), undefined, 14);
                                    } else {
                                        if (num2 >= num) {
                                            if ((_arr_position.indexOf('7)', i) > 0) && (node7 > 0)) {
                                                appendLineWMix((p_left - oneOffset), (((num2 - num + 1) * oneWidth) - 4), 84);
                                            }
                                            appendLineHMin((p_left - oneOffset), undefined, 14);
                                        } else {
                                            if ((_arr_position.indexOf('7)', i) > 0) && (node7 > 0)) {
                                                appendLineWMix((p_left - oneOffset - ((num - num2) * oneWidth)), (((num - num2) * oneWidth) - 4), 84);
                                            }
                                            appendLineHMin((p_left - oneOffset - ((num - num2) * oneWidth)), undefined, 14);
                                            appendLineWMin((p_left - oneOffset - ((num - num2) * oneWidth)), (((num - num2) * oneWidth) + 24));
                                        }

                                    }
                                }
                            })();
                        }
                    }

                } else if (_arr_position[i] === '(' || _arr_position[i] === '[') {
                    (function(){
                        var off = (_arr_position.substr(i, 3) == '[:]') ? 2 : 0;
                        var top = 0;
                        var height = 70;
                        if (((_arr_position[i - 1] == '7') && (node7 == 1)) ||
                            ((_arr_position[i - 1] == '8') && (node8 == 1))) {
                            if (_arr_position[i] === '[') {
                                top = 14;
                                height = 56;
                                appendLineWMin((p_left + off + 2), undefined, top);
                            }
                        }
                        appendLineH((p_left + off), undefined, top, undefined, 'height: ' + height + 'px;');
                    })();
                    start = p_left;
                } else if (_arr_position[i] === ')') {
                    if (count >= count_margin) {
                        if (count_margin > 0) {
                            p_left -= oneWidth;
                        }
                    } else {
                        if (count > 0) {
                            p_left -= (count_margin - (count - 1)) * oneWidth;
                            position_left -= (count_margin - 1 - (count - 1)) * oneWidth;
                        } else {
                            p_left -= count_margin * oneWidth;
                        }
                    }
                    (function() {
                        function localFunc(compare, offset) {
                            if (compare) {
                                addHoverAndMouseOver(_arr_position[i - 1] + 'out', p_left + offset + 8, lowerTop, 23,        p_left + offset - 19 + 23, lowerTop);
                            } else {
                                addHoverAndMouseOver(_arr_position[i - 1] + 'out', p_left + offset,     lowerTop, undefined, p_left + offset - 19,      lowerTop);
                            }
                        }
                        if (count >= 1 && _arr_position[i - 1] !== '|') {
                            p_left += oneWidth;
                            appendLineH(p_left);
                            if (count >= count_margin) {
                                localFunc((_arr_position[i + 1] === '(' && count === count_margin), ((count - count_margin) * oneWidth));
                            } else {
                                localFunc((_arr_position[i + 1] === '('), 0);
                            }
                        } else {
                            appendLineH(p_left);
                            if (_arr_position[i - 1] !== '|') {
                                localFunc((_arr_position[i + 1] === '('), 0);
                            }
                        }
                    })();
                    if (action_tmp) {
                        list_node += addMixNode(action_tmp, (p_left - 4));
                    }
                    end = start - p_left + 4;
                    if (_arr_position[i - 1] !== '|') {
                        appendLineWS(p_left, end, undefined, node_tmp);
                    } else {
                        appendLineW(p_left, end, undefined, node_tmp);
                    }
                    if ((_arr_position[i + 1] == '$') && ((_arr_position[i - 1] == '8' && node8 > 0) || (_arr_position[i - 1] == '7' && node7 > 0))) {
                        appendLineH((p_left - oneOffset), undefined, 14);
                        appendLineWMin((p_left - oneOffset), 23, 84);
                    }
                } else if (_arr_position[i] === ']') {
                    if (count >= count_margin) {
                        if (count_margin > 0) {
                        }
                    } else {
                        if (count > 0) {
                            p_left -= (count_margin - (count - 1)) * oneWidth;
                            p_left += oneWidth;
                        } else {
                            p_left -= count_margin * oneWidth;
                        }
                    }

                    if (count >= count_margin) {
                    } else {
                        position_left -= (count_margin - 1 - (count - 1)) * oneWidth;
                    }
                    if (_arr_position[i + 1] !== '8') {
                        end = start + 4;
                        appendLineWS(0, end, undefined, node_tmp);
                    } else {
                        (function(){
                            var off = 0;
                            var off1 = 0;
                            if (_arr_position.substr(i - 2, 3) == '[:]') {
                                off = 6;
                                off1 = 4;
                            }
                            end = start - p_left + 4 + off;
                            appendLineWS((p_left - off1), end, undefined, node_tmp);
                        })();
                    }
                    if (_arr_position[i - 1] !== ':') {
                        if (count >= count_margin) {
                            addHoverAndMouseOver(_arr_position[i - 1] + 'out', (p_left + ((count - count_margin) * oneWidth)), lowerTop, undefined, (p_left + ((count - count_margin) * oneWidth) - 19), lowerTop);
                        } else {
                            addHoverAndMouseOver(_arr_position[i - 1] + 'out', (p_left), lowerTop, undefined, (p_left - 19), lowerTop);
                        }
                    }

                }
            }
            if (_arr_position[i] === '8' && _arr_position[i - 1] === ']') {
                (function(){
                    var off = (_arr_position.substr(i - 3, 3) == '[:]') ? 4 : 0;
                    appendLineHMin((p_left + oneWidth - off));
                    appendLineWMin((p_left + oneInterval - 2), (10 - off));
                })();
            }

        }

        if (_arr_position.indexOf(']$') >= 0) {
            (function(){
                var top = 0;
                var width = (p_left);

                switch (output_select) {
                    case 0:     // 1
                        width += 4;
                        top = 70;
                        // no break;
                    case 1:     // 2
                        appendLineWOver(0, width, top, undefined, 'z-index:9999;');
                    case 2:     // 1 & 2
                        break;
                }
            })();
        } else {
            switch (output_select) {
                case 0:     // 1
                    break;

                case 1:     // 2
                    appendLineWOver(0, (p_left));
                    // no break
                case 2:     // 1 & 2
                    (function(){
                        function isStereoOut( ) {
                            return ((_arr_position[_arr_position.indexOf('$') - 1] === '7' && node7 === 1) || (_arr_position[_arr_position.indexOf('$') - 1] === '8' && node8 === 1)
                                    || isMixEnd(_arr_position, '8', node8) || isMixEnd(_arr_position, '7', node7));
                        }
                        var lefta = p_left;
                        if (isStereoOut()) {
                            lefta += 16;
                        } else {
                            appendLineHShort(p_left);
                        }
                        appendLineWMin(0, lefta);
                    })();
                    break;
            }
        }



        if (numAfter2dot(_arr_position) > 0) {
        } else {
            if (_arr_position.indexOf(')$') !== -1) {
                if ('87654321V'.indexOf(getNodeBeforeIndex(_arr_position, _arr_position.indexOf(')$') - 1)) !== -1) {
                    addHoverAndMouseOver(getNodeBeforeIndex(_arr_position, _arr_position.indexOf(')$') - 1) + 'out', (p_left + 8), undefined, 23, (p_left - 19 + 23));
                    addHoverAndMouseOver("border", (p_left - oneOffset), undefined, 23, (p_left - 19));
                } else {
                    addHoverAndMouseOver("border", (p_left - oneOffset), undefined, undefined, (p_left - 19));
                }
            } else {
                addHoverAndMouseOver("border", p_left, undefined, undefined, (p_left - 19));
            }

        }

        s += '</div>';
        hover += area_mouse_over;

        $('#line').append(hover);
        $('#loop').html(s);
        $('#list-node').html(list_node);
        $('#mixer-label').html(mixer_label);

        $(".cover").draggable({
            containment: "#Loop_Structure",
            helper: 'clone',
            opacity: 0.5,
            start: function (e, ui) {
                $('#select-menu').hide();
            }
        });

        var isDropOver = false;

        $('.area-mouse-over').droppable({
            tolerance: 'intersect',
            drop: function (e, ui) {
                $('.ui-hover').hide();
                var drop = $(this).attr('data-action');
                var drag = $(ui.draggable).attr('data-action');
                _arr_position = swap_position(_arr_position, drag, drop);
                update_loopStructure();
                isDropOver = true;
            },
            over: function (e, ui) {
                var value = $(this).attr('data-action');
                $('.ui-hover').hide();
                $('.ui-hover').each(function () {
                    if ($(this).attr('data-action') === value) {
                        $(this).show();
                    }
                });
            },
            out: function (e, ui) {
                var isHover = false;
                $('.area-mouse-over').each(function () {
                    if ($(this).hasClass('ui-droppable-hover')) {
                        isHover = true;
                    }
                });
                if (!isHover) {
                    $('.ui-hover').hide();
                }
            }
        });

        $('.ui-hover').hide();

        $('.line-w').droppable({
            accept: ".cover",
            hoverClass: "line-hover",
            tolerance: 'pointer',
            drop: function (e, ui) {
                if (!isDropOver) {
                    var drop = $(this).attr('data-action');
                    var drag = $(ui.draggable).attr('data-action');
                    _arr_position = swap_position_val(_arr_position, drag, drop);
                    update_loopStructure();
                }
            }
        });

    }

    function numAfter2dot(str) {
        var result = 0;
        var index = str.indexOf(']$');
        if (index !== -1) {
            var before = 0;
            var after = 0;
            var inLoop = true;
            var i = index;
            while (i >= 0 && inLoop) {
                i--;
                if (str[i] === ':') {
                    inLoop = false;
                } else {
                    after++;
                }
            }
            inLoop = true;
            while (i >= 0 && inLoop) {
                i--;
                if (str[i] === '[') {
                    inLoop = false;
                } else {
                    before++;
                }

            }
            if (after > before) {
                result = after - before;
            }
        }

        return result;
    }

    function WarningDialog(contain) {
        $es.dialog.openWarning(contain);
    }
    function ErrorDialog(contain) {
        $es.dialog.openError(contain);
    }

    function loopStructure() { };
    loopStructure.prototype = {
        init: function () {
            //  for splus loop structure
            $('#layout-wrapper').append($('<div id="select-menu"></div>'));
            var menu = $('<div class="menu-item" data-action = "1"></div>');
            menu.append($('<span>MIX</span>'));
            menu.append($('<img src="images/mix.png" alt=""/>'));
            $('#select-menu').append(menu);
            var menu = $('<div class="menu-item" data-action = "2"></div>');
            menu.append($('<span>SEPARATE</span>'));
            menu.append($('<img src="images/parallel.png" alt=""/>'));
            $('#select-menu').append(menu);
            $('#Loop_Structure').append($('<div class="container"></div>'));
            var obj = $('#Loop_Structure').children('div.container');
            obj.append($('<div id="line"></div>'));
            obj.append($('<div id="loop"></div>'));
            obj.append($('<div id="list-node"></div>'));
            obj.append($('<div id="mixer-label"></div>'));

            this.update();
        },
        update: function () {
            getLoopPosition();
            update_loopStructure(false);
        }
    };
    $es.loopStructure = new loopStructure();

});