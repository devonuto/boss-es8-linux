$(function () {
    function bank() {
        this.bankChangeReq = -1;
        this.loadedBank = -1;
    }
    bank.prototype = {
        reset : function() {
            this.loadedBank = -1;
            $es.bank.set($es.work.target / 8);
        },
        clearSetHandle : function() {
            if (this.setHandle) {
                clearTimeout(this.setHandle);
                this.setHandle = undefined;
            }
        },
        setImmediately: function(v) {
            this.bankChangeReq = parseInt(v);
            $es.bank.clearSetHandle();
            this.setHandle = undefined;
            if ($es.midi.isConnect()) {
                if ($es.bank.isDiff()) {
                    $es.bank.pull();
                    $es.bank.clearSetHandle();
                }
            }
        },
        set : function(v) {
            this.bankChangeReq = parseInt(v);
            $es.bank.clearSetHandle();
            this.setHandle = setInterval(function(){
                this.setHandle = undefined;
                if ($es.dialog.isOpened() == false) {
                    if ($es.midi.isConnect()) {
                        if ($es.bank.isDiff()) {
                            $es.bank.pull();
                            $es.bank.clearSetHandle();
                        }
                    }
                }
            }, 1000);
        },
        isDiff : function() {
            return this.bankChangeReq != this.loadedBank;
        },
        setLoaded : function(v) {
            this.loadedBank = v;
        },
        pull : function() {
            var target = this.bankChangeReq * 8;
            var ttt = this;
            (function() {
                return $es.pull(target + 1, target + 1 + 8 - 1, false, MSG('IDM_PULL_BANK'));
            })()
            .then(function () {
                return $es.pullSystem();
            })
            .then(function (e) {
                $es.bank.setLoaded(ttt.bankChangeReq);
                $es.dialog.openAutoClose('#dialog_working', 300, function(){
                    $es.loadPatch(target + $es.work.target % 8, true);
                });
            })
            .catch(function(e){

            });

        }
    };
    $es.bank = new bank();
});
