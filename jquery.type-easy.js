(function ($) {

    var defaults = {
        lang: 'DEFAULT',
        disableCapsLock: false,
        restrictRegex: '',
        upperCaseRegex: '',
        register: 'DEFAULT',
        toLowerByShift: false
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
                default:
                    switch (event.keyCode) {
                        case 222:
                            if (event.ctrlKey)
                                return '\'';
                            break;
                    }
                    break;
            }

            return helper.$parseMapTable(event.keyCode, event.ctrlKey, event.shiftKey, mapTable);
        }
    };

    $.fn.type_easy = function (options) {

        var settings = $.extend({}, defaults, options),
            el = $(this),
            char = '';

        el.keydown(function (e) {

            char = helper.getChar(e, settings.lang);

            e.ctrlKey && el.trigger('keypress', {keyCode: e.keyCode});

        });

        el.keypress(function (e) {

            if (!char)
                return true;

            e.preventDefault();
            e.stopPropagation();

            var selection = el.selection('getPos'),
                startSelection = selection.start,
                endSelection = selection.end,
                caretPosition = selection.start + 1,
                newSelection = {start: caretPosition, end: caretPosition};

            if (!settings.disableCapsLock) {

                var s = String.fromCharCode(e.keyCode);

                if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
                    char = char.toUpperCase();
                } else if (s.toUpperCase() !== s && s.toLowerCase() === s && e.shiftKey) {
                    char = char.toLowerCase();
                }

            }

            var newValue = el.val().replaceAt(startSelection, endSelection, char);

            if (settings.restrictRegex && settings.restrictRegex.test(newValue)) return;

            if (caretPosition === newValue.length) {

                if (settings.upperCaseRegex) {
                    newValue = newValue.replace(settings.upperCaseRegex, function () {
                        var offset = arguments[arguments.length - 2],
                            match = arguments[0];

                        if (offset + arguments[0].length === newSelection.start) {
                            return match.toUpperCase();
                        }

                        return match;
                    });
                }

            }

            el.val(newValue);
            el.selection('setPos', newSelection);
        });
    };

    String.prototype.replaceAt = function (start, end, character) {
        return this.substr(0, start) + character + this.substr(end);
    };

})(window.jQuery);