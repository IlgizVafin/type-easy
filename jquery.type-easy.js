(function ($) {

    var defaults = {
        lang: 'RU',
        disableCapsLock: false,
        restrictRegex: '',
        upperCaseRegex: ''
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
        88: 'ч',
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
        },
        192: 'ё',
        49: {
            default: '1',
            shift: '!'
        },
        50: {
            default: '2',
            shift: '"'
        },
        51: {
            default: '3',
            shift: '№'
        },
        52: {
            default: '4',
            shift: ';'
        },
        53: {
            default: '5',
            shift: '%'
        },
        54: {
            default: '6',
            shift: ':'
        },
        55: {
            default: '7',
            shift: '?'
        },
        56: {
            default: '8',
            shift: '*'
        },
        57: {
            default: '9',
            shift: '('
        },
        48: {
            default: '0',
            shift: ')'
        },
        189: {
            default: '-',
            shift: '_'
        },
        187: {
            default: '=',
            shift: '+'
        },

        //num keyboard
        96: '0',
        97: '1',
        98: '2',
        99: '3',
        100: '4',
        101: '5',
        102: '6',
        103: '7',
        104: '8',
        105: '9',
        111: '/',
        106: '*',
        109: '-',
        107: '+',
        110: ',',

        //space
        32: ' '
    };

    //todo map Table for EN layout
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

            //BACKSPACE - 8, DELETE - 46
            if ((char && e.ctrlKey) ||
                (e.keyCode === 8 && !e.ctrlKey) ||
                (e.keyCode === 46 && !e.ctrlKey)) {

                e.preventDefault();
                e.stopPropagation();

                el.trigger('keypress', {keyCode: e.keyCode});
            }

        });

        el.keypress(function (e) {

            var startSelection = selection.start,
                endSelection = selection.end,
                caretPosition = selection.start + 1;

            if (!char) {
                if (arguments[1] &&
                    (arguments[1].keyCode === 8 || arguments[1].keyCode === 46)) {
                    char = "";

                    if (startSelection === endSelection) {
                        startSelection -= 1;
                        caretPosition -= 2;
                    } else
                        caretPosition -= 1;
                }
                else
                    return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (!settings.disableCapsLock) {

                var s = String.fromCharCode(e.keyCode);

                if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
                    char = char.toUpperCase();
                } else if (s.toUpperCase() !== s && s.toLowerCase() === s && e.shiftKey) {
                    char = char.toLowerCase();
                }

            }

            var newValue = el.val().replaceAt(startSelection, endSelection, char),
                newSelection = {start: caretPosition, end: caretPosition};

            el
                .restrictSymbols(settings.restrictRegex, newValue, newSelection)
                .toUpperCase(settings.upperCaseRegex, newSelection);

        });

        $.fn.restrictSymbols = function (regex, value, selection) {
            if (!(regex && regex.test(value))) {
                $(this).val(value);
                $(this).selection('setPos', selection);
            }

            return $(this);
        };

        $.fn.toUpperCase = function (regex, selection) {

            var value = $(this).val();

            if (regex) {
                value = value.replace(regex, function () {
                    var offset = arguments[arguments.length - 2],
                        match = arguments[0];

                    if (offset !== 0 ? (offset + arguments[0].length) : offset === selection.start) {
                        return match.toUpperCase();
                    }

                    return match;
                });

                $(this).val(value);
                $(this).selection('setPos', selection);
            }

            return $(this);
        };

    };

    String.prototype.replaceAt = function (start, end, character) {
        return this.substr(0, start) + character + this.substr(end);
    };

    String.prototype.handleRescrictedSymbols = function (str) {
        return this.substr(0, start) + character + this.substr(end);
    };


})(window.jQuery);