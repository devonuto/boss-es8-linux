/**
 * @file        api.js
 * @brief       提供API
 * @author      umano
 * @date        2016.10.13
 * @copyright   Copyright(c) 2016 Roland Corporation
 */
(function (window) {

    var _es = (function() {
        var es = function() {
            // constractor

            /**
             * @brief   ワーク領域
             * @note    各エディット画面で直接操作するパラメータ群
             *          ロード・セーブ時にcontainerに保存される
             */
            this.work = {
                'target': 0,
                'save' : 0,
                'system': new system(),
                'patch': new patch(),
                'pull': {
                    'from': 0,
                    'to': NUMOF_PATCH,
                },
                'push': {
                    'from': 0,
                    'to': NUMOF_PATCH,
                },
            };

            function midiDevice() {
                this.key = "";
                this.idx = 0;
            };

            /**
             * @brief   アプリケーションの設定情報
             * @note    レジストリに保存される
             */
            this.appconfig = new function () {
                this.input = new midiDevice();
                this.output = new midiDevice();
                this.path   = $native.fs.path("documents") + ProductSetting.name;
                this.file   = "default." + ProductSetting.extension;
            };
            /**
             * @brief   エディット情報
             * @note    appconfig.path に appconfig.file として保存される.
             */
            this.container = new newContainer();
        }
        function newContainer()
        {
            this.target = 'ES-8';
            this.format = 100;
            this.system = new system();
            this.patch  = [];
            for (var i = 0; i < NUMOF_PATCH; i++) {
                this.patch[i] = new patch();
            }
        }
        function issueAllParameterChange(t, obj)
        {
            for (var prmid in obj) {
                var arr = prmdb[prmid].arr;
                for (var i = 0; i < arr || i == 0; i++)
                    t.changeParamValue(prmid, i);
            }
            
        }
        function compare(work, container) {
            var workS = JSON.stringify(work);
            var containerS = JSON.stringify(container);
            var cmp = ( workS != containerS);
            return cmp;
        }
        es.prototype = {
            getNewContainer: function () {
                return new newContainer();
            },
            /**
             * @brief   システムパラメータをコンテナ領域からワーク領域にコピーする
             */
            loadSystem: function () {
                $.extend(true, this.work.system, this.container.system);
                this.changeSystem();
            },
            /**
             * @brief   システムパラメータをワーク領域からコンテナ領域にコピーする
             */
            saveSystem: function () {
                $.extend(true, this.container.system, this.work.system);
            },
            /**
             * @brief   システムパラメータを初期化する
             */
            clearSystem: function () {
                this.container.system = new system();
            },


            /**
             * @brief   パッチをコンテナ領域からワーク領域にコピーする
             * @param   num     コピー元のパッチ番号
             */
            loadPatch: function (num, isSend) {
                this.work.target = num;
                $.extend(true, this.work.patch, this.container.patch[num]);
                if (isSend)
                    this.midi.patchChangeRequest(num);
                this.changePatch(num);
            },
            /**
             * @brief   パッチをワーク領域からコンテナ領域にコピーする
             * @param   num     コピー先のパッチ番号
             */
            savePatch: function (num) {
                $.extend(true, this.container.patch[num], this.work.patch);
            },
            /**
             * @brief   パッチを初期化する
             * @param   num     初期化先のパッチ番号
             */
            clearPatch: function (num) {
                this.container.patch[num] = new patch();
            },
            /**
             * @brief   コンテナ領域のパッチの順番を入れ替える
             * @param   num1    対象のパッチ番号　1つ目
             * @param   num2    対象のパッチ番号　2つ目
             */
            exchangePatch: function (num1, num2) {
                var tmp;
                $.extend(true, tmp, this.container.patch[num1]);
                $.extend(true, this.container.patch[num1], this.container.patch[num2]);
                $.extend(true, this.container.patch[num2], tmp);
                if (this.work.target == num1)
                    this.midi.patchChangeRequest(num2);
                else if (this.work.target == num2)
                    this.midi.patchChangeRequest(num1);
            },
            /**
             * @brief   パラメータIDに値を設定する
             * @name    setParamValue
             * @param   prmid       パラメータID
             * @param   num         パラメータIDの要素番号
             * @param   value       設定値
             * @param   diff        設定値を差分として扱う
             * @note    要素番号を持たないパラメータIDは,num = 0 にする.
             *          関数setParamItemで選択制限をかけているので,ここでは入力制限を行わない.
             */
            setParamValue: function (prmid, num, value, diff) {
                //                    DEBUG(arguments);
                var att = prmid.match(/^ID_(PATCH|SYSTEM)_[A-Z0-9_]+$/);
                var cur = att[1] == 'PATCH' ? this.work.patch :
                    att[1] == 'SYSTEM' ? this.work.system : undefined;

                if (!!diff)
                    value += getParamValue(prmid, num);

                var nomValue = value < prmdb[prmid].min ? prmdb[prmid].min :
                    value > prmdb[prmid].max ? prmdb[prmid].max : value;

                if (prmdb[prmid].arr > 0)
                    cur[prmid][num] = nomValue;
                else
                    cur[prmid] = nomValue;
                return nomValue;
            },
            /**
             * @brief   パラメータIDの値を取得する
             * @param   prmid       パラメータID
             * @param   num         パラメータIDの要素番号
             * @return              パラメータIDの値
             * @note    要素番号が未指定の場合,配列要素を持つ
             *          パラメータIDでは,その配列を返す.
             */
            getParamValue: function (prmid, num) {
                //    DEBUG(arguments);
                var att = prmid.match(/^ID_(PATCH|SYSTEM)_[A-Z0-9_]+$/);
                var ret = undefined;
                var cur = att[1] == 'PATCH' ? this.work.patch :
                    att[1] == 'SYSTEM' ? this.work.system : undefined;
                if (cur != undefined) {
                    if (prmdb[prmid].arr > 0) {
                        if (num == null || num == undefined)
                            ret = $.extend([], cur[prmid]);
                        else
                            ret = cur[prmid][num];
                    } else {
                        ret = cur[prmid];
                    }
                }
                return ret;
            },

            /**
             * @brief   パッチ名を設定する
             * @param   str     パッチ名t
             * @return  設定されたパッチ名
             * @note    パラメータID ID_PATCH_NAME に値を設定する場合,この関数でのみ可能.
             */
            setParamValueOfName: function (str) {
                //                    DEBUG(arguments);
                if (null !== str.match(/^[ a-zA-Z0-9!"#$%&'\(\)\*\+,-\./:;<=>?@\[\]^_`\{\|\}]{0,12}$/))
                    this.work.patch[prm] = string2byte(val, NUMOF_ARRAY_PATCH_NAME);
                setTimeout(this.changeParamValueOfName, 0);
            },

            /**
             * @brief   ループストラクチャ関連のパラメータIDの値を設定する
             */
            setParamValueOfLoop: function (prmid, arry) {
                //                    DEBUG(arguments);
                setTimeout(function () { this.changeParamValueOfLoop(prmid) }, 0);
            },

            /**
             * @brief   パラメータIDの値が変更されたことを通知
             * @param   prmid       パラメータID
             * @param   num         パラメータIDの要素番号
             */
            changeParamValue: function (prmid, num) {
                //                    DEBUG(arguments);
                if (num == undefined)
                    num = null;
                var v = this.getParamValue(prmid, num);
                if (prmdb[prmid].arr > 0)
                    prmid = '#' + prmid + '-' + num;
                else
                    prmid = '#' + prmid;
                var p = $(prmid);
                if (p[0]) {
                    p.trigger('es-changed', v);
                }
            },

            setAndChangeParamValue: function(prmid, num, value, diff) {
                var ret = this.setParamValue(prmid, num, value, diff);
                this.changeParamValue(prmid, num);
                return ret;
            },

            /**
             * @brief   パッチパラメータが変更されたことを通知
             */
            changePatch: function (num) {
                //                    DEBUG(arguments);
                issueAllParameterChange(this, new patch());
                $('#ID_TEMP_CURRENT_NUM').trigger('es-changed', num);
            },

            /**
             * @brief   システムパラメータが変更されたことを通知
             */
            changeSystem: function () {
                //                    DEBUG(arguments);
                issueAllParameterChange(this, new system());
            },

            pushOne: function (n) {
                var ttt = this;
                return new Promise(function (resolve, reject) {
                    if (ttt.midi.isConnect() == false) return reject();
                    var msg = [];
                    if (n == 0)
                        msg = msg.concat(ttt.midi.sendSystem(false));
                    else
                        msg = msg.concat(ttt.midi.sendPatch(n - 1, false));   // optionの生成時,Patch valueが index + 1 になっているため.
                    (function () {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'identify',
                                'msg'    : [],
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueIdentityRequest();
                        });
                    })()
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat.type = 'none';
                            ttt.midi.sendMessage(msg, resolve);
                        });
                    })
                    .then(function () {
                        resolve();
                    })
                });
            },
            /**
             * @brief   データを送信する.
             * @param   begin   送信開始位置(system:0 patch:1 - NUMOF_PATCH)  (number)
             * @param   end     送信終了位置(system:0 patch:1 - NUMOF_PATCH)  (number)
             * @param   iswork  ワーク領域を使用するか                         (boolean)
             * @note    begin,endのパッチ番号にはオフセットが'-1'が付く.
             *          ワーク領域を使用する場合,begin,endのパッチ番号は無視される.
             */
            push: function (begin, end, iswork, message) {
                var ttt = this;
                return new Promise(function (resolve, reject) {
                    if (ttt.midi.isConnect() == false) return reject();
                    var msg = [];
                    for (var i = begin; i <= end; i++) {
                        if (i == 0)
                            msg = msg.concat(ttt.midi.sendSystem(iswork));
                        else
                            msg = msg.concat(ttt.midi.sendPatch(i - 1, iswork));   // optionの生成時,Patch valueが index + 1 になっているため.
                    }
                    ttt.dialog.openWait(msg.length, message);

                    (function () {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'identify',
                                'msg'    : [],
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueIdentityRequest();
                        });
                    })()
                    .then(function() {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat.type = 'none';
                            ttt.midi.sendMessage(msg, resolve);
                        });
                    })
                    .then(function () {
                        ttt.dialog.closeWait();
                        resolve();
                    })
                    .catch(function (err) {
                        ttt.midi.rcvdat.type = 'none';
                        ttt.dialog.closeWait();
                        ttt.dialog.openError(err);
                        reject();
                    })

                });
            },

            pullOne: function (n) {
                var ttt = this;
                begin = n <= 0 ? 0               : ttt.midi.getTopOffsetOfPatch(n - 1);
                end   = begin <= 0 ? ttt.midi.getSizeOfSystem() - 1 : ttt.midi.getTopOffsetOfPatch(n) - 1;
                return new Promise(function (resolve, reject) {
                    if (ttt.midi.isConnect() == false) return reject();
                    (function () {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'identify',
                                'msg'    : [],
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueIdentityRequest();
                        });
                    })()
                    .then(function (event) {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'message',
                                'msg'    : [],
                                'next'   : begin,
                                'end'    : end,
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueDataRequest(begin, end);
                        })
                    })
                    .then(function () {
                        ttt.midi.rcvdat.type = 'none';
                        var update_patch  = false;
                        var update_system = false;
                        for (;ttt.midi.rcvdat.msg.length > 0;) {
                            var num = ttt.midi.getNum(ttt.midi.rcvdat.msg[0]);
                            if (num == 0) { // System
                                ttt.container.system = ttt.midi.parseSystem(ttt.midi.rcvdat.msg.splice(0, ttt.midi.getSizeOfSystem()));
                            } else {    // Patch
                                var res = ttt.midi.parsePatch(ttt.midi.rcvdat.msg.splice(0, ttt.midi.getSizeOfPatch()));
                                ttt.container.patch[res.num] = res.prm;
                            }
                        }
                        resolve();
                    })
                });
            },
            /**
             * @brief   データを受信する.
             * @param   begin       受信開始位置  (number)
             * @param   end         受信終了位置  (number)
             * @param   iswork      ワーク領域を使用するか (boolean)
             */
            pull: function (begin, end, iswork, message) {
                var ttt = this;
                return new Promise(function (resolve, reject) {
                    if (ttt.midi.isConnect() == false) return reject();
                    begin = begin <= 0 ? 0               : ttt.midi.getTopOffsetOfPatch(begin - 1);
                    end   = end   <= 0 ? ttt.midi.getSizeOfSystem() - 1 : ttt.midi.getTopOffsetOfPatch(end   - 1) + 1;
                    ttt.dialog.openWait(end - begin, message);

                    (function () {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'identify',
                                'msg'    : [],
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueIdentityRequest();
                        });
                    })()
                    .then(function (event) {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'message',
                                'msg'    : [],
                                'next'   : begin,
                                'end'    : end,
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueDataRequest(begin, end);
                        })
                    })
                    .then(function () {
                        ttt.midi.rcvdat.type = 'none';
                        var update_patch  = false;
                        var update_system = false;
                        for (;ttt.midi.rcvdat.msg.length > 0;) {
                            var num = ttt.midi.getNum(ttt.midi.rcvdat.msg[0]);
                            if (num == 0) { // System
                                if (iswork) {
                                    ttt.work.system = ttt.midi.parseSystem(ttt.midi.rcvdat.msg.splice(0, ttt.midi.getSizeOfSystem()));
                                } else {
                                    ttt.container.system = ttt.midi.parseSystem(ttt.midi.rcvdat.msg.splice(0, ttt.midi.getSizeOfSystem()));
                                    update_system = true;
                                }
                            } else {    // Patch
                                var res = ttt.midi.parsePatch(ttt.midi.rcvdat.msg.splice(0, ttt.midi.getSizeOfPatch()));
                                if (iswork) {
                                    ttt.work.target = res.num;
                                    ttt.work.patch = res.prm;
                                } else {
                                    ttt.container.patch[res.num] = res.prm;
                                    if (ttt.work.target == res.num)
                                        update_patch = true;
                                }
                            }
                        }
                        if (update_system)
                            ttt.loadSystem();
                        if (update_patch)
                            ttt.loadPatch(ttt.work.target, true);
                        if (iswork) {
                            ttt.changeSystem();
                            ttt.changePatch(ttt.work.target);
                        }

                        // setFormPatch();
                        // setFormSystem();
                        // loadPatchTable();
                        ttt.dialog.closeWait();
                        resolve();
                    })
                    .catch(function (err) {
                        ttt.midi.rcvdat.type = 'none';
                        ttt.dialog.closeWait();
                        ttt.dialog.openError(err);
                        reject(err);
                    });
                        
                });
            },
            setEditorMode: function(t) {
                this.midi.setEditorMode(t);
            },
            pullSystem: function() {
                var ttt = this;
                return new Promise(function (resolve, reject) {
                    if (ttt.midi.isConnect() == false) return reject();
                    begin = 0x00 << 7;
                    end   = (0x00 << 7) + ttt.midi.getSizeOfSystem() - 1;
                    ttt.dialog.openWait(end - begin, MSG('IDM_PULL_SYSTEM'));

                    (function () {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'identify',
                                'msg'    : [],
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueIdentityRequest();
                        });
                    })()
                    .then(function (event) {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'message',
                                'msg'    : [],
                                'next'   : begin,
                                'end'    : end,
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueDataRequest(begin, end);
                        })
                    })
                    .then(function () {
                        ttt.midi.rcvdat.type = 'none';
                        if (ttt.midi.getNum(ttt.midi.rcvdat.msg[0]) == 0) {
                            ttt.container.system = ttt.midi.parseSystem(ttt.midi.rcvdat.msg.splice(0, ttt.midi.getSizeOfSystem()));
                            ttt.loadSystem();
                        }

                        ttt.dialog.closeWait();
                        resolve();
                    })
                    .catch(function (err) {
                        ttt.midi.rcvdat.type = 'none';
                        ttt.dialog.closeWait();
                        ttt.dialog.openError(err);
                        reject(err);
                    });
                        
                });
            },
            pullNameList: function () {
                var ttt = this;
                return new Promise(function (resolve, reject) {
                    if (ttt.midi.isConnect() == false) return reject();
                    begin = 0x20 << 7;
                    end   = (0x20 << 7) + ttt.midi.getSizeOfNameList() - 1;
                    ttt.dialog.openWait(end - begin, MSG('IDM_PULL_NAMELIST'));

                    (function () {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'identify',
                                'msg'    : [],
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueIdentityRequest();
                        });
                    })()
                    .then(function (event) {
                        return new Promise(function (resolve, reject) {
                            ttt.midi.rcvdat = {
                                'type'   : 'message',
                                'msg'    : [],
                                'next'   : begin,
                                'end'    : end,
                                'resolve': resolve,
                                'reject' : reject,
                            };
                            ttt.midi.issueDataRequest(begin, end);
                        })
                    })
                    .then(function () {
                        ttt.midi.rcvdat.type = 'none';
                        ttt.midi.rcvdat.msg.forEach(function(e) {
                            var res = ttt.midi.parseNameList(e);
                            res.forEach(function(e) {
                                ttt.container.patch[e.num].ID_PATCH_NAME = string2byte(e.name, 16);
                            });
                        });

                        ttt.dialog.closeWait();
                        resolve();
                    })
                    .catch(function (err) {
                        ttt.midi.rcvdat.type = 'none';
                        ttt.dialog.closeWait();
                        ttt.dialog.openError(err);
                        reject(err);
                    });
                        
                });
            },
            getLoopStructureStr: function () {
                work_patch = $es.work.patch;
                var pstr = '';
                var ipos;
                for (var i = 0; i < work_patch.ID_PATCH_LOOP_POSITION.length; i++) {
                    var p = prmstr.ID_PATCH_LOOP_POSITION[work_patch.ID_PATCH_LOOP_POSITION[i]];
                    if (p == '$') {
                        ipos = i;
                        break;
                    }
                }
                pstr = '';
                for (i = ipos - 1 ; i >= 0; i--) {
                    var p = prmstr.ID_PATCH_LOOP_POSITION[work_patch.ID_PATCH_LOOP_POSITION[i]]; 
                    switch (p) {
                        case '(': p = ')'; break;
                        case ')': p = '('; break;
                        case '[': p = ']'; break;
                        case ']': p = '['; break;
                        default:
                    }
                    pstr += p;
                }
                for (i = ipos; i < work_patch.ID_PATCH_LOOP_POSITION.length; i++) {
                    var p = prmstr.ID_PATCH_LOOP_POSITION[work_patch.ID_PATCH_LOOP_POSITION[i]];
                    pstr += p;            
                }
                return pstr;       
            },
            setLoopStructureByStr: function(pstr) {
                var k = {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 'V': 0, '$': 9, '(': 10, '|': 11, ')': 12, '[': 13, ':': 14, ']': 15};
                var ipos;
                for (var i = 0; i < NUMOF_ARRAY_LOOP_POSITION; i++) {
                    var p = pstr.charAt(i);
                    if (p == '$') {
                        ipos = i;
                        break;
                    }
                }
                for (i = 0 ; i < ipos; i++) {
                    var p = pstr.charAt(i); 
                    switch (p) {
                        case '(': p = ')'; break;
                        case ')': p = '('; break;
                        case '[': p = ']'; break;
                        case ']': p = '['; break;
                        default:
                    }
                    $es.work.patch.ID_PATCH_LOOP_POSITION[(ipos - 1) - i] = k[p];
                }
                for (i = ipos; i < NUMOF_ARRAY_LOOP_POSITION; i++) {
                    var p = pstr.charAt(i); 
                    $es.work.patch.ID_PATCH_LOOP_POSITION[i] = k[p];
                }
                console.log('LOOP:', function(){
                    var str = "";
                    $.each($es.work.patch.ID_PATCH_LOOP_POSITION, function(i, n){
                        str += prmstr.ID_PATCH_LOOP_POSITION[n]
                    });
                    return str;
                }());
            },
            patchChange: function (n, isSend) {
                $es.dialog.openAutoClose('#dialog_working', 300, function () {
                    $es.loadPatch(n, isSend);
                    if ($es.bank.loadedBank != parseInt(n / 8)) {
                        $es.bank.reset();
                    }
                });
            },
            patchChangeRequest: function (n) {
                 $('#ID_TEMP_CURRENT_NUM').trigger('es-changed', n);
            },
            isChangePatch: function () {
                return compare($es.work.patch, $es.container.patch[$es.work.target]);
            },
            isChangeSystem: function () {
                return compare($es.work.system, $es.container.system);
            },
            connect: function(){
                var self = this;
                console.log("START CONNECTION...");
                (function () {
                    return new Promise(function (resolve, reject) {
                        if (self.midi.connect() == false) {
                            reject('ALREADY_CONNECT');
                        } else {
                            console.log("  MIDI CONNECT");
                            resolve();
                        }
                    });
                })()
                .then(function (event) {
                    console.log("  SET EDITOR MODE");
                    return self.setEditorMode('0001');
                })
                .then(function (event) {
                    console.log("  PULL SYSTEM");
                    return self.pullSystem();
                })
                .then(function (event) {
                    console.log("  PULL NAME LIST");
                    return self.pullNameList();
                })
                .then(function (event) {
                    console.log("  INITIALIZE");
                    self.work.target = self.work.system.ID_SYSTEM_CURRENT_NUM;
                    self.functionPanel.init();
                    self.bank.reset();
                    self.bank.setImmediately(parseInt(self.work.target / 8));
                    console.log("CONNECTTED");
                })
                .catch(function (err) {
                    if (err == 'ALREADY_CONNECT') {
                        // nothing
                    } else {
                        self.dialog.openError(err);
                        self.midi.disconnect();
                    }
                });

            },
            init: function () {
                // ローカル環境に保存されたアプリ設定情報を取得する.
                var reg = $native.app.storage();
                if ((reg != undefined) && (reg != "")) {
                    this.appconfig = JSON.parse(reg);
                }
                if (typeof this.appconfig == 'undefined') {
                    this.appconfig.path = "";
                    this.appconfig.file = "";
                }



                //設定ファイルをロードする [[ToDo]] 存在しないとエラー終了する.エラーを出さないようにしたい.
                // try {
                //     var str = $native.fs.readString(this.appconfig.path + "\\" + this.appconfig.file);
                //     container = JSON.parse(str);
                // }
                // catch (e) {
                //     console.log('OPEN ERROR:"' + e + '"');
                // }

                //                        loadPatchTable();

                // パッチ 0番をロード
                this.loadPatch(0, false);
                this.loadSystem();

                this.librarian.init();
                this.loopStructure.init();

                this.functionPanel.init();

                var hideList = [
                    {id: '#ID_SYSTEM_OTHERS_LCD_CONTRAST', child: 'input'},
                    {id: '#ID_SYSTEM_MIDI_SETTING_RX_CH', child: 'input'},
                    {id: '#ID_SYSTEM_MIDI_SETTING_DEVICE_ID', child: 'input'},
                ];

                $.each(hideList, function(i, val){
                    $(val.id).children(val.child).hide();
                });
                // MIDIデバイス制御関連の初期化
                this.midi.init();

                // イベントを許可（ポーリングを開始する）
                $event.start();
            },
            exit: function () {
                function exitFunc() {
                    console.log("  MIDI disconnect");
                    self.midi.disconnect();
                    try {
                        console.log("  exit procedure...");
                        $native.app.storage(JSON.stringify(this.appconfig));
                        $native.fs.mkdir(this.appconfig.path);
                        $native.fs.writeString(this.appconfig.path + '\\' + this.appconfig.file, JSON.stringify(this.container));
                    }
                    catch (e) {
                        //
                    }
                }
                var self = this;
                console.log("START DISCONNECTION...");
                (function () {
                    return new Promise(function (resolve, reject) {
                        if (self.midi.isConnect() == false) return reject('NOT_CONNECT');
                        console.log("  UNSET EDITOR MODE");
                        self.setEditorMode('0000');
                        setTimeout(function(){
                            console.log("  WAITED");
                            resolve();
                        }, 300);
                    });
                })()
                .then(function(event) {
                    console.log("  THEN");
                    exitFunc();
                })
                .catch(function(err) {
                    if (err == 'NOT_CONNECT') {
                        console.log("  CATCH");
                        exitFunc();
                    }
                });
            },
        };
        return es;
    })();
    window.$es = new _es();

    $native.app.event.command = function (param1, param2) {
        if (param1 == 'exit') {
            try {
                $es.exit();
            }
            catch (e) {
                //
            }
            $native.app.exit();
        }
        // if (param1 == 'open') {
        //     location.href = param2;
        // }
    };
})(window);

$(function () {
    window.onload = function () {
        //        debugger;
        $es.init();
    };
});

