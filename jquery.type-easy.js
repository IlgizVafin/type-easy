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
        mask: {
            pattern: '',
            maskDefinitions: {
                '9': /\d/,
                'A': /[a-zA-Zа-яА-ЯёЁ]/,
                '*': /[a-zA-Zа-яА-ЯёЁ0-9`~!@#$%^&*()+=\-\{}\[\]:;"'\\\\|<,>.?\/№]/
            },
            restrictRegex: ''
        },
        debounce: {
            delay: 0,
            ifRegex: null
        },
        parsers: [ //view -> model
            {
                regexp: '',
                newSubStr: ''
            }
        ],
        formatters: [ //model -> view
            {
                regexp: '',
                newSubStr: ''
            }
        ]
    };
    var moduleSettings = {
        'restrictRegex': "[^\\s/\\dёЁа-яА-Яa-zA-Z`~!@#$%^&*()_+-={}[/\\]:;\"'\\\\|<,>.?/№]+",
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
        'nonPrintableKeysRegex': /^(9|16|17|18|19|20|27|33|34|35|36|37|38|39|40|44|45|46|91|92|93|145|112|113|114|115|116|117|118|119|120|121|122|123)$/g
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
                if (mapObj.default) return mapObj.default.toUpperCase();
                if (typeof mapObj == "string") return mapObj.toUpperCase();
                return null;
            } else {
                if (mapObj.default) return mapObj.default;
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
                settings = $.extend(true, {}, defaults, options),
                data = elm.data('type_easy'),
                char,
                isNonPrintable = false,
                altKey = false,
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

                        var selection = mask.isMaskProcessed() ? mask.getMaskedSelection(this.oldValue.selection) : this.oldValue.selection;

                        setSelection(selection);
                    },
                    redo: function () {
                        this.element.val(this.newValue.value);
                        this.element.selection('setPos', this.newValue.selection);
                        updateValue(this.newValue.value, this.newValue.selection, this.parseFn);

                        var selection = mask.isMaskProcessed() ? mask.getMaskedSelection(this.newValue.selection) : this.newValue.selection;

                        setSelection(selection);
                    }
                }),
                focusTimeout = null,
                mask = new Mask(settings.mask, elm);

            if (mask.isMaskProcessed()) {
                var masked = mask.maskValue("");
                elm.attr('placeholder', masked);
            }

            if (!data) {
                elm.data('type_easy', {
                    settings: settings
                });
            }

            elm.bind('keydown.type_easy', function (e) {

                var settings = getSettings();

                oldValue = {
                    value: getValue(),
                    selection: getSelection()
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
                    case 67: //c
                    case 86: //v
                    case 88: //x
                        if (e.ctrlKey) {
                            // в Firefox ctrl+a,c,v вызывает keypress
                            // Чтобы не плодить доп. логики переиспользовал условие с isNonPrintable
                            isNonPrintable = true;
                            return true;
                        }
                }
                char = helper.getChar(e, settings.language);

                //prevent alt+key
                if (e.altKey) {
                    if (e.keyCode !== 18)
                        return false;
                    else
                        altKey = true;
                } else if (altKey) {
                    altKey = false;
                }

                //prevent, if ctrl+key mapping not exist
                if (!/^(17|37|39)$/.test(e.keyCode) && !char && e.ctrlKey)
                    return false;

                isNonPrintable = (e.keyCode !== 17 && !char && new RegExp(moduleSettings.nonPrintableKeysRegex.source, 'g').test(e.keyCode));

                if (e.ctrlKey && char) {
                    elm.trigger('keypress', e);
                    return false;
                }
            });
            elm.bind('keypress.type_easy', function (e) {

                if (altKey) {
                    return (altKey = false);
                }

                if (isNonPrintable) {
                    isNonPrintable = false;
                    return;
                }

                var settings = getSettings();

                var originChar = String.fromCharCode(e.keyCode || e.which);
                char = char || originChar;

                if (new RegExp(moduleSettings.restrictRegex, 'g').test(char === '\\' ? '\\\\' : char)) {
                    return false;
                }

                e.preventDefault();
                e.stopPropagation();

                var selection = getSelection(),
                    startSelection = selection.start + buffer.tempValue.length,
                    endSelection = buffer.tempValue.length > 0 ? startSelection : selection.end,
                    caretPosition = startSelection + 1,
                    newSelection = {
                        start: caretPosition,
                        end: caretPosition
                    };

                //caps is on
                if (originChar.toUpperCase() === originChar &&
                    originChar.toLowerCase() !== originChar && !e.shiftKey) {
                    char = settings.capsLockOff ? char.toLowerCase() : char.toUpperCase();
                } else if (originChar.toUpperCase() !== originChar &&
                    originChar.toLowerCase() === originChar &&
                    e.shiftKey) {
                    char = settings.capsLockOff ? char.toUpperCase() : char.toLowerCase();
                }

                if (settings.register == "UPPER_CASE") {
                    char = char.toUpperCase();
                } else if (settings.register == "LOWER_CASE") {
                    char = char.toLowerCase();
                }

                if (settings.lowerCaseByShift && e.shiftKey) {
                    char = char.toLowerCase();
                }

                buffer.value = buffer.value || getValue();

                var newValue = buffer.value.replaceAt(startSelection, endSelection, char);

                if (settings.mask.restrictRegex || settings.restrictRegex) {

                    var tempArr,
                        restrict = false,
                        regex = new RegExp((settings.mask.restrictRegex || settings.restrictRegex).source, 'g');

                    while ((tempArr = regex.exec(newValue)) != null && !restrict) {

                        var matchCaretStart = tempArr.index,
                            matchLength = tempArr[0].length,
                            matchCaretEnd = matchLength + tempArr.index;

                        if (matchLength === 1) {
                            restrict = (matchCaretEnd === caretPosition);
                        } else if (matchLength > 1) {
                            restrict = (caretPosition > matchCaretStart && caretPosition <= matchCaretEnd);
                        }
                        else {
                            throw new Error('restrictRegex error in type-easy');
                        }
                    }

                    if (restrict === true) {
                        return false;
                    }
                }

                if (mask.isMaskProcessed()) {

                    var curRange = mask.getRange(startSelection);

                    //caret position out of available ranges
                    if (!curRange)
                        return false;

                    var rangeLength = curRange.end - curRange.start + 1;

                    //underscore right chars
                    var bufferValue = buffer.value.replaceRange(curRange.end, endSelection, '_');

                    var subStr = bufferValue.slice(curRange.start, curRange.end + 1); //end incl.
                    var from = startSelection - curRange.start; //offset of caret pos
                    var to = subStr[from] === '_' ?
                        (from + 1) :
                        (from + endSelection - startSelection);

                    //can add insert mode (replace cur char by new)
                    var newSubStr = subStr.replaceAt(from, to, char);

                    //check if sub str length more than range length
                    if (newSubStr.replace(/_+$/, '').length > rangeLength)
                        return false;

                    //slice underscore at the end
                    newSubStr = newSubStr.slice(0, rangeLength);

                    //add underscore at the end
                    while (newSubStr.length < rangeLength) {
                        newSubStr += '_';
                    }

                    //recalc newValue
                    newValue = bufferValue.replaceAt(curRange.start, curRange.end + 1, newSubStr);

                    //true - underscore is valid char
                    if (!mask.validateValue(newValue, true)) {
                        return false;
                    }
                }

                //ignore this if
                //if (caretPosition === newValue.length) {
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
                //}

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
            /*elm.bind('keyup.type_easy', function (e) {

             var selection = elm.selection('getPos');

             //value is selected
             if (selection.start === 0 && selection.end === elm.val().length)
             return;

             setRightSelection();
             });*/
            elm.bind('input.type_easy propertychange.type_easy', function () {
                if ($.isFunction(valueChangedFn))
                    valueChangedFn(unmaskedValue(getValue()), isValid(), getSelection());
                setDefaultState();
                updateStack();
            });

            elm.bind('dragover.type_easy dragstart.type_easy drop.type_easy', function (e) {
                e.preventDefault();
            });

            elm.bind('paste.type_easy drop.type_easy', tryToPaste);
            elm.bind('cut.type_easy', function (e) {
                if (mask.isMaskProcessed()) {
                    e.preventDefault();
                    return false;
                }
            });

            elm.bind('focus.type_easy', function (e) {
                if (mask.isMaskProcessed()) {
                    var value = getValue();

                    elm.val(mask.maskValue(value));

                    //replace underscore
                    var tempValue = getValue(true);

                    if (tempValue.length !== mask.getRequiredLength()) {
                        focusTimeout = setTimeout(function () {
                            setSelection(mask.getMaskedSelection({start: tempValue.length, end: tempValue.length}));
                        }, 100);
                    }

                    e.preventDefault();
                }
            });
            elm.bind('click.type_easy', function (e) {
                clearTimeout(focusTimeout);
            });
            elm.bind('blur.type_easy', function () {
                setDefaultState();

                if (mask.isMaskProcessed()) {
                    elm.val(mask.unmaskValue(elm.val()).replace(/_+$/, '') ? elm.val() : '');
                }
            });

            /* elm.bind('copy.type_easuy', function (e) {
             });*/
            //elm.bind('click.type_easy', setRightSelection);

            function updateValue(value, selection, parseFn, isUpdateStack) {
                var settings = getSettings(),
                    newSelection;
                if ($.isFunction(parseFn)) {

                    var unmasked = unmaskedValue(value);

                    var parsedValue = parseFn(unmasked, selection, elm[0]);
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
                    setDefaultState();
                    return false;
                }

                /*
                 * Убрал данную проверку. Мешает выпадающему списку "месяц" при вводе значений посредством чисел, т.к. используется debounce режим ввода чисел (трансляция в строковое название месяце)
                 * */
                //if (document.activeElement === elm[0]) {
                if (mask.isMaskProcessed()) {
                    value = mask.maskValue(value, newSelection);
                    newSelection = mask.getSelection(newSelection);
                }

                setValue(value, newSelection);
                //}

                if ($.isFunction(valueChangedFn)) {
                    var val = unmaskedValue(getValue());

                    settings.parsers.forEach(function (parser) {
                        if (parser.regexp) {
                            val = val.replace(parser.regexp, parser.newSubStr);
                        }
                    });

                    valueChangedFn(val, isValid(), selection);
                }

                setDefaultState();
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
                    value: getValue(),
                    selection: getSelection()
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

            function backSpace(ctrlKey) {
                var newSelection = {},
                    newValue = '';
                if (oldValue.selection.start !== oldValue.selection.end) {
                    newSelection = {
                        start: oldValue.selection.start,
                        end: oldValue.selection.start
                    };

                    if (mask.isMaskProcessed()) {

                        var selectionStart = oldValue.selection.start,
                            selectionEnd = oldValue.selection.end;

                        newValue = clearFragment(oldValue.value, selectionStart, selectionEnd);

                    }
                    else {
                        newValue = oldValue.value.replaceAt(oldValue.selection.start, oldValue.selection.end, '');
                    }

                } else {
                    newSelection = ctrlKey ? {
                        start: 0,
                        end: 0
                    } : {
                        start: oldValue.selection.start - 1,
                        end: oldValue.selection.start - 1
                    };

                    if (mask.isMaskProcessed()) {

                        var selectionStart = ctrlKey ? 0 : oldValue.selection.start - 1,
                            selectionEnd = oldValue.selection.start;

                        newValue = clearFragment(oldValue.value, selectionStart, selectionEnd);
                    } else {
                        newValue = oldValue.value.replaceAt(ctrlKey ? 0 : oldValue.selection.start - 1, oldValue.selection.start, '');
                    }
                }

                updateValue(newValue, newSelection, parseFn, true);

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

                    if (mask.isMaskProcessed()) {

                        var selectionStart = oldValue.selection.start,
                            selectionEnd = oldValue.selection.end;

                        newValue = clearFragment(oldValue.value, selectionStart, selectionEnd);

                    } else {
                        newValue = oldValue.value.replaceAt(oldValue.selection.start, oldValue.selection.end, '');
                    }
                } else {
                    newSelection = {
                        start: oldValue.selection.start,
                        end: oldValue.selection.start
                    };

                    if (mask.isMaskProcessed()) {

                        var selectionStart = oldValue.selection.start,
                            selectionEnd = ctrlKey ? oldValue.value.length : oldValue.selection.start + 1;

                        newValue = clearFragment(oldValue.value, selectionStart, selectionEnd);

                    } else {
                        newValue = oldValue.value.replaceAt(oldValue.selection.start, ctrlKey ? oldValue.value.length : oldValue.selection.start + 1, '');
                    }
                }

                updateValue(newValue, newSelection, parseFn, true)
            }

            function clearFragment(value, selectionStart, selectionEnd) {
                var curRange;

                while ((curRange = mask.getRange(curRange ? curRange.end + 1 : selectionStart))) {

                    //out of selection
                    if (curRange.start > selectionEnd)
                        break;

                    var rangeLength = curRange.end - curRange.start + 1;

                    var subStr = value.slice(curRange.start, curRange.end + 1); //end incl.
                    var from = selectionStart > curRange.start ? selectionStart : curRange.start;
                    var to = selectionEnd > curRange.end ? (curRange.end + 1) : selectionEnd;

                    //can add insert mode (replace cur char by new)
                    var newSubStr = subStr.replaceAt(from - curRange.start, to - curRange.start, '');

                    //add underscore at the end
                    while (newSubStr.length < rangeLength) {
                        newSubStr += '_';
                    }

                    //recalc newValue
                    value = value.replaceAt(curRange.start, curRange.end + 1, newSubStr);
                }

                return value;
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

            function getValue(replaceUnderscore) {
                return mask.isMaskProcessed() ? mask.unmaskValue(elm.val(), replaceUnderscore) : elm.val();
            }

            //remove all _ at the end and if _ not exist value is valid
            function unmaskedValue(value) {
                return mask.isMaskProcessed() ? value.replace(/[_]+$/g, '') : value;
            }

            function setValue(value, selection) {
                elm.val(value);
                setSelection(selection);

                scrollHorizontal(selection);
            }

            function getSelection() {
                var selection = elm.selection('getPos');
                return mask.isMaskProcessed() ?
                    mask.getUnmaskedSelection(selection) :
                    selection;
            }

            function setSelection(selection) {
                if (document.activeElement === elm[0]) {
                    elm.selection('setPos', selection);
                }
            }

            function setRightSelection() {
                if (mask.isMaskProcessed()) {
                    var value = getValue();
                    var unmaskSelection = getSelection();
                    var actualSelection = elm.selection('getPos');
                    var valueEndSelection = mask.getSelection({start: value.length, end: value.length});

                    //set to start if: 1. value length equal zero 2. caret position less than value start position
                    //set to end of value if: caret position more than value position
                    if (value.length === 0 || unmaskSelection.start === 0) {
                        setSelection(mask.getSelection({start: 0, end: 0}));
                    } else if (actualSelection.start > valueEndSelection.start) {
                        setSelection(mask.getSelection({start: value.length, end: value.length}));
                    }

                }
            }

            function isValid() {

                if (mask.isMaskProcessed()) {
                    var value = getValue();
                    return mask.validateValue(unmaskedValue(value));
                }
                else
                    return true;

            }

            function scrollHorizontal(selection) {
                if (elm[0].tagName === 'INPUT') {

                    var ruler =
                        $('<span>')
                            .html(elm.val().substr(0, selection.end).replace(/\s/g, '&nbsp;'))
                            .copyCSS(elm)
                            .css({
                                'width': 'auto',
                                'max-width': 'none',
                                'visibility': 'hidden',
                                'white-space': 'nowrap'
                            })
                            .appendTo($('body'));

                    var rulerW = ruler.width(),
                        elmScrollLeft = elm.scrollLeft(),
                        delta = 5,
                        elmW = elm.width();

                    if ((rulerW - elmScrollLeft) > elmW) {
                        elm.scrollLeft(rulerW - elmW + delta);
                    }

                    ruler.remove();
                }
            }

            function tryToPaste(e) {
                e.preventDefault();

                // запрещаем копипаст в поля с маской
                if (mask.isMaskProcessed()) {
                    return false;
                }

                var selection = getSelection();
                var pastedText = '';

                if (window.clipboardData && window.clipboardData.getData) { // IE
                    pastedText = window.clipboardData.getData('Text');
                } else if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
                    pastedText = e.originalEvent.clipboardData.getData('text/plain');
                }

                var value = getValue().replaceAt(selection.start, selection.end, pastedText);

                var settings = getSettings();

                // обрезаем значение если его длина больше заданной максимальной длины
                var maxLength = parseInt(settings.maxLength);
                if (maxLength > 0 && value.slice) {
                    value = value.slice(0, maxLength);
                }

                selection.start += pastedText.length;
                selection.end = selection.start;

                updateValue(value, selection, parseFn, true);
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
        setValue: function (value) {

            var elm = $(this);
            var data = elm.data('type_easy');

            if (!data) return '';

            if (value === null || typeof value === 'undefined') {
                value = '';
            }

            data.settings.formatters.forEach(function (formatter) {
                if (formatter.regexp) {
                    value = value.toString().replace(formatter.regexp, formatter.newSubStr);
                }
            });

            var mask = new Mask(data.settings.mask, elm);

            if (mask.isMaskProcessed()) {
                var masked = mask.unmaskValue(value);
                value = mask.maskValue(masked);
                elm.val(value);
            } else {
                elm.val(value);
            }

            return value;
        },
        getValue: function () {

            var elm = $(this);
            var data = elm.data('type_easy');

            if (!data) return;

            var mask = new Mask(data.settings.mask, elm);

            if (mask.isMaskProcessed()) {
                var value = mask.unmaskValue(elm.val());
                value = value.replace(/[_]+$/g, '');

                return {
                    value: value,
                    isValid: mask.validateValue(value)
                }
            } else {
                return {
                    value: elm.val(),
                    isValid: true
                }
            }
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

    String.prototype.replaceRange = function (start, end, character) {
        var valueCopy = this;

        while ((end--) > start) {
            valueCopy = valueCopy.replaceAt(end, end + 1, '_')
        }

        return valueCopy;
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

    //core logic from https://github.com/angular-ui/ui-utils/blob/master/modules/mask/mask.js
    function Mask(mask, elm) {

        this.getRequiredLength = getRequiredLength;
        this.maskValue = maskValue;
        this.unmaskValue = unmaskValue;
        this.isMaskProcessed = isMaskProcessed;
        this.getSelection = getSelection;
        this.getUnmaskedSelection = getUnmaskedSelection;
        this.validateValue = validateValue;
        this.getRange = getRange;
        this.replaceErrorByUnderscore = replaceErrorByUnderscore;
        this.getMaskedSelection = getMaskedSelection;

        var maskProcessed = false;
        var maskCaretMap, maskPatterns, maskPlaceholder,
            minRequiredLength, maskComponents, groupedMaskComponents;

        processRawMask();

        return this;

        function processRawMask() {
            var characterCount = 0;

            maskCaretMap = [];
            maskPatterns = [];
            maskPlaceholder = '';

            if (typeof mask.pattern === 'string' && mask.pattern.length) {
                minRequiredLength = 0;

                var isOptional = false,
                    numberOfOptionalCharacters = 0,
                    splitMask = mask.pattern.split('');

                splitMask.forEach(function (chr, i) {
                    if (mask.maskDefinitions[chr]) {

                        maskCaretMap.push(characterCount);

                        maskPlaceholder += getPlaceholderChar(i - numberOfOptionalCharacters);
                        maskPatterns.push(mask.maskDefinitions[chr]);

                        characterCount++;
                        if (!isOptional) {
                            minRequiredLength++;
                        }
                    }
                    else if (chr === '?') {
                        isOptional = true;
                        numberOfOptionalCharacters++;
                    }
                    else {
                        maskPlaceholder += chr;
                        characterCount++;
                    }
                })

            }
            // Caret position immediately following last position is valid.
            maskCaretMap.push(maskCaretMap.slice().pop() + 1);

            maskComponents = getMaskComponents();
            groupedMaskComponents = groupMaskPatterns();
            maskProcessed = maskCaretMap.length > 1 ? true : false;
        }

        function getRequiredLength() {
            return maskCaretMap.length - 1;
        }

        function getPlaceholderChar(i) {
            var placeholder = elm.attr('placeholder');

            if (typeof placeholder !== 'undefined' && placeholder[i]) {
                return placeholder[i];
            } else {
                return '_';
            }
        }

        // Generate array of mask components that will be stripped from a masked value
        // before processing to prevent mask components from being added to the unmasked value.
        // E.g., a mask pattern of '+7 9999' won't have the 7 bleed into the unmasked value.
        // If a maskable char is followed by a mask char and has a mask
        // char behind it, we'll split it into it's own component so if
        // a user is aggressively deleting in the input and a char ahead
        // of the maskable char gets deleted, we'll still be able to strip
        // it in the unmaskValue() preprocessing.
        function getMaskComponents() {
            return maskPlaceholder.replace(/[_]+/g, '_').replace(/([^_]+)([a-zA-Zа-яА-ЯёЁ0-9])([^_])/g, '$1$2_$3').split('_');
        }

        function groupMaskPatterns() {

            var groupedMaskPatterns = [];

            maskPatterns.forEach(function (mask) {

                if (!groupedMaskPatterns.length) {
                    groupedMaskPatterns.push({
                        start: 0,
                        end: 0,
                        mask: mask
                    })
                } else {
                    var last = groupedMaskPatterns[groupedMaskPatterns.length - 1];

                    if (last.mask === mask) {
                        last.end++;
                    } else {
                        groupedMaskPatterns.push({
                            start: last.end + 1,
                            end: last.end + 1,
                            mask: mask
                        })
                    }

                }

            });

            return groupedMaskPatterns;

        }

        function isMaskProcessed() {
            return maskProcessed;
        }

        function maskValue(unmaskedValue) {
            var valueMasked = '',
                maskCaretMapCopy = maskCaretMap.slice();

            maskPlaceholder.split('').forEach(function (chr, i) {
                if (unmaskedValue.length && i === maskCaretMapCopy[0]) {

                    if (unmaskedValue.length && i === maskCaretMapCopy[0]) {
                        valueMasked += unmaskedValue.charAt(0) || '_';
                        unmaskedValue = unmaskedValue.substr(1);
                        maskCaretMapCopy.shift();
                    }
                    else {
                        valueMasked += chr;
                    }
                }
                else {
                    valueMasked += chr;
                }
            });

            return valueMasked;
        }

        function unmaskValue(value, replaceUnderscore) {
            var valueUnmasked = '',
                maskPatternsCopy = maskPatterns.slice();
            // Preprocess by stripping mask components from value
            value = value.toString();
            maskComponents.forEach(function (component) {
                value = value.replace(component, '');
            });

            value.split('').forEach(function (chr, i) {
                valueUnmasked += chr;
                maskPatternsCopy.shift();
            });

            //оставил по умолчанию всегда заполненное значение
            if (replaceUnderscore)
                valueUnmasked = valueUnmasked.replace(/(_)+$/g, '');

            return valueUnmasked;
        }

        function getUnmaskedSelection(selection) {

            var maxCaretPos = maskCaretMap[getRequiredLength()];

            while (selection.start <= maxCaretPos && maskCaretMap.indexOf(selection.start) === -1) {
                selection.start++;
            }

            var start = maskCaretMap.indexOf(selection.start);

            while (selection.end <= maxCaretPos && maskCaretMap.indexOf(selection.end) === -1) {
                selection.end++;
            }

            var end = maskCaretMap.indexOf(selection.end);

            return {
                start: start !== -1 ? start : maskCaretMap.length - 1,
                end: end !== -1 ? end : maskCaretMap.length - 1
            };
        }

        function getMaskedSelection(selection) {
            return {start: maskCaretMap[selection.start], end: maskCaretMap[selection.end]}
        }

        function getSelection(selection) {
            var start = maskCaretMap[selection.start];
            var end = maskCaretMap[selection.end];
            return {start: start, end: end};
        }

        function validateValue(unmaskedValue, emptyIsValid) {

            if (unmaskedValue.length <= getRequiredLength()) {

                return unmaskedValue.split('').every(function (chr, i) {
                    var test = maskPatterns[i].test(chr);
                    return test || (chr === '_' && emptyIsValid);
                });

            }

            return false;
        }

        function replaceErrorByUnderscore(unmaskedValue, start) {

            if (unmaskedValue.length > getRequiredLength())
                return unmaskedValue;

            if (!start)
                start = 0;

            var unmaskedValueCopy = unmaskedValue.slice(),
                chars = unmaskedValue.split('');

            for (var i = start; i < chars.length; i++) {
                var test = maskPatterns[i].test(chars[i]) || chars[i] === '_';

                if (!test) {
                    unmaskedValueCopy = unmaskedValueCopy.replaceAt(i, i, '_');
                    unmaskedValueCopy = replaceErrorByUnderscore(unmaskedValueCopy, i);
                    break;
                }
            }

            return unmaskedValueCopy;
        }

        function getRange(index) {

            return groupedMaskComponents.filter(function (group) {
                return index >= group.start && index <= group.end;
            })[0];

        }
    }

    $.fn.copyCSS = function (source) {
        var dom = $(source).get(0);
        var style;
        var dest = {};
        if (window.getComputedStyle) {
            var camelize = function (a, b) {
                return b.toUpperCase();
            };
            style = window.getComputedStyle(dom, null);
            for (var i = 0, l = style.length; i < l; i++) {
                var prop = style[i];
                var camel = prop.replace(/\-([a-z])/g, camelize);
                var val = style.getPropertyValue(prop);
                dest[camel] = val;
            }
            ;
            return this.css(dest);
        }
        ;
        if (style = dom.currentStyle) {
            for (var prop in style) {
                dest[prop] = style[prop];
            }
            ;
            return this.css(dest);
        }
        ;
        if (style = dom.style) {
            for (var prop in style) {
                if (typeof style[prop] != 'function') {
                    dest[prop] = style[prop];
                }
                ;
            }
            ;
        }
        ;
        return this.css(dest);
    };

})(window.jQuery);
