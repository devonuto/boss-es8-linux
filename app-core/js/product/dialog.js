
$(function () {

    function dialog() {
        $("#fDialogWaitProgressbar").progressbar({
            value: 0,
            max: 100
        });
        this._isOpened = false;
        this.id = null;
    };
    dialog.prototype = {
        open: function(id, message) {
            if (this._isOpened == true) {
                this.close(this.id);
            }
            this._isOpened = true;
            this.id = id;
            var wrapper = $('<div class="page-popup-wrapper"></div>');
            var t = $('#lDialogWaitTitle');
            if (t) {
                t.empty();
                if (message) {
                    t.append($('<p></p>', {text: message }));;
                } else {
                    t.append($('<p></p>', {text: 'WAIT' }));;
                }
            }
            $(document.body).append(wrapper);
            $(id).appendTo(wrapper).show(0);
        },
        close: function(id) {
            $(id).hide().unwrap().appendTo('#layout-wrapper');
            this._isOpened = false;
            this.id = null;
        },
        isOpened: function() { return this._isOpened; },
        openWait: function(progress, message) {
            /**
             * @brief   プログレスバーを初期化する
             * @param   max     最大値 (number)
             * @note    maxが未指定の場合,100を設定する.
             */
            function initProgress(max) {
                if (max == undefined)
                    max = 100;
                $("#fDialogWaitProgressbar")
                .progressbar("option", "max", max)
                .progressbar("option", "value", 0);
            }

            this.open('#DIALOG_WAIT', message);
            initProgress(progress);
        },
        closeWait: function(){
            this.close('#DIALOG_WAIT');
        },
        /**
         * @brief   プログレスバーを更新する
         * @param   num     進める値 (number)
         * @note    numが未指定の場合,１進める.
         */
        updateProgress: function(num) {
            if (num == undefined)
                num = 1;
            var val = $("#fDialogWaitProgressbar").progressbar("value");
            $("#fDialogWaitProgressbar").progressbar("value", val + num);
        },
        openError: function(err) {
            this.open('#DIALOG_ERROR');
            var msg = MSG(err);
            var obj = $('#lDialogErrorMessage');
            obj.children('p').text(msg);
        },
        openWarning: function(err) {
            this.open('#DIALOG_WARNING');
            var msg = MSG(err);
            var obj = $('#lDialogWarningMessage');
            obj.children('p').text(msg);
        },
        openAutoClose: function(id, time, c) {
            var ttt = this;
            this._isOpened = true;
            var wrapper = $('<div class="page-popup-wrapper"></div>');
            $(document.body).append(wrapper);
            function callback() {
                setTimeout(function (func) {
                    func();
                    ttt.close(id);
                }, time, c);
            }
            $(id).appendTo(wrapper).show(0, callback);
        },
        openWorkingDialog: function(time, c) {
            this.openAutoClose('#dialog_working', time, c);
        }
    };
    $es.dialog = new dialog();

    // $('#bDialogPushAll').on('click', function(e,v){
    //     $es.push(0, NUMOF_PATCH, false);
    // });
    // $('#bDialogPushCurrent').on('click', function(e,v){
    //     $es.push($es.work.target + 1, $es.work.target + 1, true);
    // });
    // $('#bDialogPullAll').on('click', function(e,v){
    //     $es.pull(0, NUMOF_PATCH, false);
    // });

    $('#bDialogPullExecute').on('click', function(e,v){
            (function() {
                return $es.pull($es.work.target + 1, $es.work.target + 1, false, MSG('IDM_NOW_READING'));
            })()
            .then(function () {
                return $es.pullSystem();
            })
            .then(function (e) {
                $es.dialog.openWorkingDialog(0, function() {
                    $es.loadPatch($es.work.target, false);
                });
            })
            .catch(function(e){
            });
    });

});
