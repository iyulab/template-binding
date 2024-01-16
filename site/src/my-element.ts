import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import { bind } from '@iyulab/template-binding';
import './lit-element';

@customElement('my-element')
export class MyElement extends LitElement {
  
  [key: string]: any;

  @query('#header')
  header: HTMLHeadingElement | undefined;

  @query('#my')
  my: any;

  @state()
  props?: string = '';

  @state()
  data?: string = '';

  @state()
  dataProvider?: string = '';

  handleInputChange(event: Event, stateKey: string) {
    const target = event.target as HTMLInputElement;
    this[stateKey] = target.value;
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  render() {
    return html`
      <div class="flex items-center justify-center h-screen">
        <div class="container mx-auto p-4">
          <h1 id="header" class="text-center text-xl font-bold mb-4">hello</h1>
          <my-lit-element id="my"></my-lit-element>

          <div class="flex flex-wrap justify-center gap-4 mb-4">
            <button class="px-4 py-2 border border-gray-300 rounded" @click=${this.onAction1}>Props</button>
            <button class="px-4 py-2 border border-gray-300 rounded" @click=${this.onAction2}>Props + Data</button>
            <button class="px-4 py-2 border border-gray-300 rounded" @click=${this.onAction3}>DataProvider(WebAPI)</button>
            <button class="px-4 py-2 border border-gray-300 rounded" @click=${this.onAction4}>Collection</button>
            <button class="px-4 py-2 border border-gray-300 rounded" @click=${this.onActionFormat}>Format</button>
          </div>

          <div class="flex justify-center gap-4 mb-4 w-full">
            <textarea .value=${this.props} class="form-textarea border border-gray-300 p-2 flex-1" style="min-width: 0; color: black;" placeholder="props (JSON)" @input=${(e: Event) => this.handleInputChange(e, 'props')}></textarea>
            <textarea .value=${this.data} class="form-textarea border border-gray-300 p-2 flex-1" style="min-width: 0; color: black;" placeholder="data (JSON)" @input=${(e: Event) => this.handleInputChange(e, 'data')}></textarea>
            <textarea .value=${this.dataProvider} class="form-textarea border border-gray-300 p-2 flex-1" style="min-width: 0; color: black;" placeholder="dataProvider (JSON)" @input=${(e: Event) => this.handleInputChange(e, 'dataProvider')}></textarea>
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    if (this.header) {
      bind.binding({
        target: this.header,
        props: this.props ? JSON.parse(this.props) : {},
        data: this.data ? JSON.parse(this.data) : {},
        dataProvider: this.dataProvider ? JSON.parse(this.dataProvider) : {},
      });
    }

    if (this.my) {
      bind.binding({
        target: this.my,
        props: this.props ? JSON.parse(this.props) : {},
        data: this.data ? JSON.parse(this.data) : {},
        dataProvider: this.dataProvider ? JSON.parse(this.dataProvider) : {},
      });
    }
  }

  override update(changedProperties: Map<string | number | symbol, unknown>) {
    // if (this.header) {
    //   bind.binding({
    //     target: this.header,
    //     props: this.props ? JSON.parse(this.props) : {},
    //     data: this.data ? JSON.parse(this.data) : {},
    //     dataProvider: this.dataProvider ? JSON.parse(this.dataProvider) : {},
    //   });
    // }

    // if (this.my) {
    //   bind.binding({
    //     target: this.my,
    //     props: this.props ? JSON.parse(this.props) : {},
    //     data: this.data ? JSON.parse(this.data) : {},
    //     dataProvider: this.dataProvider ? JSON.parse(this.dataProvider) : {},
    //   });
    // }

    // if(this.my) {
    //   this.my["bar"] = undefined;
    // }
    // if(this.my) {
    //   this.my.bar = undefined;
    // }

    changedProperties.forEach((_, propName) => {
      if (propName === 'props') {
        if (this.header) {
          bind.updateProps({ target: this.header, props: JSON.parse(this.props || '{}') });
        }
        if (this.my) {
          bind.updateProps({ target: this.my, props: JSON.parse(this.props || '{}') });
        }
      } else if (propName === 'data') {
        if (this.header) {
          bind.updateData({ target: this.header, data: JSON.parse(this.data || '{}') });
        }
        if (this.my) {
          bind.updateData({ target: this.my, data: JSON.parse(this.data || '{}') });
        }
      } else if (propName === 'dataProvider') {
        if (this.header) {
          bind.updateDataProvider({ target: this.header, dataProvider: JSON.parse(this.dataProvider || '{}') });
        }
      }
    });

    super.update(changedProperties);
  }

  onAction1() {
    this.props = JSON.stringify({
      innerText: 'world',
      style: { "background": "red" },
      bar: { foo: "lit-element", foo2: "lit-element2" }
    }, null, 2);
    this.data = JSON.stringify({});
    this.dataProvider = JSON.stringify({});
  }

  onAction2() {
    this.props = JSON.stringify({
      innerText: 'hello ${name}',
      style: { "background": "${color}", "color": "${textColor || orange}" },
      bar: { foo: "lit-element", foo2: "lit-element2" }
    }, null, 2);
    this.data = JSON.stringify({
      name: "sydney",
      color: "teal"
    }, null, 2);
    this.dataProvider = JSON.stringify({});
  }

  onAction3() {
    this.props = JSON.stringify({
      innerText: 'my name is ${name || no-name} and my phone number is ${phone || 000-0000-0000}',
    }, null, 2);
    this.data = JSON.stringify({}, null, 2);
    this.dataProvider = JSON.stringify({
      type: "webapi",
      url: "https://jsonplaceholder.typicode.com/users/4",
      refreshInterval: 1000 * 3, // 3초에 한번씩 갱신
    });
  }

  onAction4() {

    let props = {
      innerText: 'array object property: ${items[1].name},\narray value: ${messages[1]},\ndeep array: ${users[0].roles[0]}',
    };

    let data = {
      // 배열의 속성 테스트
      items: [
        { name: "sydney", phone: "010-0000-0000" },
        { name: "seoul", phone: "010-0000-0001" },
        { name: "busan", phone: "010-0000-0002" }
      ],
      // 배열의 값 테스트
      messages: [
        "hello",
        "world",
        "!!"
      ],
      // 깊은배열 테스트
      users: [
        { id: "user1", roles: ["manager", "admin"] },
        { id: "user2", roles: ["guest"] },
      ]
    };
    
    this.props = JSON.stringify(props, null, 2);
    this.data = JSON.stringify(data, null, 2);
    this.dataProvider = JSON.stringify({});
  }

  onActionFormat() {
    let props = {
      innerText: 'today is ${date:YY/MM/DD}\ncost is \$${cost:0,0.00}\ndateText is ${dateText:YY/MM/DD}\nnumberText is ${numberText:0,0.00}',
    };
    let data = {
      date: new Date(),
      cost: 4522000,
      dateText: "2021-01-01",
      numberText: "1234567890"
    };

    this.props = JSON.stringify(props, null, 2);
    this.data = JSON.stringify(data, null, 2);
    this.dataProvider = JSON.stringify({});
  }

  static styles = css`
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
