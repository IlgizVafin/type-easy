(function ($) {
    var defaults = {
        language: 'DEFAULT', //RU/EN
        capsLockOff: false,
        restrictRegex: '',
        upperCaseRegex: '',
        register: 'DEFAULT', //UPPER_CASE/LOWER_CASE
        lowerCaseByShift: false,
        maxLength: -1,
        undoDeep: 10,
        debounce: {
            delay: 0,
            ifRegex: null
        }
    };
    var moduleSettings = {
        'restrictRegex': "[^\\s/\\dёЁа-яА-Яa-zA-Z`~!@#$%^&*()_+-={}[/\\]:;\"'\\\\|<,>.?/№]+",
        'nonPrintableKeysRegex': /^(9|16|17|18|19|20|27|33|34|35|36|37|38|39|40|44|45|46|91|92|93|145|112|113|114|115|116|117|118|119|120|121|122|123)$/g
        /*
         * 9 - TAB
         * 16 - ShiftLeft ShiftRight
         * 17 - ControlLeft ControlRight
         * 18 - ALtLeft
         * 19 - Pause
         * 20 - CapsLock
         * 27 - Esc
         * 33 - "Numpad9" ("PageUp")
         * 34 - "Numpad3" ("PageDown")
         * 35 - "Numpad1" ("End")
         * 36 - "Numpad7" ("Home")
         * 37 - "Numpad4" ("ArrowLeft")
         * 38 - "Numpad8" ("ArrowUp")
         * 39 - "Numpad6" ("ArrowRight")
         * 40 - "Numpad2" ("ArrowDown")
         * 44 - "PrintScreen"
         * 45 - "Insert"
         * 46 - "Delete"
         * 91 - "OSLeft"
         * 92 - "OSRight"
         * 93 - "ContextMenu"
         * 145 - "ScrollLock"
         * 112 - F1
         * 113 - F2
         * 114 - F3
         * 115 - F4
         * 116 - F5
         * 117 - F6
         * 118 - F7
         * 119 - F8
         * 120 - F9
         * 121 - F10
         * 122 - F11
         * 123 - F12
         * */
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
        59: { //Gecko
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
        173: { //Gecko
            default: '-',
            shift: '_'
        },
        187: {
            default: '=',
            shift: '+'
        },
        61: { //Gecko
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
        59: { //Gecko
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
        173: { //Gecko
            default: '-',
            shift: '_'
        },
        187: {
            default: '=',
            shift: '+'
        },
        61: { //Gecko
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
        59: { //Gecko
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
    var gecko_code_keyCode_mapTable = {
        'BracketLeft': 219,
        'BracketRight': 221,
        'Semicolon': 186,
        'Quote': 222,
        'Comma': 188,
        'Period': 190,
        'Slash': 191
    };

    var helper = {
        parseMapTable: function (e, mapObj) {
            if (!mapObj) return;
            if (e.ctrlKey) {
                return mapObj.ctrl;
            } else if (e.shiftKey) {
                if (mapObj.shift) return mapObj.shift;
                if (mapObj.
                        default) return mapObj.
                    default.toUpperCase();
                if (typeof mapObj == "string") return mapObj.toUpperCase();
                return null;
            } else {
                if (mapObj.
                        default) return mapObj.
                    default;
                else if (typeof mapObj == "string") return mapObj;
            }
        },
        getChar: function (e, lang) {

            if (helper.isFireFox()) {
                e.keyCode = (e.originalEvent && e.originalEvent.code && gecko_code_keyCode_mapTable[e.originalEvent.code]) || e.keyCode;
            }

            var mapObj = {};

            switch (lang) {
                case 'RU':
                    mapObj = ru_mapTable[e.keyCode];
                    break;
                case 'EN':
                    mapObj = en_mapTable[e.keyCode];
                    break;
                default:
                    mapObj = default_mapTable[e.keyCode];
                    break;
            }

            return helper.parseMapTable(e, mapObj);
        },
        isFireFox: function () {
            return navigator.userAgent.toLowerCase().indexOf('firefox');
        }
    };

    var methods = {
        init: function (options, valueChangedFn, parseFn) {
            var elm = $(this),
                data = elm.data('type_easy'),
                char,
                isNonPrintable = false,
                buffer = {
                    value: '',
                    tempValue: '',
                    index: 0
                },
                oldValue = {},
                stack = new Undo.Stack(),
                EditCommand = Undo.Command.extend({
                    constructor: function (element, oldValue, newValue, parseFn) {
                        this.element = element;
                        this.oldValue = oldValue;
                        this.newValue = newValue;
                        this.parseFn = parseFn;
                    },
                    execute: function () {
                    },
                    undo: function () {
                        this.element.val(this.oldValue.value);
                        this.element.selection('setPos', this.oldValue.selection);
                        updateValue(this.oldValue.value, this.oldValue.selection, this.parseFn);
                        setSelection(this.oldValue.selection);
                    },
                    redo: function () {
                        this.element.val(this.newValue.value);
                        this.element.selection('setPos', this.newValue.selection);
                        updateValue(this.newValue.value, this.newValue.selection, this.parseFn);
                        setSelection(this.newValue.selection);
                    }
                });

            if (!data) {
                elm.data('type_easy', {
                    settings: $.extend({}, defaults, options)
                });
            }

            elm.bind('keydown.type_easy', function (e) {
                var settings = getSettings();

                oldValue = {
                    value: elm.val(),
                    selection: elm.selection('getPos')
                };
                switch (e.keyCode) {
                    case 8: //BackSpace
                        backSpace(e.ctrlKey);
                        return false;
                    case 46: //Delete
                        deleteSpace(e.ctrlKey);
                        return false;
                    case 89: //y
                        e.ctrlKey && stack.canRedo() && stack.redo();
                        if (e.ctrlKey) return false;
                        break;
                    case 90: //z
                        e.ctrlKey && stack.canUndo() && stack.undo();
                        if (e.ctrlKey) return false;
                        break;
                    case 65: //a
                        if (e.ctrlKey) return true;
                        break;
                }
                char = helper.getChar(e, settings.language);

                //prevent alt+key
                if (e.keyCode !== 18 && e.altKey)
                    return false;

                //prevent, if ctrl+key mapping not exist
                if (e.keyCode !== 17 && !char && e.ctrlKey)
                    return false;

                isNonPrintable = (e.keyCode !== 17 && !char && new RegExp(moduleSettings.nonPrintableKeysRegex.source, 'g').test(e.keyCode));

                if (e.ctrlKey && char) {
                    elm.trigger('keypress', e);
                    return false;
                }
            });
            elm.bind('keypress.type_easy', function (e) {

                var settings = getSettings();

                if (isNonPrintable) {
                    isNonPrintable = false;
                    return;
                }

                var originChar = String.fromCharCode(e.keyCode || e.which);
                char = char || originChar;

                if (new RegExp(moduleSettings.restrictRegex, 'g').test(char === '\\' ? '\\\\' : char))
                    return false;
                e.preventDefault();
                e.stopPropagation();
                var selection = elm.selection('getPos'),
                    startSelection = selection.start + buffer.tempValue.length,
                    endSelection = buffer.tempValue.length > 0 ? startSelection : selection.end,
                    caretPosition = startSelection + 1,
                    newSelection = {
                        start: caretPosition,
                        end: caretPosition
                    };
                if (!settings.capsLockOff) {
                    if (originChar.toUpperCase() === originChar && originChar.toLowerCase() !== originChar && !e.shiftKey) {
                        char = char.toUpperCase();
                    } else if (originChar.toUpperCase() !== originChar && originChar.toLowerCase() === originChar && e.shiftKey) {
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
                buffer.value = buffer.value || elm.val();
                var newValue = buffer.value.replaceAt(startSelection, endSelection, char);
                if (settings.restrictRegex) {
                    var tempArr,
                        restrict = false,
                        regex = new RegExp(settings.restrictRegex.source, 'g');
                    while ((tempArr = regex.exec(newValue)) != null && !restrict) {
                        if ((caretPosition >= tempArr.index && caretPosition <= regex.lastIndex) || (tempArr.index === 0 && regex.lastIndex === newValue.length)) restrict = true;
                    }
                    if (restrict) return false;
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
                selection = {
                    start: selection.start,
                    end: selection.start + buffer.tempValue.length
                };
                if (isNeedDebounce() && settings.debounce.ifRegex.test(buffer.tempValue)) {
                    debounceUpdateFn(buffer.value, selection, parseFn, true);
                } else {
                    updateValue(buffer.value, selection, parseFn, true);
                }
            });
            elm.bind('input.type_easy propertychange.type_easy', function () {
                if ($.isFunction(valueChangedFn)) valueChangedFn(elm.val());
                setDefaultState();
                updateStack();
            });
            elm.bind('paste.type_easy dragover.type_easy dragstart.type_easy drop.type_easy', function (e) {
                e.preventDefault();
            });
            elm.bind('blur.type_easy', function () {
                setDefaultState();
            });

            function updateValue(value, selection, parseFn, isUpdateStack) {
                var settings = getSettings(),
                    newSelection;
                if ($.isFunction(parseFn)) {
                    var parsedValue = parseFn(value, selection, elm[0]);
                    if (parsedValue !== null && parsedValue !== undefined) {
                        value = parsedValue.value;
                        newSelection = {
                            start: parsedValue.start || 0,
                            end: parsedValue.end || 0
                        };
                    }
                }
                newSelection = newSelection || {
                    start: selection.end,
                    end: selection.end
                };

                if (settings.maxLength >= 0 && value.length > settings.maxLength) {
                    return false;
                }

                if (document.activeElement === elm[0]) {
                    elm.val(value);
                    elm.selection('setPos', newSelection);
                }
                if ($.isFunction(valueChangedFn)) valueChangedFn(elm.val());
                buffer.value = "";
                buffer.tempValue = "";
                if (isUpdateStack) updateStack();
            }

            var debounceUpdateFn = debounce(updateValue, getSettings().debounce.delay, !isNeedDebounce());

            function setDefaultState() {
                buffer.value = "";
                buffer.tempValue = "";
            }

            function updateStack(force) {
                var settings = getSettings();
                var newValue = {
                    value: elm.val(),
                    selection: elm.selection('getPos')
                };
                if (newValue.value !== oldValue.value || force) {
                    var command = new EditCommand(elm, oldValue, newValue, parseFn);
                    stack.execute(command);
                    if (stack.commands.length > settings.undoDeep) {
                        if (stack.stackPosition >= 0) stack.stackPosition--;
                        stack.commands.shift();
                    }
                }
            }

            function setSelection(selection) {
                if (document.activeElement === elm[0]) {
                    elm.selection('setPos', selection);
                }
            }

            function backSpace(ctrlKey) {
                var newSelection = {},
                    newValue = '';
                if (oldValue.selection.start !== oldValue.selection.end) {
                    newSelection = {
                        start: oldValue.selection.start,
                        end: oldValue.selection.start
                    };
                    newValue = oldValue.value.replaceAt(oldValue.selection.start, oldValue.selection.end, '');
                    updateValue(newValue, newSelection, parseFn, true)
                } else {
                    newSelection = ctrlKey ? {
                        start: 0,
                        end: 0
                    } : {
                        start: oldValue.selection.start - 1,
                        end: oldValue.selection.start - 1
                    };
                    newValue = oldValue.value.replaceAt(ctrlKey ? 0 : oldValue.selection.start - 1, oldValue.selection.start, '');
                    updateValue(newValue, newSelection, parseFn, true)
                }
                //todo на будущее реализовать
                /* var indices = [];
                 for (var i = 0; i < oldValue.selection.start; i++) {
                 if (/\S/.test(oldValue.value[i])) indices.push(i);
                 }*/
            }

            function deleteSpace(ctrlKey) {
                var newSelection = {},
                    newValue = '';
                if (oldValue.selection.start !== oldValue.selection.end) {
                    newSelection = {
                        start: oldValue.selection.start,
                        end: oldValue.selection.start
                    };
                    newValue = oldValue.value.replaceAt(oldValue.selection.start, oldValue.selection.end, '');
                    updateValue(newValue, newSelection, parseFn, true)
                } else {
                    newSelection = {
                        start: oldValue.selection.start,
                        end: oldValue.selection.start
                    };
                    newValue = oldValue.value.replaceAt(oldValue.selection.start, ctrlKey ? oldValue.value.length : oldValue.selection.start + 1, '');
                    updateValue(newValue, newSelection, parseFn, true)
                }
            }

            function isNeedDebounce() {
                var settings = getSettings();
                return settings.debounce && settings.debounce.ifRegex instanceof RegExp;
            }

            function getSettings() {
                var data = elm.data('type_easy');

                if (!data)
                    return defaults;

                return data.settings || defaults;
            }

            return elm;
        },
        updateSettings: function (options) {

            var elm = $(this);

            var data = elm.data('type_easy') || {settings: defaults};
            elm.data('type_easy', {
                settings: $.extend({}, data.settings, options)
            });

        },
        destroy: function () {
            return this.each(function () {
                var elm = $(this),
                    data = elm.data('type_easy');

                elm.unbind('.type_easy');
                elm.removeData('type_easy');
            });
        }
    };

    $.fn.type_easy = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.type_easy');
        }

    };

    String.prototype.replaceAt = function (start, end, character) {
        return this.substr(0, start) + character + this.substr(end);
    };

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
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