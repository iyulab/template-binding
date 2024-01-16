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

## And more...
See the sample site https://template-binding.github.io/

See examples of bindings, including format, array, and data source bindings.

https://github.com/iyulab/template-binding/blob/main/site/src/my-element.ts
