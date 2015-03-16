(function ($) {

    var defaults = {
        lang: 'DEFAULT',//RU/EN
        disableCapsLock: false,
        restrictRegex: '',
        upperCaseRegex: '',
        register: 'DEFAULT',//UPPER/LOWER
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
        219: 'х',
        221: 'ъ',
        220: {
            'default': '\\',
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
        186: 'ж',
        222: 'э',
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
            'default': '.',
            shift: ','
        },
        192: 'ё',
        49: {
            shift: '!'
        },
        50: {
            shift: '"'
        },
        51: {
            shift: '№'
        },
        52: {
            shift: ';'
        },
        53: {
            shift: '%'
        },
        54: {
            shift: ':'
        },
        55: {
            shift: '?'
        },
        56: {
            shift: '*'
        },
        57: {
            shift: '('
        },
        48: {
            shift: ')'
        },
        189: {
            shift: '_'
        },
        187: {
            shift: '+'
        }
    };

    var en_mapTable = {
        81: 'q',
        87: 'w',
        69: 'e',
        82: 'r',
        84: 't',
        89: 'y',
        85: 'u',
        73: 'i',
        79: 'o',
        80: 'p',
        219: '[',
        221: ']',
        220: {
            'default': '\\',
            shift: '|'
        },
        65: 'a',
        83: 's',
        68: 'd',
        70: 'f',
        71: 'g',
        72: 'h',
        74: 'j',
        75: 'k',
        76: 'l',
        186: ';',
        222: "'",
        90: 'z',
        88: 'x',
        67: 'c',
        86: 'v',
        66: 'b',
        78: 'n',
        77: 'm',
        188: ',',
        190: '.',
        191: {
            'default': '/',
            shift: '?'
        },
        192: '`',
        49: {
            shift: '!'
        },
        50: {
            shift: '@'
        },
        51: {
            shift: '#'
        },
        52: {
            shift: '$'
        },
        53: {
            shift: '%'
        },
        54: {
            shift: '^'
        },
        55: {
            shift: '&'
        },
        56: {
            shift: '*'
        },
        57: {
            shift: '('
        },
        48: {
            shift: ')'
        },
        189: {
            shift: '_'
        },
        187: {
            shift: '+'
        }
    };

    var def_mapTable = {};

    var ctrl = {
        50: '@',
        51: '#',
        52: '$',
        53: '%',
        54: '^',
        55: '&',
        186: ';',
        188: ',',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        221: ']',
        222: "'"
    };

    for (var code in ctrl) {
        ctrl[code] = {
            ctrl: ctrl[code]
        }
    }

    var num = {
        48: '0',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6',
        55: '7',
        56: '8',
        57: '9',
        187: '=',
        189: '-',

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
    }

    var mapping = function (target, source) {
        for (var code in source) {
            //if (!target[code]) throw new Error('Fill you table!');
            if (typeof source[code] == "string") {
                //if (target[code]) throw new Error('Rewrite table!');
                if (typeof target[code] == "object") {
                    target[code].default = source[code];
                } else target[code] = source[code];
                continue;
            }
            if (typeof target[code] == "string") {
                target[code] = {default: target[code]}
            }
            for (var prop in source[code]) {
                target[code] = target[code] || {};
                target[code][prop] = source[code][prop];
            }
        }
    }

    mapping(def_mapTable, ctrl);

    mapping(ru_mapTable, num);
    mapping(ru_mapTable, ctrl);

    mapping(en_mapTable, num);
    mapping(en_mapTable, ctrl);

    var helper = {
        $parseMapTable: function (e, mapTable) {

            var mapObj = mapTable[e.keyCode];

            if (!mapObj)
                return;

            if (e.ctrlKey) {
                return mapObj.ctrl;
            } else if (e.shiftKey) {
                return mapObj.shift || (mapObj.default || mapObj).toUpperCase();
            } else {
                if (mapObj.default) return mapObj.default;
                else if (typeof mapObj == "string") return mapObj;
            }
        },
        getChar: function (e, lang) {
            switch (lang) {
                case 'RU':
                    return helper.$parseMapTable(e, ru_mapTable);
                case 'EN':
                    return helper.$parseMapTable(e, en_mapTable);
                default:
                    return helper.$parseMapTable(e, def_mapTable);
            }
        }
    };

    $.fn.type_easy = function (options, callback) {

        var settings = $.extend({}, defaults, options),
            el = $(this),
            char = '';

        el.keydown(function (e) {

            char = helper.getChar(e, settings.lang);
            if (e.ctrlKey) {
                el.trigger('keypress', e);
                return false;
            }
            return true;
        });

        el.keypress(function (e) {

            if (!char) return true;

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

            if (settings.register == "UPPER") {
                char = char.toUpperCase();
            } else if (settings.register == "LOWER") {
                char = char.toLowerCase();
            }

            if (settings.toLowerByShift && e.shiftKey) {
                char = char.toLowerCase();
            }

            var newValue = el.val().replaceAt(startSelection, endSelection, char);

            if (settings.restrictRegex) {

                var tempArr,
                    restrict = false,
                    regex = new RegExp(settings.restrictRegex.source, 'g');

                while ((tempArr = regex.exec(newValue)) != null && !restrict) {

                    if (regex.lastIndex === caretPosition)
                        restrict = true;

                }

                if (restrict)
                    return false;

            }

            if (caretPosition === newValue.length) {

                if (settings.upperCaseRegex) {
                    newValue = newValue.replace(settings.upperCaseRegex, function () {
                        var offset = arguments[arguments.length - 2],
                            match = arguments[0];

                        if (settings.toLowerByShift && e.shiftKey) return match;

                        if (offset + arguments[0].length === newSelection.start) {
                            return match.toUpperCase();
                        }

                        return match;
                    });
                }

            }

            el.val(newValue);
            el.selection('setPos', newSelection);

            if ($.isFunction(callback))
                callback(newValue);
        });
    };

    String.prototype.replaceAt = function (start, end, character) {
        return this.substr(0, start) + character + this.substr(end);
    };

})(window.jQuery);