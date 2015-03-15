(function ($) {

    var defaults = {
        lang: 'RU',
        delay: 300
    };

    var ru_mapTable = {
        '190': 'ю',
        '191': {
            default: '.',
            shift: ','
        }
    };

    var en_mapTable = {
        '190': {
            default: '.',
            shift: '>'
        }
    };

    var helper = {
        $parseMapTable: function (keyCode, ctrlKey, shiftKey, mapTable) {

            var mapObj = mapTable[keyCode];

            if (!mapObj)
                return;

            if (ctrlKey) {
                return mapObj.ctrl || mapObj.default || mapObj;
            } else if (shiftKey) {
                return mapObj.shift || (mapObj.default ? mapObj.default.toUpperCase() : mapObj.toUpperCase());
            } else {
                return mapObj.default || mapObj;
            }

        },
        getChar: function (event, lang) {

            var mapTable = {};

            switch (lang) {
                case 'RU':
                    mapTable = ru_mapTable;
                    break;
                case 'EN':
                    mapTable = en_mapTable;
                    break;
            }

            return helper.$parseMapTable(event.keyCode, event.ctrlKey, event.shiftKey, mapTable);
        }
    };

    $.fn.type_easy = function (options) {

        var settings = $.extend({}, defaults, options),
            el = $(this);

        el.keydown(function (e) {

            var char = helper.getChar(e, settings.lang);

            if (char) {
                e.preventDefault();
                e.stopPropagation();

                var selection = el.selection('getPos'),
                    currentValue = el.val();

                el.val(currentValue.replaceAt(selection.start, selection.end, char));

                el.selection('setPos', {start: selection.start + 1, end: selection.start + 1});
            }

        });
    };

    String.prototype.replaceAt = function (start, end, character) {
        return this.substr(0, start) + character + this.substr(end);
    }

})(window.jQuery);