(function ($) {

    var defaults = {
        language: 'DEFAULT',//RU/EN
        capsLockOff: false,
        restrictRegex: '',
        upperCaseRegex: '',
        register: 'DEFAULT',//UPPER_CASE/LOWER_CASE
        lowerCaseByShift: false,
        debounce: 0
    };

    var moduleSettings = {
        'restrictRegex': "[^\\s/\\w/\\dёЁа-яА-Я`~!@#$%^&*()_+-={}[/\\]:;\"'\\\\|<,>.?/№]+"
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
            shift: '/',
            ctrl: '\\'
        },
        226: {
            default: '\\',
            shift: '/',
            ctrl: '\\'
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
        188: {
            default: 'б',
            ctrl: ','
        },
        190: {
            default: 'ю',
            ctrl: '.'
        },
        191: {
            default: '.',
            shift: ',',
            ctrl: '/'
        },
        192: 'ё',
        49: {
            default: '1',
            shift: '!'
        },
        50: {
            default: '2',
            shift: '"',
            ctrl: '@'
        },
        51: {
            default: '3',
            shift: '№',
            ctrl: '#'
        },
        52: {
            default: '4',
            shift: ';',
            ctrl: '$'
        },
        53: {
            default: '5',
            shift: '%'
        },
        54: {
            default: '6',
            shift: ':',
            ctrl: '^'
        },
        55: {
            default: '7',
            shift: '?',
            ctrl: '&'
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
        219: {
            default: '[',
            shift: '{'
        },
        221: {
            default: ']',
            shift: '}'
        },
        220: {
            'default': '\\',
            shift: '|',
            ctrl: '\\'
        },
        226: {
            default: '\\',
            shift: '|',
            ctrl: '\\'
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
        186: {
            default: ';',
            shift: ':'
        },
        222: {
            default: '\'',
            ctrl: '\'',
            shift: '"'
        },
        90: 'z',
        88: 'x',
        67: 'c',
        86: 'v',
        66: 'b',
        78: 'n',
        77: 'm',
        188: {
            default: ',',
            shift: '<',
            ctrl: ','
        },
        190: {
            default: '.',
            shift: '>',
            ctrl: '.'
        },
        191: {
            default: '/',
            shift: '?',
            ctrl: '/'
        },
        192: {
            default: '`',
            shift: '~'
        },
        49: {
            default: '1',
            shift: '!'
        },
        50: {
            default: '2',
            shift: '@',
            ctrl: '"'
        },
        51: {
            default: '3',
            shift: '#',
            ctrl: '№'
        },
        52: {
            default: '4',
            shift: '$',
            ctrl: ';'
        },
        53: {
            default: '5',
            shift: '%'
        },
        54: {
            default: '6',
            shift: '^',
            ctrl: ':'
        },
        55: {
            default: '7',
            shift: '&',
            ctrl: '?'
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
        110: '.',

        //space
        32: ' '
    };

    var default_mapTable = {
        219: {
            ctrl: '['
        },
        220: {
            ctrl: '\\'
        },
        226: {
            ctrl: '\\'
        },
        221: {
            ctrl: ']'
        },
        186: {
            ctrl: ';'
        },
        222: {
            ctrl: '\''
        },
        188: {
            ctrl: ','
        },
        190: {
            ctrl: '.'
        },
        191: {
            ctrl: '/'
        }
    };

    var helper = {
        $parseMapTable: function (e, mapTable) {

            var mapObj = mapTable[e.keyCode];

            if (!mapObj)
                return;

            if (e.ctrlKey) {
                return mapObj.ctrl;
            } else if (e.shiftKey) {
                if (mapObj.shift)
                    return mapObj.shift;
                if (mapObj.default)
                    return mapObj.default.toUpperCase();
                if (typeof mapObj == "string")
                    return mapObj.toUpperCase();

                return null;
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
                    return helper.$parseMapTable(e, default_mapTable);
            }
        }
    };

    $.fn.type_easy = function (options, valueChangedFn, parseFn) {

        var settings = $.extend({}, defaults, options),
            el = $(this),
            char,
            buffer = {
                value: '',
                tempValue: '',
                index: 0
            };

        el.keydown(function (e) {

            char = helper.getChar(e, settings.language);
            if (e.ctrlKey && char) {
                el.trigger('keypress', e);
                return false;
            }

        });

        el.keypress(function (e) {

            char = char || String.fromCharCode(e.keyCode);

            if (new RegExp(moduleSettings.restrictRegex, 'g').test(char === '\\' ? '\\\\' : char))
                return false;

            e.preventDefault();
            e.stopPropagation();

            var selection = el.selection('getPos'),
                startSelection = selection.start + buffer.tempValue.length,
                endSelection = buffer.tempValue.length > 0 ? startSelection : selection.end,
                caretPosition = startSelection + 1,
                newSelection = {start: caretPosition, end: caretPosition};

            if (!settings.capsLockOff) {

                if (char.toUpperCase() === char && char.toLowerCase() !== char && !e.shiftKey) {
                    char = char.toUpperCase();
                } else if (char.toUpperCase() !== char && char.toLowerCase() === char && e.shiftKey) {
                    char = char.toLowerCase();
                }

            }

            if (settings.register == "UPPER_CASE") {
                char = char.toUpperCase();
            } else if (settings.register == "LOWER_CASE") {
                char = char.toLowerCase();
            }

            if (settings.lowerCaseByShift && e.shiftKey) {
                char = char.toLowerCase();
            }

            buffer.value = buffer.value || el.val();

            var newValue = buffer.value.replaceAt(startSelection, endSelection, char);

            if (settings.restrictRegex) {

                var tempArr,
                    restrict = false,
                    regex = new RegExp(settings.restrictRegex.source, 'g');

                while ((tempArr = regex.exec(newValue)) != null && !restrict) {

                    if (regex.lastIndex === caretPosition ||
                        tempArr.index === startSelection)
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

                        if (settings.lowerCaseByShift && e.shiftKey) return match;

                        if (offset + arguments[0].length === newSelection.start) {
                            return match.toUpperCase();
                        }

                        return match;
                    });
                }

            }

            buffer.tempValue += char;
            buffer.value = newValue;

            settings.debounce ?
                debounceUpdateFn(buffer.value, {
                    start: selection.start,
                    end: selection.start + buffer.tempValue.length
                }, parseFn) :
                updateValue(buffer.value, {
                    start: selection.start,
                    end: selection.start + buffer.tempValue.length
                }, parseFn);

        });

        el.bind('input propertychange', function () {

            if ($.isFunction(valueChangedFn))
                valueChangedFn(el.val());

            buffer.value = "";
            buffer.tempValue = "";

        });

        el.on('paste dragover', function (e) {
            e.preventDefault();
        });

        function updateValue(value, selection, parseFn) {
            var newSelection;

            if ($.isFunction(parseFn)) {

                var parsedValue = parseFn(value, selection);

                if (parsedValue !== null && parsedValue !== undefined) {
                    value = parsedValue.value;
                    newSelection = {start: parsedValue.start || 0, end: parsedValue.end || 0};
                }
            }

            newSelection = newSelection || {start: selection.end, end: selection.end};

            el.val(value);
            el.selection('setPos', newSelection);

            if ($.isFunction(valueChangedFn))
                valueChangedFn(el.val());

            buffer.value = "";
            buffer.tempValue = "";
        }

        var debounceUpdateFn = debounce(updateValue, settings.debounce, !settings.debounce);

        return el;
    };

    String.prototype.replaceAt = function (start, end, character) {
        return this.substr(0, start) + character + this.substr(end);
    };

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

})(window.jQuery);