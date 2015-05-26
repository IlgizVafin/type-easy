# type-easy
Type-easy is jQuery plugin that allows you to write without switching the keyboard layout.

Keyboard layout support:
- RU
- EN

### Bower Installation

> bower install type-easy

### API

- init(options, valueChangedFunction, parseFunction). Return $(element)
- valueChangedFunction(value, isValid)
- parseFunction(viewValue, selection, elm)
- updateSettings(options).
- setValue(value). Return masked (! if mask exist) value
- getValue. Return value
- desctroy

### Example

```javascript
$('#ruInput').type_easy({
    language: 'RU',
    capsLockOff: true,
    restrictRegex: /^[- ']|[^- 'ёЁа-яА-Я]|([- '])\1/g,
    upperCaseRegex: /^[^- ']|[- '][^- ']/g
}, function(value, isValid){}, function(viewValue, selection, elm){});
```

##### All settings
```javascript
language: 'DEFAULT',//RU/EN
capsLockOff: false,
restrictRegex: '',
upperCaseRegex: '',
register: 'DEFAULT',//UPPER_CASE/LOWER_CASE
lowerCaseByShift: false,
maxLength: -1
undoDeep: 10,
debounce: {
    delay: 0,
    ifRegex: null
},
mask: {
    pattern: '',
    maskDefinitions: {
        '9': /\d/,
        'A': /[a-zA-Zа-яА-ЯёЁ]/,
        '*': /[a-zA-Zа-яА-ЯёЁ0-9`~!@#$%^&*()+=\-\{}\[\]:;"'\\\\|<,>.?\/№]/
    },
    restrictRegex: ''
}
```
