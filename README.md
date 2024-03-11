# template-binding

## Install
[NPM](https://www.npmjs.com/package/@iyulab/template-binding)
```bash
npm install @iyulab/template-binding
```

## How to use

```typescript
import { bind } from '@iyulab/template-binding';

const props = {
  innerText: "{{title}}",
  style: { "background": "{{color}}" }
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

## Use Expression Syntax

This library uses the JSONata expression syntax.
See https://docs.jsonata.org/overview.html


## Observable
object to an Observable object with a callback function.
```typescript
import { observable } from '@iyulab/template-binding';

function onChangedValue(data: any, onChangedValue: any): any {
  console.log('onChangedValue', data, onChangedValue);
}

const data = {
  title: "hello"
};
observable(data, onChangedValue);

data.title = "world";
```
Log
```log
onChangedValue {title: 'world'}title: "world"[[Prototype]]: Object {property: 'title', oldValue: 'hello', value: 'world'}
```

## And more...
See the sample site https://template-binding.github.io/
