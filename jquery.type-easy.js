(function ($) {

    var defaults = {
        lang: 'RU',
        delay: 300
    };

    var ru_keyCodes = {
        '190': {
            default: 'ю'
        }
    };

    var en_keyCodes = {
        '190': {
            default: '.',
            shift: '>'
        }
    };

    var helper = {
        $parseMapTable: function (keyCode, ctrlKey, shiftKey, mapTable) {

            var mapObj = mapTable[keyCode];

            if (ctrlKey) {
                return mapObj.ctrl || mapObj.default;
            } else if (shiftKey) {
                return mapObj.shift || mapObj.default.toUpperCase();
            } else {
                return mapObj.default || mapObj;
            }

        },
        getChar: function (event, lang) {

            var mapTable = {};

            switch (lang) {
                case 'RU':
                    mapTable = ru_keyCodes;
                    break;
                case 'EN':
                    mapTable = en_keyCodes;
                    break;
            }

            return helper.$parseMapTable(event.keyCode, event.ctrlKey, event.shiftKey, mapTable);
        }
    };

    $.fn.type_easy = function (options) {

        var settings = $.extend({}, defaults, options),
            el = $(this);

        el.keydown(function (e) {

            //todo skip service keys

            var char = helper.getChar(e, settings.lang);

            console.log(char)

        });

    }

})(window.jQuery);