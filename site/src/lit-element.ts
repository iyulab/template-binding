import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

class Class {
  foo = "bar";
  foo2 = "bar2";
}

@customElement("my-lit-element")
export class MyLitElement extends LitElement {

  @property({ type: Object })
  bar?: Class;
  // set bar(value) {
  //   console.log("set");
  //   this._bar = this.createReactiveProxy(value);
  // }

  // get bar() {
  //   return this._bar;
  // }

  update(_changedProperties: any) {
    super.update(_changedProperties);
    console.log("update");
  }

  // createReactiveProxy(target) {
  //   const component = this;
  //   return new Proxy(target, {
  //     set(target, property, value) {
  //       target[property] = value;
  //       // 속성이 변경될 때마다 업데이트를 요청합니다.
  //       component.requestUpdate();
  //       return true;
  //     },
  //   });
  // }

  render() {
    return html`<div>${this.bar?.foo} and ${this.bar?.foo2}</div>`;
  }
}
