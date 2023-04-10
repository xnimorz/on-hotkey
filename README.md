# On-key

on-key is a small, tree-shakecable library, which simplifies the work with hotkeys on your website. 

Simple example:
```js
import { onCodeDown, cmd, ctrl, code_KeyA } from 'on-key';

// ...

// Only keys
onCodeDown(code_KeyA, () => {
  console.log("A symbol was pressed");
});

// Keys with modifiers
onCodeDown({
    key: code_KeyA, // You also can just type 'a', instead of code
    mods: [cmd]
}, () => {
  console.log("cmd+A was pressed");
});

// Handle different key combination
onCodeDown({
    keys: [{
        key: 'a',
        mods: [cmd]
    }, {
        key: 'a',
        mods: [ctrl]
    }],     
}, () => {
  console.log("cmd+A/ctrl+a was pressed");
});

// Handle event on custom HTML element:
// Keys with modifiers
onCodeDown({
    key: code_KeyA, // You also can just type 'a', instead of code
    mods: [cmd],
    scope: document.querySelector('.selector'),
}, () => {
  console.log("cmd+A was pressed");
});

```

Complex example: https://codesandbox.io/s/on-key-example-gmumel 

### on-key provides 4 methods:

1. `onKeyDown` - allows you to add a handler, which would check the `key` from user action and if it's matches, your callback will be called when user pressed a key
2. `onKeyUp` - same as onKeyDown, but the callback is called when user releases a key. 

`onKeyDown`, `onKeyUp` depend on user language setting. It means, that some of "hotkeys" might not work, depending on which language layout user uses. To avoid his, you can use 2 alternative methods:

1. `onCodeDown` allows you to track key presses by their `code` field
2. `onCodeUp` allows you to track key up events by their `code` field


### Arguments:

All 4 methods work with the same API:

```
onKeyDown(Options, Handler)
```

Options is either a string of the key which needs to be tracked ('a','b','f' etc.) or the object: 
```
{
    key: string,
    mods: key modifiers: ctrl, cmd, alt, shift
    scope: HtmlElement - the event handling can be assigned to any element
}
```

or Options can support many key handlers at once:
```
{
    keys: Array<{
        key: string,
        mods: key modifiers: ctrl, cmd, alt, shift
    }>,
    scope: HtmlElement - the event handling can be assigned to any element
}
```

The function returns `unsubscribe` handler which allows you to free handler once you don't need it:
```js
const unsubscribe = onCodeDown({
    key: code_KeyA, // You also can just type 'a', instead of code
    mods: [cmd]
}, () => {
  console.log("cmd+A was pressed");
});
// ...

unsubscribe();
```