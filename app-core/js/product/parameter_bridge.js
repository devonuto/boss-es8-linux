$(function(){
    function setP(id, v) {
        function Correct(prmid, index, newValue) {
            function minMax(v, min, max) {
                v = parseInt(v);
                if (v < min) return v;
                if (v > max) return max;
                return v;
            }
            var correctValue = parseInt(newValue);
            var min = prmdb[prmid].min;
            var max = prmdb[prmid].max;
            switch (prmid) {
                case 'ID_SYSTEM_EXP_MIN':
                case 'ID_SYSTEM_EXP_MAX':
                case 'ID_PATCH_EXP_MIN':
                case 'ID_PATCH_EXP_MAX':
                    // FUNCに応じて 設定できる範囲が違う
                    var p = prmid.match(/^([A-Z_]+)_EXP_[A-Z]+$/)[1];
                    if ($es.getParamValue(p + '_EXP_FUNC', index) == 3) {
                        min = 20;
                        max = 500;
                    } else {
                        min = 0;
                        max = 127;
                    }
                    break;
                case 'ID_PATCH_ASSIGN_TARGET_MIN':
                case 'ID_PATCH_ASSIGN_TARGET_MAX':
                    // TARGETに応じて 設定できる範囲が違う
                    switch ($es.getParamValue('ID_PATCH_ASSIGN_TARGET', index)) {
                        case 15: // E.CTL:EXP1
                        case 16: // E.CTL:EXP2
                        case 22: min = 0; max = 127; break; // MIDI
                        case 23: min = 20; max = 500; break; // Master BPM
                        case 18: min = 0; max = 2; break; // InOut: Out
                        default: min = 0; max = 1; break; // other
                    }
                    break;
                case 'ID_PATCH_CTL1':
                case 'ID_PATCH_CTL2':
                case 'ID_PATCH_CTL3':
                case 'ID_PATCH_CTL4':
                case 'ID_PATCH_CTL5':
                case 'ID_PATCH_CTL6':
                    // ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL に応じて 設定できる範囲が違う
                    i = prmid.match(/^ID_PATCH_CTL([0-9])$/);
                    if ($es.getParamValue('ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL' + i[1], 0) <= 2) {
                        min = 0;
                        max = 1;
                    } else {    // TYPE = (TP2 | TP3 | TP4)
                        // 0 - 13, 20 - 500 が有効
                        correctValue = minMax(newValue, min, max);
                        if ((correctValue > 13) && (correctValue < 20)) {
                            correctValue = prmdb[prmid].def;
                        }
                        return correctValue;
                    }
                    break;
                case 'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1':
                case 'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL2':
                case 'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL3':
                case 'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL4':
                case 'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL5':
                case 'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL6':
                    i = prmid.match(/^[A-Z_]+([0-9])$/);
                    var ctlV = $es.getParamValue('ID_PATCH_CTL' + i[1], 0); 
                    setTimeout(function(){
                        $('#ID_PATCH_CTL' + i[1]).trigger('elf-change', ctlV);

                    }, 0);
                    break;
                case 'ID_PATCH_ASSIGN_WAVE_PEDAL_RATE':
                    // 0 - 12, 20 - 120 が有効
                    correctValue = minMax(newValue, min, max);
                    if ((correctValue > 12) && (correctValue < 20)) {
                        correctValue = prmdb[prmid].def;
                    }
                    return correctValue;
                case 'ID_PATCH_ASSIGN_ACT_RANGE_HI':
                case 'ID_PATCH_ASSIGN_ACT_RANGE_LO':
                    if (prmid.match(/_LO/)) {
                        var oppositeId = prmid.replace('_LO','_HI');
                        var oppositeVal = -1;
                        var oppositeFunc = function(v, opp) { return (v >= opp); }
                    } else {
                        var oppositeId = prmid.replace('_HI','_LO');
                        var oppositeVal = +1;            
                        var oppositeFunc = function(v, opp) { return (v <= opp); }
                    }
                    var opposite = $es.getParamValue(oppositeId, index);
                    if (oppositeFunc(v, opposite)) {
                        var newVal = opposite + oppositeVal;
                        return newVal;
                    }
                    break;
                default:
                    break;
            }
            correctValue = minMax(newValue, min, max);
            return correctValue;
        };
        function RepairRelation(prmid, index, newValue, nowValue) {
            function CheckInvalidTargetAtWaveIntPedal(index, src, target) {
                switch (src) {
                    case 19: // INT
                    case 20: // WAVE
                        switch (target) {
                            case 9: // E.CTL: CTL1
                            case 10: // E.CTL: CTL2
                            case 11: // E.CTL: CTL3
                            case 12: // E.CTL: CTL4
                            case 13: // E.CTL: CTL5
                            case 14: // E.CTL: CTL6
                            case 15: // E.CTL: EXP1
                            case 16: // E.CTL: EXP2
                            case 22: // MIDI
                            case 23: // BPM: Master Bpm
                            case 24: // BPM: Tap
                                break;
                            default:
                                $es.setAndChangeParamValue('ID_PATCH_ASSIGN_TARGET', index, 9);  // E.CTL: CTL1
                                return true;
                                break;
                        }
                        break;
                }
                return false;
            }
            switch (prmid) {
                case 'ID_PATCH_ASSIGN_SOURCE':
                    CheckInvalidTargetAtWaveIntPedal(index, newValue, $es.getParamValue('ID_PATCH_ASSIGN_TARGET', index));
                    break;
                case 'ID_SYSTEM_EXP_FUNC':
                case 'ID_PATCH_EXP_FUNC':
                    // 今のFUNCと次のFUNCでMIN/MAX範囲が違う場合はMIN/MAXをリセットする
                    var p = prmid.match(/^([A-Z_]+)_EXP_FUNC$/)[1];
                    if ((newValue != 3) && (nowValue == 3)) {
                        $es.setParamValue(p + '_EXP_MIN', index, 0);
                        $es.setParamValue(p + '_EXP_MAX', index, 127);
                    } else if ((newValue == 3) && (nowValue != 3)) {    // Master BPM
                        $es.setParamValue(p + '_EXP_MIN', index, 20);
                        $es.setParamValue(p + '_EXP_MAX', index, 500);
                    }
                    break;
                case 'ID_PATCH_ASSIGN_TARGET':
                    if (CheckInvalidTargetAtWaveIntPedal(index, $es.getParamValue('ID_PATCH_ASSIGN_SOURCE', index), newValue)) {
                        return;
                    }
                    if (newValue != nowValue) {
                        function searchMin(n){
                            var len = prmstr.ID_PATCH_ASSIGN_TARGET_MIN[n].length;
                            for (i = 0; i < len; i++){
                                if (prmstr.ID_PATCH_ASSIGN_TARGET_MIN[n][i] !== undefined) break;
                            }
                            return i;
                        }
                        function searchMax(n){
                            return prmstr.ID_PATCH_ASSIGN_TARGET_MAX[n].length -1;
                        }
                        
                        $es.setParamValue('ID_PATCH_ASSIGN_TARGET_MIN', index, searchMin(newValue));
                        $es.setParamValue('ID_PATCH_ASSIGN_TARGET_MAX', index, searchMax(newValue));
                    }
                    break;
                case 'ID_PATCH_MIDI_PC':
                    if ((nowValue != 0) && (newValue == 0)) {
                        $es.setAndChangeParamValue(prmid + '_BANK_LSB', index, 0);
                        $es.setAndChangeParamValue(prmid + '_BANK_MSB', index, 0);
                    }
                    break;
                case 'ID_PATCH_MIDI_PC_BANK_LSB':
                    if ((nowValue == 0) && (newValue != 0)) {
                        var p = prmid.match(/^([A-Z_]+)_BANK_LSB$/)[1];
                        if ($es.getParamValue(p + '_BANK_MSB', index) == 0) $es.setAndChangeParamValue(p + '_BANK_MSB', index, 1);
                        if ($es.getParamValue(p, index) == 0) $es.setAndChangeParamValue(p, index, 1);
                    }
                    break;
                case 'ID_PATCH_MIDI_PC_BANK_MSB':
                    {
                        var p = prmid.match(/^([A-Z_]+)_BANK_MSB$/)[1];
                        if ((nowValue == 0) && (newValue != 0)) {
                            if ($es.getParamValue(p, index) == 0) $es.setAndChangeParamValue(p, index, 1);
                        } else if ((newValue == 0) && (nowValue != 0)) {
                            $es.setAndChangeParamValue(p + '_BANK_LSB', index, 0);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        function IssueElfUpdate(prmid, num, value) {
            //項目の表示切替
            switch (prmid) {
                case 'ID_PATCH_ASSIGN_TARGET':
                    $es.changeParamValue('ID_PATCH_ASSIGN_TARGET_CC_CH', num);
                    $es.changeParamValue('ID_PATCH_ASSIGN_TARGET_CC_NO', num);
                    $es.changeParamValue('ID_PATCH_ASSIGN_TARGET_MIN', num);
                    $es.changeParamValue('ID_PATCH_ASSIGN_TARGET_MAX', num);
                    break;
                case 'ID_PATCH_ASSIGN_SOURCE':
                    $es.changeParamValue('ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER', num);
                    $es.changeParamValue('ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER_CC', num);
                    $es.changeParamValue('ID_PATCH_ASSIGN_INT_PEDAL_TIME', num);
                    $es.changeParamValue('ID_PATCH_ASSIGN_INT_PEDAL_CURVE', num);
                    $es.changeParamValue('ID_PATCH_ASSIGN_WAVE_PEDAL_RATE', num);
                    $es.changeParamValue('ID_PATCH_ASSIGN_WAVE_PEDAL_FORM', num);
                    break;
                case 'ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER':
                    $es.changeParamValue('ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER_CC', num);
                    break;
                case 'ID_PATCH_CTL_FUNC':
                    $es.changeParamValue('ID_PATCH_CTL_MIN', num);
                    $es.changeParamValue('ID_PATCH_CTL_MAX', num);
                    $es.changeParamValue('ID_PATCH_CTL_MOD', num);
                    break;
                case 'ID_PATCH_EXP_FUNC':
                    $es.changeParamValue('ID_PATCH_EXP_MIN', num);
                    $es.changeParamValue('ID_PATCH_EXP_MAX', num);
                    break;
                case 'ID_SYSTEM_CTL_FUNC':
                    $es.changeParamValue('ID_SYSTEM_CTL_MIN', num);
                    $es.changeParamValue('ID_SYSTEM_CTL_MAX', num);
                    $es.changeParamValue('ID_SYSTEM_CTL_MOD', num);
                    break;
                case 'ID_SYSTEM_EXP_FUNC':
                    $es.changeParamValue('ID_SYSTEM_EXP_MIN', num);
                    $es.changeParamValue('ID_SYSTEM_EXP_MAX', num);
                    break;
                default:
                    break;
            }
        }

        var cur = {
             'PATCH': $es.work.patch,
             'SYSTEM': $es.work.system
        };
        var prmid, index;
        if (id.match(/-/)) {
            var reg = id.match(/^(ID_(PATCH|SYSTEM)_[A-Z0-9_]+)-([0-9]+)$/);
            prmid = reg[1];
            index = parseInt(reg[3]);
        } else {
            prmid = id;
            index = 0;
        }
        var oldV = $es.getParamValue(prmid, index);
        var newV = Correct(prmid, index, v);
        $es.setParamValue(prmid, index, newV);
        RepairRelation(prmid, index, newV, oldV);
        IssueElfUpdate(prmid, index, newV);
        if (newV != v) {
            $('#' + id).trigger('elf-update', newV);
        }
    }
    var idLists = [
        'ID_PATCH_MASTER_BPM',
        'ID_PATCH_MIDI_CLOCK_OUT',
        'ID_PATCH_ASSIGN_CATE',
        'ID_PATCH_LOOP_SW_LOOP',
        'ID_PATCH_LOOP_POSITION',
        'ID_PATCH_MIXER_MODE',
        'ID_PATCH_MIXER_GAIN1',
        'ID_PATCH_MIXER_GAIN2',
        'ID_PATCH_CARRY_OVER_LOOP',
        'ID_PATCH_INPUT_SELECT',
        'ID_PATCH_INPUT_BUFFER',
        'ID_PATCH_OUTPUT_SELECT',
        'ID_PATCH_OUTPUT_BUFFER',
        'ID_PATCH_OUTPUT_GAIN',
        'ID_PATCH_CTL1',
        'ID_PATCH_CTL2',
        'ID_PATCH_CTL3',
        'ID_PATCH_CTL4',
        'ID_PATCH_CTL5',
        'ID_PATCH_CTL6',
        'ID_PATCH_EXP1',
        'ID_PATCH_EXP2',
        'ID_PATCH_MASTER_BPM',
        'ID_PATCH_NAME',
        'ID_PATCH_LED_NUM1',
        'ID_PATCH_LED_NUM2',
        'ID_PATCH_LED_NUM3',
        'ID_PATCH_LED_NUM4',
        'ID_PATCH_LED_NUM5',
        'ID_PATCH_LED_NUM6',
        'ID_PATCH_LED_NUM7',
        'ID_PATCH_LED_NUM8',
        'ID_PATCH_LED_BANK_D',
        'ID_PATCH_LED_BANK_U',
        'ID_PATCH_MIDI_TX_CH',
        'ID_PATCH_MIDI_PC_BANK_LSB',
        'ID_PATCH_MIDI_PC_BANK_MSB',
        'ID_PATCH_MIDI_PC',
        'ID_PATCH_MIDI_CTL1_CC',
        'ID_PATCH_MIDI_CTL1_CC_VAL',
        'ID_PATCH_MIDI_CTL2_CC',
        'ID_PATCH_MIDI_CTL2_CC_VAL',
        'ID_PATCH_CTL_FUNC',
        'ID_PATCH_CTL_MIN',
        'ID_PATCH_CTL_MAX',
        'ID_PATCH_CTL_MOD',
        'ID_PATCH_EXP_FUNC',
        'ID_PATCH_EXP_MIN',
        'ID_PATCH_EXP_MAX',
        'ID_PATCH_ASSIGN_SW',
        'ID_PATCH_ASSIGN_SOURCE',
        'ID_PATCH_ASSIGN_MODE',
        'ID_PATCH_ASSIGN_TARGET',
        'ID_PATCH_ASSIGN_TARGET_CC_CH',
        'ID_PATCH_ASSIGN_TARGET_CC_NO',
        'ID_PATCH_ASSIGN_TARGET_MIN',
        'ID_PATCH_ASSIGN_TARGET_MAX',
        'ID_PATCH_ASSIGN_ACT_RANGE_LO',
        'ID_PATCH_ASSIGN_ACT_RANGE_HI',
        'ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER',
        'ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER_CC',
        'ID_PATCH_ASSIGN_INT_PEDAL_TIME',
        'ID_PATCH_ASSIGN_INT_PEDAL_CURVE',
        'ID_PATCH_ASSIGN_WAVE_PEDAL_RATE',
        'ID_PATCH_ASSIGN_WAVE_PEDAL_FORM',
        'ID_PATCH_MIDI_CLOCK_OUT',
        'ID_PATCH_MIDI_TRANSMIT',
        'ID_SYSTEM_CURRENT_NUM',
        'ID_SYSTEM_PANEL_LOCK',
        'ID_SYSTEM_PLAY_OPTION_SW_MODE',
        'ID_SYSTEM_PLAY_OPTION_BANK_CHANGE_MODE',
        'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1',
        'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL2',
        'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL3',
        'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL4',
        'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL5',
        'ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL6',
        'ID_SYSTEM_PLAY_OPTION_BANK_EXTENT_MIN',
        'ID_SYSTEM_PLAY_OPTION_BANK_EXTENT_MAX',
        'ID_SYSTEM_PLAY_OPTION_PATCH_CHANGE_TIME',
        'ID_SYSTEM_PREFERENCE_INPUT_SELECT',
        'ID_SYSTEM_PREFERENCE_INPUT_BUFFER',
        'ID_SYSTEM_PREFERENCE_OUTPUT_SELECT',
        'ID_SYSTEM_PREFERENCE_OUTPUT_BUFFER',
        'ID_SYSTEM_PREFERENCE_LOOP7_RETURN_MODE',
        'ID_SYSTEM_PREFERENCE_LOOP8_RETURN_MODE',
        'ID_SYSTEM_PREFERENCE_VOLUME_LOOP_LIFT',
        'ID_SYSTEM_MIDI_SETTING_MIDI_OUT_MODE',
        'ID_SYSTEM_MIDI_SETTING_RX_CH',
        'ID_SYSTEM_MIDI_SETTING_DEVICE_ID',
        'ID_SYSTEM_MIDI_SETTING_SYNC_CLOCK',
        'ID_SYSTEM_MIDI_SETTING_CLOCK_OUT',
        'ID_SYSTEM_OTHERS_LCD_CONTRAST',
        'ID_SYSTEM_OTHERS_EXP1_POLARITY',
        'ID_SYSTEM_OTHERS_EXP2_POLARITY',
        'ID_SYSTEM_OTHERS_CTL1_POLARITY',
        'ID_SYSTEM_OTHERS_CTL2_POLARITY',
        'ID_SYSTEM_OTHERS_CTL3_POLARITY',
        'ID_SYSTEM_OTHERS_CTL4_POLARITY',
        'ID_SYSTEM_PREFERENCE_MEMORY_MANUAL_SW_MODE',
        'ID_SYSTEM_PREFERENCE_MUTE_BYPASS_SW_MODE',
        'ID_SYSTEM_MEMORY_MANUAL',
        'ID_SYSTEM_CTL_SW',
        'ID_SYSTEM_CTL_FUNC',
        'ID_SYSTEM_CTL_MIN',
        'ID_SYSTEM_CTL_MAX',
        'ID_SYSTEM_CTL_MOD',
        'ID_SYSTEM_EXP_SW',
        'ID_SYSTEM_EXP_FUNC',
        'ID_SYSTEM_EXP_MIN',
        'ID_SYSTEM_EXP_MAX',
        'ID_SYSTEM_MANUAL_NUMBER1',
        'ID_SYSTEM_MANUAL_NUMBER2',
        'ID_SYSTEM_MANUAL_NUMBER3',
        'ID_SYSTEM_MANUAL_NUMBER4',
        'ID_SYSTEM_MANUAL_NUMBER5',
        'ID_SYSTEM_MANUAL_NUMBER6',
        'ID_SYSTEM_MANUAL_NUMBER7',
        'ID_SYSTEM_MANUAL_NUMBER8',
        'ID_SYSTEM_TEMPO_HOLD',
        'ID_SYSTEM_LINK',
        'ID_SYSTEM_PC_MAP_BANK0_PC',
        'ID_SYSTEM_PC_MAP_BANK1_PC',
        'ID_SYSTEM_PC_MAP_BANK2_PC',
        'ID_SYSTEM_PC_MAP_BANK3_PC',
        'ID_SYSTEM_PC_MAP_BANK4_PC',
        'ID_SYSTEM_PC_MAP_BANK5_PC',
        'ID_SYSTEM_PC_MAP_BANK6_PC',
    ];

    var lists = $.map(idLists, function(val, i){
        /* 配列の無いパラメータ群 */
        return '#' + val;
    }) + $.map(idLists, function(val, i) {
        /* 配列付きパラメータ群 */
        return "[id^='" + val + "-']";
    }).join(',');

    $(lists).on('elf-changed', function(e,v) {
        setP(this.id, v);
    });

    function getIndex(prmid) {
        var reg = prmid.match(/^(ID_(PATCH|SYSTEM)_[A-Z0-9_]+)-([0-9]+)$/);
        var index = parseInt(reg[3]);
        return index;        
    }

    function onOff(e, label, compare) {
        if (compare) {
            $(e).show();
            $(label).show();
        } else {
            $(e).hide();
            $(label).hide();
        }
    }
    var assignTargetMidi = [
        "[id^='ID_PATCH_ASSIGN_TARGET_CC_CH-']",
        "[id^='ID_PATCH_ASSIGN_TARGET_CC_NO-']"
    ].join(',');
    $(assignTargetMidi).on('elf-change', function (e, v) {
        var index = getIndex(this.id);
        onOff(this,
            ['#lAssignCcCh' + (index + 1)].join(','),
            $es.getParamValue('ID_PATCH_ASSIGN_TARGET', index) == prmstr.ID_PATCH_ASSIGN_TARGET.indexOf('MIDI'));
    });

    var intTrig = [
        "[id^='ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER-']",
        "[id^='ID_PATCH_ASSIGN_INT_PEDAL_TIME-']",
        "[id^='ID_PATCH_ASSIGN_INT_PEDAL_CURVE-']",
    ].join(',');
    $(intTrig).on('elf-change', function (e, v) {
        var index = getIndex(this.id);
        onOff(this, 
            '#lAssignTrigTimCrv' + (index + 1),
            $es.getParamValue('ID_PATCH_ASSIGN_SOURCE', index) == prmstr.ID_PATCH_ASSIGN_SOURCE.indexOf('INT'));
    });

    $("[id^='ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER_CC-']").on('elf-change', function(e,v){
        var index = getIndex(this.id);
        onOff(this, 
            '#lAssignIntTrigCc' + (index + 1),
            (($es.getParamValue('ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER', index) == prmstr.ID_PATCH_ASSIGN_INT_PEDAL_TRIGGER.indexOf('CC')) &&
            ($es.getParamValue('ID_PATCH_ASSIGN_SOURCE', index) == prmstr.ID_PATCH_ASSIGN_SOURCE.indexOf('INT'))) ||
            ($es.getParamValue('ID_PATCH_ASSIGN_SOURCE', index) == prmstr.ID_PATCH_ASSIGN_SOURCE.indexOf('CC')));
    });

    var wavePedal = [
        "[id^='ID_PATCH_ASSIGN_WAVE_PEDAL_RATE-']",
        "[id^='ID_PATCH_ASSIGN_WAVE_PEDAL_FORM-']"
    ].join(',');
    $(wavePedal).on('elf-change', function(e,v) {
        var index = getIndex(this.id);
        onOff(this, 
            '#lAssignRateForm' + (index + 1),
            $es.getParamValue('ID_PATCH_ASSIGN_SOURCE', index) == prmstr.ID_PATCH_ASSIGN_SOURCE.indexOf('WAV'));
    });

    var assignTarget = [
        "[id^='ID_PATCH_ASSIGN_TARGET_MIN-']",
        "[id^='ID_PATCH_ASSIGN_TARGET_MAX-']"
    ].join(',');
    $(assignTarget).on('elf-change', function(e,v) {
        var index = getIndex(this.id);
        var target = $es.getParamValue('ID_PATCH_ASSIGN_TARGET', index);
        var minMax = (this.id.match('TARGET_MIN')) ? prmstr.ID_PATCH_ASSIGN_TARGET_MIN[target] : prmstr.ID_PATCH_ASSIGN_TARGET_MAX[target];

        modifySelBox(this.id, minMax, v);
    });

    function Ctl(t, str, v) {
        var index = getIndex(t.id);
        var target = $es.getParamValue('ID_' + str + '_CTL_FUNC', index); 
        onOff(t, '', (function(target) {
            switch (target) {
                case prmstr.ID_PATCH_CTL_FUNC.indexOf('Ctl1'):
                case prmstr.ID_PATCH_CTL_FUNC.indexOf('Ctl2'):
                case prmstr.ID_PATCH_CTL_FUNC.indexOf('Ctl3'):
                case prmstr.ID_PATCH_CTL_FUNC.indexOf('Ctl4'):
                case prmstr.ID_PATCH_CTL_FUNC.indexOf('Ctl5'):
                case prmstr.ID_PATCH_CTL_FUNC.indexOf('Ctl6'):
                    return true;
            }
            return false;
        })(target));

        if (t.id.match('CTL_MIN'))
            var minMax = prmstr.ID_PATCH_CTL_MIN[target];
        else if (t.id.match('CTL_MAX'))
            var minMax = prmstr.ID_PATCH_CTL_MAX[target];
        else return;
        
        modifySelBox(t.id, minMax, v);
    }
    function Exp(t, str, v) {
        var index = getIndex(t.id);
        var target = $es.getParamValue('ID_' + str + '_EXP_FUNC', index);
        onOff(t, '', target == prmstr.ID_PATCH_EXP_FUNC.indexOf('BPM'));

        if (t.id.match('EXP_MIN'))
            var minMax = prmstr.ID_PATCH_EXP_MIN[target];
        else if (t.id.match('EXP_MAX'))
            var minMax = prmstr.ID_PATCH_EXP_MAX[target];
        else return;
        modifySelBox(t.id, minMax, v);
    }
    var ctl = [
        "[id^='ID_PATCH_CTL_MIN-']",
        "[id^='ID_PATCH_CTL_MAX-']",
        "[id^='ID_PATCH_CTL_MOD-']",
        "[id^='ID_SYSTEM_CTL_MIN-']",
        "[id^='ID_SYSTEM_CTL_MAX-']",
        "[id^='ID_SYSTEM_CTL_MOD-']"
    ].join(',');
    $(ctl).on('elf-change', function(e,v) {
        var t = this.id.match(/[A-Z_]+_(PATCH|SYSTEM)_[A-Z0-9_-]+/)[1]
        Ctl(this, t, v);
    });
    var exp = [
        "[id^='ID_PATCH_EXP_MIN-']",
        "[id^='ID_PATCH_EXP_MAX-']",
        "[id^='ID_SYSTEM_EXP_MIN-']",
        "[id^='ID_SYSTEM_EXP_MAX-']"
    ].join(',');
    $(exp).on('elf-change', function(e,v) {
        var t = this.id.match(/[A-Z_]+_(PATCH|SYSTEM)_[A-Z0-9_-]+/)[1]
        Exp(this, t, v);
    });

    function modifyCtlSelBox(index) { // index: 1-6
        var id = 'ID_PATCH_CTL' + index;
        var v = $es.getParamValue(id, 0);
        if ($es.getParamValue('ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL' + index, 0) <= 2) {
            modifySelBox(id, ['OFF', 'ON'], v);
        } else {    // TYPE = (TP2 | TP3 | TP4)
            // 0 - 13, 20 - 500 が有効
            var ctl = "OFF, 1/1, 1/2D, 1/1T, 1/2, 1/4D, 1/2T, 1/4, 1/8D, 1/4T, 1/8, 1/16D, 1/8T, 1/16, " +
			"   ,    ,    ,    ,    ,    ," +
			" 20,  21,  22,  23,  24,  25,  26,  27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,  39, " + 
			" 40,  41,  42,  43,  44,  45,  46,  47,  48,  49,  50,  51,  52,  53,  54,  55,  56,  57,  58,  59, " +
			" 60,  61,  62,  63,  64,  65,  66,  67,  68,  69,  70,  71,  72,  73,  74,  75,  76,  77,  78,  79, " +
			" 80,  81,  82,  83,  84,  85,  86,  87,  88,  89,  90,  91,  92,  93,  94,  95,  96,  97,  98,  99, " +
			"100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, " + 
			"120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, " + 
			"140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, " +
			"160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, " +
			"180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, " +
			"200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, " + 
			"220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, " + 
			"240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, " +
			"260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, " +
			"280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, " +
			"300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, " + 
			"320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, " + 
			"340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, " +
			"360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, " +
			"380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, " +
			"400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, " + 
			"420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, " + 
			"440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, " +
			"460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, " +
			"480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, " +
			"500";
            var d = ctl.split(",");
            modifySelBox(id, d, v);
        }
    }

    var ctl = [
        "#ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL1",
        "#ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL2",
        "#ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL3",
        "#ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL4",
        "#ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL5",
        "#ID_SYSTEM_PLAY_OPTION_EXT_CTL_TYPE_CTL6"
    ].join();
    $(ctl).on('elf-changed', function(e,v){
        var index = this.id.match(/[A-Z_]+([0-9]+)/)[1];
        modifyCtlSelBox(index);
    });


    $(lists).on('es-changed', function(e,v) {
        $('#' + this.id).trigger('elf-change', [v, true]);
    });


});
