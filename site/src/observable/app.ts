import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { observable, Observable } from '@iyulab/template-binding';

@customElement('app-shell')
export class AppShell extends LitElement {
  
  @state()
  data: any = {
    title: "hello-world",
    author: {
      name: "deni",
      email: "deni@xxx.oo"
    }
  };

  @state()
  dataType?: 'Pure Object' | 'Observable Object' | null = null;

  count = 1;
  
  constructor() {
    super();
    this.onChangedValue = this.onChangedValue.bind(this);
    this.requestUpdate = this.requestUpdate.bind(this);
    
    this.updateData();
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  render() {
    return html`
      <div class="flex items-center justify-center h-screen">
        <div class="container mx-auto p-4">
        <h1 class="text-center text-xl font-bold mb-4">Observable TEST</h1>
          <h1 class="text-center text-xl mb-4">Data Title: ${this.data?.title}</h1>
          <h1 class="text-center text-xl mb-4">Data Author: ${this.data?.author?.name}(${this.data?.author?.email})</h1>
          <h1 class="text-center text-xl font mb-4">Data Type: ${this.dataType}</h1>

          <div class="flex flex-wrap justify-center gap-4 mb-4">
            <button class="px-4 py-2 border border-gray-300 rounded" @click=${this.onUpdateData}>Update Data (Show Log)</button>
            <button class="px-4 py-2 border border-gray-300 rounded" @click=${this.onRequestUpdate}>Request UI Update</button>
            <button class="px-4 py-2 border border-gray-300 rounded" @click=${this.onToggleObservableData}>Toggle Observable Data</button>
          </div>
      </div>
    `;
  }

  override update(changedProperties: Map<string | number | symbol, unknown>) {
    
    changedProperties.forEach((_, propName) => {
      if (propName === 'data') {
        this.updateDataType();
      }
    });

    super.update(changedProperties);
  }

  updateDataType() {
    this.dataType = Observable.isObservable(this.data) ? 'Observable Object' : 'Pure Object';
  }

  onUpdateData() {
    this.updateData();
  }

  updateData() {
    let count = this.count++;

    this.data.title = `hello-world: ${count}`;
    this.data.author.name = `deni: ${count}`;
    this.data.author.email = `deni@xxx.oo: ${count}`;

    console.log('Update Data', this.data);
  }

  onRequestUpdate() {
    this.requestUpdate();
  }

  onToggleObservableData() {
    if (Observable.isObservable(this.data)) {
      // data가 일반 객체일 경우 data.title 가 변경되어도 UI가 업데이트 되지 않습니다.
      this.updateData();
      this.data = Observable.getPureObject(this.data);
    } else {
      // data가 Observable 객체일 경우 data.title 가 변경되면 UI가 업데이트 됩니다.
      this.updateData();

      this.data = observable(this.data, this.requestUpdate);
      // this.data = observable(this.data, this.onChangedValue); // 이렇게도 가능합니다.
    }

    this.updateDataType();
  }

  onChangedValue(data: any, onChangedValue: any): any {
    console.log('onChangedValue', data, onChangedValue);
    this.requestUpdate();
  }
}