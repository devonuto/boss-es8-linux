(function ($) {
    $.fn.rightClick = function (options) {
        var pageY = 0;
        var pageX = 0;
        
        var defaults = {menu: ''},
                settings = $.extend({}, defaults, options);

        this.each(function () {
            $(this).bind('contextmenu', function (e) {
                pageY = e.pageY;
                pageX = e.pageX;
                pageX = (pageX > (990 - $(settings.menu).width())) ? (1000 - $(settings.menu).width()): pageX;
                pageY = (pageY > (735 - $(settings.menu).height())) ? (735 - $(settings.menu).height()): pageY;
                $(settings.menu).css({
                    top:  pageY + 'px',
                    left: pageX + 'px',
                    cursor: "default"
                }).show();
                
                return false;
            });
        });
        
        $(settings.menu).click(function () {
            $(settings.menu).hide();
        });

        $(document).click(function () {
            $(settings.menu).hide();
        });
        $(document).keyup(function () {
            $(settings.menu).hide();
        });
        $(window).resize(function () {
            $(settings.menu).hide();
        });
    };
})(jQuery);