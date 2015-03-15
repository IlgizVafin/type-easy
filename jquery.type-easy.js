(function ($) {

    var defaults = {
        lang: 'RU',
        disableCapsLock: false
    };

    var ru_mapTable = {
        81: 'й',
        87: 'ц',
        69: 'у',
        82: 'к',
        84: 'е',
        89: 'н',
        85: 'г',
        73: 'ш',
        79: 'щ',
        80: 'з',
        219: {
            default: 'х',
            ctrl: '['
        },
        221: {
            default: 'ъ',
            ctrl: ']'
        },
        220: {
            default: '\\',
            shift: '|'
        },
        65: 'ф',
        83: 'ы',
        68: 'в',
        70: 'а',
        71: 'п',
        72: 'р',
        74: 'о',
        75: 'л',
        76: 'д',
        186: {
            default: 'ж',
            ctrl: ';'
        },
        222: {
            default: 'э',
            ctrl: '\''
        },
        90: 'я',
        88: 'x',
        67: 'с',
        86: 'м',
        66: 'и',
        78: 'т',
        77: 'ь',
        188: 'б',
        190: 'ю',
        191: {
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
                return mapObj.ctrl;
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
            el = $(this),
            selection = {},
            char = '';

        el.keydown(function (e) {

            char = helper.getChar(e, settings.lang);

            selection = el.selection('getPos');

            if (char && e.ctrlKey) {

                e.preventDefault();
                e.stopPropagation();

                el.trigger('keypress');
            }

        });

        el.keypress(function (e) {

            if (!char)
                return;

            e.preventDefault();
            e.stopPropagation();

            if (!settings.disableCapsLock) {

                var s = String.fromCharCode(e.which);

                if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
                    char = char.toUpperCase();
                } else if (s.toUpperCase() !== s && s.toLowerCase() === s && e.shiftKey) {
                    char = char.toLowerCase();
                }

            }

            el.val(el.val().replaceAt(selection.start, selection.end, char));

            el.selection('setPos', {start: selection.start + 1, end: selection.start + 1});

        });
    };

    String.prototype.replaceAt = function (start, end, character) {
        return this.substr(0, start) + character + this.substr(end);
    }

})(window.jQuery);