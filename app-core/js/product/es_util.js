/**
 * @file        util.js
 * @brief       共通ツール
 * @author      umano
 * @date        2016.08.31
 * @copyright   Copyright(c) 2016 Roland Corporation
 */

/**
 * @brief   文字列をバイト配列に変換する
 * @param   str     文字列           (string)
 * @param   num     バイト配列長     (number)
 * @return          バイト配列       (array)
 * @note    変換対象はASCIIコードの範囲のみ
 *          numが有効の場合,numまで変換する.
 *          文字列がnumより短い場合,スペース(0x20)で補完する.
 */
function string2byte(str, num) {
    var arr = [];
    var len = num != undefined ? num : str.length;
    for (var i = 0; i < len; i++) {
        if (str.length > i)
            arr[i] = str.charCodeAt(i);
        else
            arr[i] = 0x20;
    }
    return arr;
}

/**
 * @brief   バイト配列をUTF-8の文字列に変換する
 * @param   arr     バイト配列                       (array)
 * @return          バイト配列から変換した文字列     (string)
 * @note    1バイトで表現可能なASCIIコードのみ考慮.
 *          2バイト以上の文字コードは非対応.
 */
function byte2String(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
    }
    return str;
}

/**
 * @brief   整数を入力すると文字列の16進数 2桁を返す.
 * @param   bin     変換したい整数(0 <= num <= 127)またはその配列
 * @return          文字列の16進数 2桁
 * @note    ブラウザーのロケーション設定がトルコだと
 *          toLowerCase,toUpperCaseが正しい結果を返さない問題あり
 *          ただし'i'および'I'が対象のため対策は不要
 */
function dec2strhex (bin) {
    var str = "";
    if (typeof bin === "number") {
        str = (bin >>> 4 & 0x0F).toString(16) + (bin & 0x0F).toString(16);
    } else if (bin instanceof Array && typeof bin[0] === "number") {
        for (var i = 0; i < bin.length; i++) {
            str += (bin[i] >>> 4 & 0x0F).toString(16) + (bin[i] & 0x0F).toString(16);
        }
    }
    return str.toUpperCase();
}

/**
 * @brief 文字列の16進数を入力すると整数配列に変換して返す.
 * @param   str    変換したい16進数の文字列   (string)
 * @return         変換した整数配列            (array)
 */
function strhex2dec (str) {
    if (str.length % 2 != 0)
        return undefined;
    var bin = new Array(str.length / 2);
    for (var i = 0; i < str.length; i += 2) {
        bin[i >>> 1] = parseInt(str.slice(i, i + 2), 16);
    }
    return bin;
}

/**
 * @brief   ビットフィルタを生成する.
 * @param   num    生成するビットフィルタ長を指定する.   (number)
 * @return         生成したビットフィルタを返す.          (number)
 * @note    LSBから指定ビット数分のフィルタを生成する.
 */
function bitFilter(num) {
    var filter = 0;
    for (var i = 0; i < num; i++) {
        filter |= 1 << i;
    }
    return filter;
}

/**
 * @brief   elf-select-boxの選択肢を任意の文字列配列と置き換える
 * @param   prmid   ターゲットのprmid ( ex. ID_PATCH_CTL_FUNC )
 * @param   nameList    文字列テーブル
 * @param   num     設定したい値( num番目を選択状態にする )
 * @note    
 */
function modifySelBox(prmid, nameList, num) {
    function listup(i, name) {
        var e = $('<a></a>', { href: "#", "class": "elf-select-box-option-control", text: name });
        if (i == num) {
            e.attr('checked', 'true');
        }
        return e;
    }
    var elem = $('#' + prmid + '-box');
    elem.empty();
    elem.append($.map(nameList, function (str, i) {
        return listup(i, str);
    }));
    elem.val(num);
    var id = $('#' + prmid);
    id.val(num);
    id.children('p').empty().text(nameList[num]);
}



/**
 * @brief   デバッグ情報出力
 * @param   arg     arguments
 * @note    [debug] functionName (argument....)
 */
function DEBUG(arg) {
    var exp = arg.callee.toString().match(/^function ([a-zA-Z0-9_]+)/)
    var str = exp[1];
    str += "(";
    for (i in arg) {
        str += i == 0 ? arg[i] : ", " + arg[i];
    }
    str +=")";
    console.log("[debug] " + str);
}

