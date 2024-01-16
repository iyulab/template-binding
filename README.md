# template-binding

## How to use

```
const props = {
  innerText: '${title}',
  style: { "background": "${color}" }
};
const data = {
  title: "hello",
  color: "red"
};

bind.binding({
  target: this.header, // h1, div, DOM-element, anything...
  props: props,
  data: data
});
```

## Examples of expressions
```
Default: ${name}
Default: ${name || tom}
Array: ${items[0]}
Array's properties: ${items[4].name}
Format: ${date:yy-MM-dd}, using day.js
Format and default: ${date:yy-MM-dd || 2020-01-01}
Number format: ${number:0,0.00}
Number format and default: ${number:0,0.00 || 0}
Array and format: ${items[0]:yy-MM-dd}
```

## And more...
See the sample site https://template-binding.github.io/

See examples of bindings, including format, array, and data source bindings.

https://github.com/iyulab/template-binding/blob/main/site/src/my-element.ts
