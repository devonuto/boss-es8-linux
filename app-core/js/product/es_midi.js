/**
 * @file        midi.js
 * @brief       MIDIデバイスの接続・送受信制御
 * @author      umano
 * @date        2016.08.31
 * @copyright   Copyright(c) 2016 Roland Corporation
 */

$(function(){
    LOG_MIDI_IN  = function(msg, type) {
        console.log('#MIDI IN (' + type + '):' + msg);
    };
    LOG_MIDI_OUT = function(msg) {
        console.log('#MIDI OUT:' + msg);
    };
    DEBUG_MIDI = function(msg) {
        console.log('#MIDI DBG:' + msg);
    };
    /**
     * @def
     */
    const MODEL_ID        = ProductSetting.modelId;
    const FAMILY_CODE     = ProductSetting.familyCode;
    const FAMILY_NUMBER   = ProductSetting.familyNumber;

    const MANUFACTURER_ID = ROLAND;         // Manufacturer ID : Roland
    const CMD_DT1         = DT1;         //      commond ID : DT1
    const CMD_RQ1         = RQ1;         //      commond ID : RQ1
    var inputs  = [];                     // MIDI Input  Devices
    var outputs = [];                     // MIDI Output Devices
    const MSG_LEN_SYS = 16;      // System Exclusive Message Length for System
    const MSG_LEN_PAT = 2;      // System Exclusive Message Length for patch
    const MSG_LEN_NAMELIST = 100;
    const MSGID_OFFSET_PAT = 16; // offset to Message ID for 1st patch
    const MSGID_OFFSET_NAMELIST = 32;
    const SIZEOF_SYSEX_HEADER = 7 + 1;
    const SIZEOF_SYSEX_ADRS = 2;

    const NUMOF_NAMELIST_ONE_PACKET = parseInt((8 * 17 + 7) / 16);
    const TIMEOUT_COUNT = 5000; //[[ToDo]] 適切な時間に設定する.

    function sendMidi(msg)
    {
        LOG_MIDI_OUT(msg);
        $native.midi.send(msg);
    }
    /**
     * @brief   MIDIデバイス制御関連の初期化を行う.
     * @param   event   Event Object
     * @note    アプリ起動時に一度だけ実行される.
     */
    function initMidiDevice(event) {
        var midi = $native.midi;
        // MIDIイベントのコールバック関数を設定.
        midi.event.message = eventMidiMessage;
        midi.event.changed = eventMidiChanged;
        midi.event.Connectfailed = eventMidiConnectfailed;
        midi.event.error = eventMidiError;
        // 全デバイスを切断
        midi.input.disconnect();
        midi.output.disconnect();
        // イベントを許可（ポーリングを開始する）
    //   $event.start();
        // デバイス一覧取得
        $es.midi.isConnected = false;
        $es.midi.isFirst = true;
        eventMidiChanged();
    }

    /**
     * @brief   MIDIデバイスとの接続を行う
     * @param   event   Event Object
     * @note    接続状況に変化があったときには true, 維持の場合は falseがかえる
     */
    function connectMidiDevice(event) {
        var num;
        var connectIn = 0;
        var connectOut = 0;

        var e = $('#midiSelectorIn');
        num = parseInt(e.prop('value'));
        if ((num >= 0) && (num < inputs.length)) {
            if (($es.midi.isConnected == true) && ($es.appconfig.input.key == inputs[num].MIDIEntityNameKey) && ($es.appconfig.input.idx == inputs[num].MIDIEndpointIndexKey)) {
                connectIn = 1;
            } else {
                $es.appconfig.input.key = inputs[num].MIDIEntityNameKey;
                $es.appconfig.input.idx = inputs[num].MIDIEndpointIndexKey;
                $native.midi.input.connect(inputs[num]);
                connectIn = 2;
            }
        }

        var e = $('#midiSelectorOut');
        num = parseInt(e.prop('value'));
        if ((num >= 0) && (num < outputs.length)) {
            if (($es.midi.isConnected == true) && ($es.appconfig.output.key == outputs[num].MIDIEntityNameKey) && ($es.appconfig.output.idx == outputs[num].MIDIEndpointIndexKey)) {
                connectOut = 1;
            } else {
                $es.appconfig.output.key = outputs[num].MIDIEntityNameKey;
                $es.appconfig.output.idx = outputs[num].MIDIEndpointIndexKey;
                $native.midi.output.connect(outputs[num]);
                connectOut = 2;
            }
        }
        if ((connectIn > 0) && (connectOut > 0)) {
            $es.midi.isConnected = true;
            if ((connectIn == 1) && (connectOut == 1)) {
                return false;
            }
        } else {
            disconnectMidiDevice();
        }
        return true;
    }

    /**
     * @brief   全MIDIデバイスとの切断を行う
     * @param   event   Event Object
     */
    function disconnectMidiDevice(event) {
        $native.midi.input.disconnect();
        $native.midi.output.disconnect();
        $es.midi.isConnected = false;
    }

    /**
     * @brief   MIDIメッセージの受信を通知する
     * @param   msg         受信メッセージ
     * @param   itemstamp   受信時間
     */
    function eventMidiMessage(msg, timestamp) {
        if (msg == "") return;

        var m = msg.slice(0, 2);
        var mi = parseInt(m, 16);
        if ((mi & 0xf8) == 0xf8) return;            // system real time message

        LOG_MIDI_IN(msg, $es.midi.rcvdat.type);

        switch ($es.midi.rcvdat.type) {
        case 'identify':
            receiveIdentify($es.midi, msg);
            break;
        case 'message':
        case 'none':
            receiveMessage($es.midi, msg);
            break;
        default:
            break;
        }
    }

    /**
     * @brief   MIDIデバイスがシステムに追加・削除されたときに通知する
     */
    function eventMidiChanged() {
        var autoconnect = true;
        inputs  = $native.midi.input.endpoints();
        outputs = $native.midi.output.endpoints();
        var arr = {
            'input': {
                'id' : 'midiSelectorIn',
                'ep' : inputs,
                'dev': $es.appconfig.input.key,
                'idx': $es.appconfig.input.idx,
                'num' : -1,
            },
            'output': {
                'id' : 'midiSelectorOut',
                'ep' : outputs,
                'dev': $es.appconfig.output.key,
                'idx': $es.appconfig.output.idx,
                'num' : -1,
            }
        }
        $.each(arr, function (io, cur) {

            var num = -1;
            for (var i = 0; i < cur.ep.length; i++) {
                if ((cur.ep[i].MIDIDeviceNameKey == cur.dev) && (cur.ep[i].MIDIEndpointIndexKey == cur.idx)) {
                    num = i;
                    cur.num = i;
                }
            }
            var nameList = $.map(cur.ep, function (ep, i) {
                if (ep.MIDIEndpointIndexKey > 0) {
                    return ep.MIDIDeviceNameKey + ' -' + ep.MIDIEndpointIndexKey;
                } else {
                    return ep.MIDIDeviceNameKey;
                }
            });
            nameList.push("(none)");
            modifySelBox(cur.id, nameList, num);
            if (num < 0) {
                $('#' + cur.id).children('p').empty().text('(none)');
                $('.elf-select-box#' + cur.id + '-box a:last-child').attr('checked', 'true');
            }
        });
        if ((arr.input.num >= 0) && (arr.output.num >= 0))  {
            $es.connect();
        } else {
            $es.midi.isConnected = false;
        }
    }

    /**
     * @brief   MIDIエンドポイントお接続に失敗したときに通知する
     * @param   ep      End Point
     */
    function eventMidiConnectfailed(ep) {
        $es.midi.isConnected = false;
        var msg = 'connectfailed: ' + JSON.parse(ep).MIDIDeviceNameKey;
        console.log(msg);
        $es.dialog.openError(msg);
    }

    /**
     * @brief   MIDI通信で通信エラーが発生したときに通知する
     * @param   code    Error Code
     */
    function eventMidiError(code) {
        var msg = 'MIDI ERROR: ' + code;
        console.log(msg);
        $es.dialog.openError(msg);
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * @brief   機器情報を要求する.
     * @note    アイデンティティ・リクエストを送信する.
     */
    function identityRequest(ttt) {
        var msg = "F07E7F0601F7";
        sendMidi(msg);
        ttt.rcvdat.timeid = setTimeout(ttt.rcvdat.reject, TIMEOUT_COUNT, "IDM_READ_TIMEOUT");
    }

    /**
     * @brief   非同期処理によるデータの送信処理部分
     * @param   msg         送信データの文字列配列               (array)
     * @param   resolve     Promiseのresolveコールバック関数     (function)
     * @note    push()からPromiseオブジェクトの実態として呼ばれる.
     *          全メッセージを送信完了したら,resolve()で終了する.
     */
    function sendmsg(msg, resolve) {
        $es.dialog.updateProgress();
        sendMidi(msg[0]);
        msg.shift();
        if (msg.length > 0)
            setTimeout(sendmsg, 80, msg, resolve);
        else {
            setTimeout(function(resolve) {
                resolve();
            }, 80, resolve);
        }
    }

    function type4Header() {
        return STX + MANUFACTURER_ID + deviceId() + MODEL_ID;
    }
    /**
     * @brief   データを要求する.
     * @param   begin       開始位置             (number)
     * @param   end         終了位置             (number)
     * @param   work        ワーク領域への要求   (boolean)
     * @note    位置は,Bulk Dump Message のMessage IDを指定する.
     */
    function dataRequest(ttt, begin, end) {
        var msg = type4Header() + CMD_RQ1;
        var msb = begin >> 7;
        var lsb = begin & 0x7F;
        var sz0 = (end - begin) >> 7;
        var sz1 = (end - begin) & 0x7F;
        var chksum = makeCheckSum(msb, lsb, [sz0, sz1]);
        msg += dec2strhex([msb, lsb, sz0, sz1, chksum]) + EOX;
        sendMidi(msg);
        ttt.rcvdat.timeid = setTimeout(ttt.rcvdat.reject, TIMEOUT_COUNT, "IDM_READ_TIMEOUT");
    }

    /**
     * @brief   指定のパッチ番号への切替えを要求する.
     * @param   num     パッチ番号(0  - NUMOF_PATCH-1)   (number)
     */
    function patchChangeRequest(num) {
        (function(){
            var msg = type4Header() + CMD_DT1 + MIDI_CMD_DISPLAY_MODE + '007F' + chksum(MIDI_CMD_DISPLAY_MODE + '7F') + EOX;
            sendMidi(msg);
        })();
        var bin    = [0x7F, 0x01, num >>> 7, num & 0x7F];
        var sum = makeCheckSum(0, 0, bin);
        var msg    = type4Header() + CMD_DT1 +
                    dec2strhex(bin) + dec2strhex(sum) + EOX ;
        sendMidi(msg);
    }

    /**
     * @brief   Identify Messageの受信処理
     * @param   msg     受信した文字列     (string)
     * @note
     */
    function receiveIdentify(ttt, msg) {
        if (!chooseIdentify(msg))
            return;
        if (verifyIdentify(ttt, msg)) {
            clearTimeout(ttt.rcvdat.timeid);
            ttt.rcvdat.resolve();
        } else {
            ttt.rcvdat.reject("ERROR_VERSION");
        }
    }

    /**
     * @brief   有効のメッセージを選択する
     * @return      true：有効, false:無効
     * @note    Header, Manufacturer ID, Model ID, Device ID, Footer が一致すること.
     */
    function chooseIdentify(msg) {
        var header1 = 'F07E';
        var header = '0602' + MANUFACTURER_ID + FAMILY_CODE + FAMILY_NUMBER;
        var h1 = msg.substr(0, header1.length);
        var h2 = msg.substr(3 * 2, header.length);
        if ((h1 === header1) && (h2 === header) && (msg.slice(-2) === EOX)) {
            $es.midi.deviceIdNum = parseInt(msg.substr(4, 2), 16);
            return true;
        } else {
            return false;
        }
    }

    /**
     * @brief   IndentifyMessageが一致するか確認する
     * @param   msg     受信した文字列     (string)
     */
    function verifyIdentify(ttt, msg) {
        ttt.rcvdat.ver   = parseInt((msg.slice(-10, -8), 16) << 7) + parseInt(msg.slice(-8, -6), 16);
        ttt.rcvdat.build = parseInt((msg.slice( -6, -4), 16) << 7) + parseInt(msg.slice(-4, -2), 16);
        if (ttt.rcvdat.ver >= 100)
            return true;
        else
            return false;
    }

    /**
     * @brief   System Exclusive Messageの受信処理
     * @param   msg     受信した文字列     (string)
     * @note
     */
    function receiveMessage(ttt, msg) {
        if (!chooseMessage(msg))
            return;
        if (msg.slice(14, 16) !== CMD_DT1) return;
        if (!verifyMessage(msg)) {
            ttt.rcvdat.reject("ERROR_CHECKSUM");
            return;
        }
        var msgid = dec2strhex([ttt.rcvdat.next >>> 7, ttt.rcvdat.next % 0x80]);
        if (ttt.rcvdat.type == 'message') {
            if (msg.slice(16, 20) !== msgid) {
                return;
            } else {
                clearTimeout(ttt.rcvdat.timeid);
                ttt.rcvdat.msg = ttt.rcvdat.msg.concat(msg);
                ttt.rcvdat.next++;
                $es.dialog.updateProgress();
                if (ttt.rcvdat.next > ttt.rcvdat.end)
                    ttt.rcvdat.resolve();
                else
                    ttt.rcvdat.timeid = setTimeout(ttt.rcvdat.reject, TIMEOUT_COUNT, "IDM_READ_TIMEOUT");
            }
        } else {
            if (msg.slice(16, 18) == '7F') {
                var id = strhex2dec(msg.slice(18, 20))[0];
                var num = strhex2dec(msg.slice(20, 24));
                num = num[0] * 128 + num[1];
                switch (id) {
                    case 1: // PATCH change
                        $es.patchChangeRequest(num);
                        break;
                    case 2: // WRITE
                        break;
                }
            }
        }
    }

    /**
     * @brief   有効のメッセージを選択する
     * @return      true：有効, false:無効
     * @note    Header, Manufacturer ID, Model ID, Device ID, Footer が一致すること.
     */
    function chooseMessage(msg) {
        var MSG_HEAD  = type4Header();
        if (msg.slice(0, 14) === MSG_HEAD && msg.slice(-2) === EOX)
            return true;
        else
            return false;
    }

    /**
     * @brief   チェックサムを行う
     * @param   msg     受信した文字列     (string)
     * @return          true:一致, false:不一致
     */
    function verifyMessage(msg) {
        var bin    = strhex2dec(msg.slice(16, -4));
        var chksum = makeCheckSum(0, 0, bin);
        var calcsum = strhex2dec(msg.slice(-4, -2))[0];
        if (chksum === calcsum)
            return true;
        else {
            console.log("SUM ERROR:" + chksum + ':' + calcsum);
            return false;
        }
    }

    /**
     * @brief   受信したシステムデータを解析する
     * @param   str     受信した文字列の配列     (array[string])
     * @retrun          システムオブジェクト     (system)
     */
    function parseSystem(str) {
        var bin = new Array(str.length >> 1);
        var dex1, dex2;
        for (var i = 0; i < str.length; i += 2) {
            dex1 = decode7bit(strhex2dec(str[i    ].slice(20, -4)));
            dex2 = decode7bit(strhex2dec(str[i + 1].slice(20, -4)));
            bin[i >> 1] = dex1.concat(dex2);
        }
        return binary2System(bin);
    }

    /**
     * @brief   受信したパッチデータを解析する
     * @param   str     受信した文字列の配列     (array[string])
     * @return          パッチオブジェクト       (patch)
     */
    function parsePatch(str) {
        var dex1  = decode7bit(strhex2dec(str[0].slice(20, -4)));
        var dex2  = decode7bit(strhex2dec(str[1].slice(20, -4)));
        var bin   = dex1.concat(dex2);
        var msgid = strhex2dec(str[0].slice(16, 20));
        var num   = Math.floor((msgid[0] * 0x80 + msgid[1] - MSGID_OFFSET_PAT) / MSG_LEN_PAT);
        return {'num': num, 'prm': binary2Patch(bin)};
    }

    function parseNameList(str) {
        var retArray = [];
        var adr1  = strhex2dec(str.slice(SIZEOF_SYSEX_HEADER * 2, SIZEOF_SYSEX_HEADER * 2 + 2 * 2));
        var adr = ((adr1[0] - MSGID_OFFSET_NAMELIST) << 7) + adr1[1];
        var num = adr * NUMOF_NAMELIST_ONE_PACKET;
        const top = (SIZEOF_SYSEX_HEADER + 2) * 2;
        var contentsLength = (str.length - (SIZEOF_SYSEX_HEADER + 2 + 1 + 1) * 2) / 2;
        var patchNum = parseInt(contentsLength / 16);
        for (var i = 0; i < patchNum; i++) {
            var name = "";
            var ch = strhex2dec(str.slice(top + i * 16 * 2, top + i * 16 * 2 + 16 * 2));
            var name = byte2String(ch);
            var ret = {'num': num + i, 'name': name};
            retArray.push(ret);
        }
        return retArray;
    }

    /**
     * @brief   システムパラメータをMIDIで送信する.
     * @param   iswork      ワーク領域を使うか   (boolean)
     * @return              送信する文字列の配列  (array[string])
     */
    function sendSystem(iswork) {
        var bin   = system2Binary(iswork);
        var sysEx = [];
        for (var i = 0; i < bin.length; i++) {
            var num = i * 2;
            var msg1 = encode7bit(bin[i].slice(0, 125));
            var msg2 = encode7bit(bin[i].slice(125));
            // 開始と各IDとページ番号を追加
            sysEx[num] = type4Header() + CMD_DT1 + dec2strhex([0, num]);
            sysEx[num + 1] = type4Header() + CMD_DT1 + dec2strhex([0, num + 1]);
            // データを追加
            for (var j = 0; j < 143; j++) {
                sysEx[num] += j < msg1.length ? dec2strhex(msg1[j]) : "00";
                sysEx[num + 1] += j < msg2.length ? dec2strhex(msg2[j]) : "00";
            }
            // チェックサムと終了を追加
            sysEx[num] += dec2strhex(makeCheckSum(0, num, msg1)) + EOX;
            sysEx[num + 1] += dec2strhex(makeCheckSum(0, num + 1, msg2)) + EOX;
        }
        return sysEx;
    }

    /**
     * @brief   パッチパラメータをMIDIで出力する.
     * @param   num         パッチ番号               (number)
     * @param   iswork      ワーク領域を使用するか   (boolean)
     * @return              送信する文字列の配列     (array[string])
     */
    function sendPatch(num, iswork) {
        var msgid  = num * MSG_LEN_PAT + MSGID_OFFSET_PAT;
        var msb    = (msgid) >>> 7;
        var lsb    = (msgid) & 0x7F;
        var sysEx1 = type4Header() + CMD_DT1 + dec2strhex([msb, lsb]) ;
        var sysEx2 = type4Header() + CMD_DT1 + dec2strhex([msb, lsb + 1]);

        var bin = patch2Binary(num, iswork);
        var msg1 = encode7bit(bin.slice(0,125));
        var msg2 = encode7bit(bin.slice(125));

        for (var i = 0; i < msg1.length; i++) {
            sysEx1 += dec2strhex(msg1[i]);
            sysEx2 += i < msg2.length ? dec2strhex(msg2[i]) : "00";
        }
        sysEx1 += dec2strhex(makeCheckSum(msb, lsb, msg1)) + EOX;
        sysEx2 += dec2strhex(makeCheckSum(msb, lsb + 1, msg2)) + EOX;
        return [sysEx1, sysEx2];
    }

    function shapeParameter(arr, info)
    {
        var v;
        switch(typeof info) {
        case "number":
            v = arr[0];
            break;
        case "string":
            v = byte2String(arr);
            break;
        case "object":  // Array
            v = arr.concat();
            break;
        default:
            throw new Error("Error in binary2Patch().\n");
        }
        return v;
    }
    /**
     * @brief   バイナリ配列をシステムデータに変換する.
     * @param   bin     バイナリ配列                  (array)
     * @return          変換したシステムオブジェクト  (system)
     * @note    バイナリ配列には8bitデータ配列である必要がある.
     */
    function binary2System(bin) {
        var cur = new system();
        try {
            for (var prm in cur) {
                var binN;
                switch (prm) {
                case "ID_SYSTEM_PC_MAP_BANK0_PC": binN = 1; break;
                case "ID_SYSTEM_PC_MAP_BANK1_PC": binN = 2; break;
                case "ID_SYSTEM_PC_MAP_BANK2_PC": binN = 3; break;
                case "ID_SYSTEM_PC_MAP_BANK3_PC": binN = 4; break;
                case "ID_SYSTEM_PC_MAP_BANK4_PC": binN = 5; break;
                case "ID_SYSTEM_PC_MAP_BANK5_PC": binN = 6; break;
                case "ID_SYSTEM_PC_MAP_BANK6_PC": binN = 7; break;
                default:                          binN = 0; break;
                }
                var arr = binary2Parameter(bin[binN], prm);
                cur[prm] = shapeParameter(arr, cur[prm]);
            }
        }
        catch (e) {
            DEBUG_MIDI(e);
        }
        return cur;
    }

    /**
     * @brief   バイナリ配列をパッチデータに変換する.
     * @param   bin     バイナリ配列                  (array)
     * @return          変換したパッチオブジェクト    (patch)
     * @note    バイナリ配列には8bitデータ配列である必要がある.
     */
    function binary2Patch(bin) {
        var cur = new patch();
        try {
            for (var prm in cur) {
                var arr = binary2Parameter(bin, prm);
                cur[prm] = shapeParameter(arr, cur[prm]);
            }
        }
        catch (e) {
            DEBUG_MIDI(e);
        }
        return cur;
    }

    /**
     * @brief   バイナリ配列からパラメータ情報をもとにパラメータ値をデコードする.
     * @param   bin     バイナリ配列              (array)
     * @param   prm     パラメータ名               (string)
     * @return          パラメータ値のバイト配列   (array)
     * @note    パラメータが配列でない場合,配列要素数1の配列に格納し返す.
     *          パラメータが有効範囲を超えた場合,初期値に補正する.
     */
    function binary2Parameter(bin, prm) {
        var byteOff = prmdb[prm].byteOff;
        var bitOff  = prmdb[prm].bitOff;
        var bit     = prmdb[prm].bit;
        var min     = prmdb[prm].min;
        var max     = prmdb[prm].max;
        var def     = prmdb[prm].def;
        var arr     = prmdb[prm].arr;
        var cur     = [];
        var upper, lower, i = 0;
        do {
            if (bitOff + bit > 8) {
                // バイトを跨ぐ場合
                upper = 8 - bitOff;
                lower = bit - upper;
                cur[i] = (bin[byteOff] & bitFilter(upper)) << lower
                    | (bin[byteOff + 1] >> 8 - lower) & bitFilter(lower);
            } else {
                // バイトを跨がない場合
                cur[i] = (bin[byteOff] >> 8 - bitOff - bit) & bitFilter(bit);
            }
            // パラメータ値の確認
            if (min > cur[i] || max < cur[i]) {
                DEBUG_MIDI("[ERROR] binary2Parameter() | " + prm + " cur[" + i + "]=" + cur[i] + ", min=" + min + ", max=" + max);
                cur[i] = def;
            }
            // 次要素のオフセット位置を調整
            bitOff += bit;
            if (bitOff >= 8) {
                byteOff += Math.floor(bitOff / 8);
                bitOff = bitOff % 8;
            }
            i++;
        } while (i < arr);
        return cur;
    }

    /**
     * @brief   システムパラメータのバイナリ配列を生成する.
     * @param   iswork      ワーク領域を使うか       (bllean)
     * @return              2次元バイナリ配列        (array)
     * @note    8bitデータのままなので,SysExとして使用するには
     *          7bit EncodeとSysEx用のヘッダ,フッタの付加が必要.
     */
    function system2Binary(iswork) {
        var cur  = !!iswork ? $es.work.system : $es.container.system;
                //  0,  1,  2,  3,  4,  5,  6,  7
        var bin = [[], [], [], [], [], [], [], []];

        for (var prm in cur) {
            switch(prm) {
            case "ID_SYSTEM_PC_MAP_BANK0_PC": parameter2binary(prm, cur[prm], bin[1]); break;
            case "ID_SYSTEM_PC_MAP_BANK1_PC": parameter2binary(prm, cur[prm], bin[2]); break;
            case "ID_SYSTEM_PC_MAP_BANK2_PC": parameter2binary(prm, cur[prm], bin[3]); break;
            case "ID_SYSTEM_PC_MAP_BANK3_PC": parameter2binary(prm, cur[prm], bin[4]); break;
            case "ID_SYSTEM_PC_MAP_BANK4_PC": parameter2binary(prm, cur[prm], bin[5]); break;
            case "ID_SYSTEM_PC_MAP_BANK5_PC": parameter2binary(prm, cur[prm], bin[6]); break;
            case "ID_SYSTEM_PC_MAP_BANK6_PC": parameter2binary(prm, cur[prm], bin[7]); break;
            default:                          parameter2binary(prm, cur[prm], bin[0]); break;
            }
        }
        return bin;
    }

    /**
     * @brief   パッチパラメータのバイナリ配列を生成する.
     * @param   num         パッチ番号           (number)
     * @param   iswork      ワーク領域を使うか   (boolean)
     * @return              バイナリ配列         (array)
     * @note    8bitデータのままなので,SysExとして使用するには
     *          7bit EncodeとSysEx用のヘッダ,フッタの付加が必要.
     *          方式は,MSBからのビット詰め.
     */
    function patch2Binary(num, iswork) {
        var cur = !!iswork ? $es.work.patch : $es.container.patch[num];
        var bin = [];

        for (var prm in cur) {
            // パラメータをバイナリ配列に格納
            parameter2binary(prm, cur[prm], bin);
        }
        return bin;
    }

    /**
     * @brief   パラメータをバイナリ値に変換する
     * @param   prm     パラメータID      (string)
     * @param   val     パラメータ値      (any)
     * @param   bin     バイナリ配列      (array)
     * @note    引数のObjectは参照渡しとなるため,binには直接書込み可能.
     */
    function parameter2binary(prm, val, bin) {
        var byteOff = prmdb[prm].byteOff;
        var bitOff  = prmdb[prm].bitOff;
        var bit     = prmdb[prm].bit;
        var arr     = prmdb[prm].arr;
        var upper, lower, cur, i = 0;

        do {
            cur = arr > 0 ? val[i] & bitFilter(bit) : val & bitFilter(bit);
            if (bitOff + bit > 8) {
                //byteを跨ぐ場合
                upper = 8 - bitOff;
                lower = bit - upper;
                bin[byteOff]     |= cur >>> lower & bitFilter(upper);
                bin[byteOff + 1] |= (cur & bitFilter(lower)) << 8 - lower;
            } else {
                //byteを跨がない場合
                bin[byteOff] |= cur << 8 - bit - bitOff;
            }
            //次要素のオフセット位置を調整
            bitOff += bit;
            if (bitOff >= 8) {
                byteOff += Math.floor(bitOff / 8);
                bitOff = bitOff % 8;
            }
            i++;
        } while (i < arr);
    }

    /**
     * @brief   7bitエンコード処理を行う.
     * @param   arr     処理対象の整数配列.          (array)
     * @return          7bitエンコード結果を返す.    (array)
     */
    function encode7bit(arr) {
        var cnv = [];
        for (var i = 0, j = 0, offset = 1; i < arr.length; i++) {
            cnv[j + offset] = arr[i] & 0x7F;
            cnv[j] |= (arr[i] & 0x80) >>> offset;
            if (offset == 7) {
                offset = 1;
                j += 8;
            } else {
                offset++;
            }
        }
        return cnv;
    }

    /**
     * @brief   7bitデコード処理を行う.
     * @param   arr     処理対象のバイナリ配列     (array)
     * @return          7bitデコード結果を返す.    (array)
     */
    function decode7bit(arr) {
        var len = arr.length - Math.ceil(arr.length / 8);
        var cnv = [];
        for (var i = 0, n= 0, offset = 1; i < len; i++) {
            cnv[i] = arr[n + offset] | (arr[n] << offset & 0x80);
            if (offset == 7) {
                offset = 1;
                n += 8;
            } else {
                offset++;
            }
        }
        return cnv;
    }

    /**
     * @brief   チェックサムを生成する.
     * @param   msb    メッセージID MSB             (number)
     * @param   lsb    メッセージID LSB             (number)
     * @param   bin    送信データ部のバイナリ配列   (array)
     * @return         チェックサム値               (number)
     * @note    sumは実数型として扱われる.整数の保証精度は下記の通り.
     *          -2^53 (-9,007,199,254,740,992) ～　2^53 (9,007,199,254,740,992)
     *          今回の仕様では,保証精度を超えることはありえない.
     */
    function makeCheckSum (msb, lsb, bin) {
        var sum = msb + lsb;
        for (var i = 0; i < bin.length; i++) {
            sum = sum + bin[i];
        }
        return (~sum + 1) & 0x7F;
    }

    /**
     * @brief   デバイスIDの16進数文字列を返す.
     * @return  デバイスIDの16進数文字列      (string)
     * @note    ワーク領域のシステムパラメータから取得したデバイスIDを使用する.
     */
    function deviceId() {
        return dec2strhex($es.midi.deviceIdNum);
        // return dec2strhex($es.work.system.ID_SYSTEM_MIDI_SETTING_DEVICE_ID);
    }
	function chksum(msg) {
		var sum = 0;
		for (var i = 0, len = msg.length; i < len; i += 2) {
			sum += parseInt(msg.substr(i, 2), 16);
		}
		sum = (128 - (sum % 128)) & 0x7f;
		return hex2(sum);
	}
    const MIDI_CMD_DISPLAY_MODE = "7F03";
    const MIDI_CMD_INITIALIZE = "7F21";
    const MIDI_CMD_COPY = "7F22";
    const MIDI_CMD_EXCHANGE = "7F23";
    const MIDI_CMD_SET_NAME = "7F24";
    const MIDI_CMD_EDITOR_MODE = "7F50";
    const MIDI_CMD_PARAMETER_SRC = "7F60";
    const MIDI_CMD_PARAMETER_NAME1 = "7F70";
    const MIDI_CMD_PARAMETER_NAME2 = "7F71";
    const MIDI_CMD_PARAMETER_NAME3 = "7F72";
    const MIDI_CMD_PARAMETER_NAME4 = "7F73";
    const MIDI_CMD_PARAMETER_NAME5 = "7F74";
    const MIDI_CMD_PARAMETER_NAME6 = "7F75";
    const MIDI_CMD_PARAMETER_NAME7 = "7F76";
    const MIDI_CMD_PARAMETER_NAME8 = "7F77";
    const MIDI_CMD_PARAMETER_NAME9 = "7F78";
    const MIDI_CMD_PARAMETER_NAME10 = "7F79";
    const MIDI_CMD_PARAMETER_NAME11 = "7F7A";
    const MIDI_CMD_PARAMETER_NAME12 = "7F7B";
    const MIDI_CMD_PARAMETER_NAME13 = "7F7C";
    const MIDI_CMD_PARAMETER_NAME14 = "7F7D";
    const MIDI_CMD_PARAMETER_NAME15 = "7F7E";
    const MIDI_CMD_PARAMETER_NAME16 = "7F7F";
    
    function midi() {
        this.isConnected = false;
        this.rcvdat = {'type': 'none'};
        this.deviceIdNum = 0;
    }
    midi.prototype = {
        init: function() { initMidiDevice(); },
        deviceId: function() { return deviceId(); },
        patchChangeRequest: function(num) { patchChangeRequest(num); },
        connect: function() { return connectMidiDevice(); },
        disconnect: function() { disconnectMidiDevice(); },
        getTopOffsetOfPatch: function(num) { return (MSGID_OFFSET_PAT + (num << 1)); },
        getSizeOfSystem: function() { return MSG_LEN_SYS;},
        getSizeOfPatch: function() { return MSG_LEN_PAT;},
        getSizeOfNameList: function() { return MSG_LEN_NAMELIST;},
        getNumOfNameListInOnePacket: function() { return NUMOF_NAMELIST_ONE_PACKET;},
        issueIdentityRequest: function() { identityRequest(this);},
        issueDataRequest: function(begin, end) { dataRequest(this, begin, end); },
        parseSystem: function(str) { return parseSystem(str); },
        parsePatch: function(str) { return parsePatch(str); },
        parseNameList: function(str) { return parseNameList(str);},
        sendSystem: function(isWork) { return sendSystem(isWork); },
        sendPatch: function(num, isWork) { return sendPatch(num, isWork); },
        sendMessage: function(msg, resolv) { sendmsg(msg, resolv); },
        getNum: function (msg) {
            var msb = strhex2dec(msg.slice(16, 18));
            var lsb = strhex2dec(msg.slice(18, 20));
            return (msb << 7) + lsb;
        },
        isConnect: function() { return this.isConnected; },
        copyPatch: function(target, src) {
            var srcAdr = dec2strhex([(src >> 7) & 0x7f, (src & 0x7f)]);
            var targetAdr = dec2strhex([(target >> 7) & 0x7f, (target & 0x7f)]);
            var msg = type4Header() + CMD_DT1 + MIDI_CMD_PARAMETER_SRC + srcAdr + chksum(MIDI_CMD_PARAMETER_SRC + srcAdr) + EOX;
            sendMidi(msg);
            msg = type4Header() + CMD_DT1 + MIDI_CMD_COPY + targetAdr + chksum(MIDI_CMD_COPY + targetAdr) + EOX;
            sendMidi(msg);
            
            this.rcvdat.timeid = setTimeout(this.rcvdat.reject, TIMEOUT_COUNT, "IDM_READ_TIMEOUT");
        },
        exchangePatch: function(target, src) {
            var srcAdr = dec2strhex([(src >> 7) & 0x7f, (src & 0x7f)]);
            var targetAdr = dec2strhex([(target >> 7) & 0x7f, (target & 0x7f)]);
            var msg = type4Header() + CMD_DT1 + MIDI_CMD_PARAMETER_SRC + srcAdr + chksum(MIDI_CMD_PARAMETER_SRC + srcAdr) + EOX;
            sendMidi(msg);
            msg = type4Header() + CMD_DT1 + MIDI_CMD_EXCHANGE + targetAdr + chksum(MIDI_CMD_EXCHANGE + targetAdr) + EOX;
            sendMidi(msg);
            
            this.rcvdat.timeid = setTimeout(this.rcvdat.reject, TIMEOUT_COUNT, "IDM_READ_TIMEOUT");

        },
        initPatch: function(target) {
            var targetAdr = dec2strhex([(target >> 7) & 0x7f, (target & 0x7f)]);
            var msg = type4Header() + CMD_DT1 + MIDI_CMD_INITIALIZE + targetAdr + chksum(MIDI_CMD_INITIALIZE + targetAdr) + EOX;
            sendMidi(msg);
            
            this.rcvdat.timeid = setTimeout(this.rcvdat.reject, TIMEOUT_COUNT, "IDM_READ_TIMEOUT");
        },
        setPatchName: function(target, name) {
            var targetAdr = dec2strhex([(target >> 7) & 0x7f, (target & 0x7f)]);
            var msg;
            const nameAdr = [
                MIDI_CMD_PARAMETER_NAME1,
                MIDI_CMD_PARAMETER_NAME2,
                MIDI_CMD_PARAMETER_NAME3,
                MIDI_CMD_PARAMETER_NAME4,
                MIDI_CMD_PARAMETER_NAME5,
                MIDI_CMD_PARAMETER_NAME6,
                MIDI_CMD_PARAMETER_NAME7,
                MIDI_CMD_PARAMETER_NAME8,
                MIDI_CMD_PARAMETER_NAME9,
                MIDI_CMD_PARAMETER_NAME10,
                MIDI_CMD_PARAMETER_NAME11,
                MIDI_CMD_PARAMETER_NAME12,
                MIDI_CMD_PARAMETER_NAME13,
                MIDI_CMD_PARAMETER_NAME14,
                MIDI_CMD_PARAMETER_NAME15,
                MIDI_CMD_PARAMETER_NAME16,
            ];
            for (var i = 0; i < 16; i++) {
                var n;
                if (i >= name.length) {
                    n = ' ';
                } else {
                    n = name[i];
                }
                var nameStr = "00" + dec2strhex(n.charCodeAt(0));
                msg = type4Header() + CMD_DT1 + nameAdr[i] + nameStr + chksum(nameAdr[i] + nameStr) + EOX;
                sendMidi(msg);
            }

            msg = type4Header() + CMD_DT1 + MIDI_CMD_SET_NAME + targetAdr + chksum(MIDI_CMD_SET_NAME + targetAdr) + EOX;
            sendMidi(msg);

            this.rcvdat.timeid = setTimeout(this.rcvdat.reject, TIMEOUT_COUNT, "IDM_READ_TIMEOUT");

        },
        setEditorMode: function(t) {
            var msg = type4Header() + CMD_DT1 + MIDI_CMD_EDITOR_MODE + t + chksum(MIDI_CMD_EDITOR_MODE + t) + EOX;
            sendMidi(msg);
        },
    }
    $es.midi = new midi();
});
