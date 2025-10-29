import { LitElement } from 'lit';
import jsonata from "jsonata";

export type DataProvider = ( APIProvider ) & { 
  /**
   * 데이터 제공자의 업데이트 주기를 설정합니다.
   * 단위는 밀리초(ms)이며, 0보다 큰 값이어야 합니다.
   */
  interval?: number 
};

export interface APIProvider {
  type: 'webapi';
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
  headers?: HeadersInit;
  body?: BodyInit;
}

// TODO: 현재 옵션의 역할은 타이머를 관리하는 것입니다.
export interface BindOptions {
  refreshId?: NodeJS.Timeout;
}

/**
 * The `Bind` class provides methods for binding properties and data to a target object.
 * It supports binding expressions using the jsonata syntax and allows for data updates from a data provider.
 * @see https://template-binding.github.io
 */
export class Bind {

  /** ==================== Bind Field ==================== **/
 
  // 단일 표현식 ex) "{{object}}" -> { name: "world" }
  // FIXME: "{{name}} {{age}}" 이경우 singleExpr로 처리됨 정규식 변경 필요
  private static singleExpr = /^\{\{(.+?)\}\}$/; 
  // 다중 표현식 ex) "Hello, {{object.name}}!" -> "Hello, world!"
  private static multiExpr = /\{\{(.+?)\}\}/g; 

  /** ==================== Bind Field ==================== **/
  


  /** ==================== Get Set Methods Start ==================== **/

  private static setProps(target: any, props: any) {
    target.__$bind_props__ = props;
  }

  private static setData(target: any, data: any) {
    target.__$bind_data__ = data;
  }

  private static setDataProvider(target: any, dataProvider: any) {
    target.__$bind_data_provider__ = dataProvider;
  }

  private static setOptions(target: any, options: BindOptions) {
    target.__$bind_data_options__ = options;
  }

  private static getProps(target: any) {
    const props = target.__$bind_props__;
    if (props == null) {
      this.setProps(target, {});
    }
    return target.__$bind_props__;
  }

  private static getData(target: any) {
    const data = target.__$bind_data__;
    if (data == null) {
      this.setData(target, {});
    }
    return target.__$bind_data__;
  }

  private static getDataProvider(target: any): DataProvider {
    const dataProvider = target.__$bind_data_provider__;
    if (dataProvider == null) {
      this.setDataProvider(target, {});
    }
    return target.__$bind_data_provider__;
  }

  private static getOptions(target: any): BindOptions {
    const options = target.__$bind_data_options__;
    if (options == null) {
      this.setOptions(target, {});
    }
    return target.__$bind_data_options__;
  }

  /** ==================== Get Set Methods End ==================== **/



  /** ==================== Bind Main Methods Start ==================== **/

  // target에 props를 재귀적으로 바인딩합니다.
  private static async applyProps(target: any, props: any, data: any) {
    const keys = Object.keys(props);
    for (const propName of keys) {
      // 1. 속성 값 가져오기
      const value = props[propName];
      if (typeof value === "string" && value.includes("{{")) {
        // 2. 바인딩 표현식 처리
        target[propName] = await this.resolveValue(props, propName, data);
      } else if (typeof value === "object") {
        // 2. 오브젝트 객체 처리
        if (value === null) { // null인 경우
          target[propName] = null;
        } else if (Array.isArray(value)) { // 배열인 경우 => 재귀 호출
          if (target[propName] === undefined) target[propName] = [];
          await this.applyProps(target[propName], value, data);
          if(target instanceof LitElement) {
            //@ts-ignore
            target[propName] = [ ...target[propName] ];
          }
        } else { // 객체인 경우 => 재귀 호출
          if (target[propName] === undefined) target[propName] = {};
          await this.applyProps(target[propName], value, data);
          if(target instanceof LitElement) {
            //@ts-ignore
            target[propName] = { ...target[propName] };
          }
        }
      } else {
        // 2. 이외 기본 값 할당 => number, boolean, string(not expression), undefined
        target[propName] = value;
      }
    }
  }

  // props에 data를 바인딩합니다.(구분자: "{{ }}") (jsonata 문법)
  private static async resolveValue(props: any, name: any, data: any) {
    let value = props[name];
    if (this.singleExpr.test(value)) {
      // 단일 표현식 처리 => 해당 타입으로 할당
      const expr = this.singleExpr.exec(value);
      if (expr && expr[1]) {
        value = await this.findValue(expr[1], data);
      }
    } else if(this.multiExpr.test(value)) {
      // 다중 표현식 처리 => String 타입으로 할당
      value = await this.replaceAsync(value, this.multiExpr, async (_match: string, expr: string) => {
        return await this.findValue(expr, data);
      });
    }
    // 표현식이 아니 었을 경우 => 그대로 할당
    return value;
  }

  // jsonata 문법에 따라 데이터를 찾습니다.
  private static async findValue(expr: any, data: any) {
    const expression = jsonata(expr);
    const result = await expression.evaluate(data);
    return result ?? expr;
  }

  // replaceAsync: 정규식에 매칭되는 문자열을 비동기로 처리합니다.
  private static async replaceAsync(str: any, regex: RegExp, replacer: any) {
    const promises: any[] = [];
    str.replace(regex, (match: string, ...args: string[]) => {
      const promise = replacer(match, ...args);
      promises.push(promise);
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
  }

  /** ==================== Bind Main Methods End ==================== **/



  /** ==================== DataProvider Main Methods End ==================== **/

  // DataProvider의 타입에 따라 데이터를 가져옵니다.
  private static async getDataByProviderAsync(dataProvider: DataProvider) {
    if (dataProvider.type === "webapi") {
      return await this.getDataByWebApiAsync(dataProvider);
    } else {
      console.debug("unknown data provider type", dataProvider);
      return {};
    }
  }

  // WebAPI로부터 데이터를 가져옵니다.
  private static async getDataByWebApiAsync(dataProvider: DataProvider) {
    const url = dataProvider.url;
    const method = dataProvider.method || "GET";
    const headers = dataProvider.headers || {};

    // POST 또는 다른 메서드인 경우에만 body를 추가
    const body = method !== "GET" && method !== "HEAD"
    ? JSON.stringify(dataProvider.body || {})
    : undefined;

    const res = await fetch(url, {
      method: method,
      headers: headers,
      body: body,
    });
    return await res.json();
  }

  // DataProvider 설정에 따라 데이터를 주기적으로 업데이트합니다.
  private static async refreshData(target: any) {
    const dataProvider = this.getDataProvider(target);
    if (dataProvider && dataProvider.type) {
      const data = await this.getDataByProviderAsync(dataProvider);
      this.setData(target, data);
      this.refresh(target);
    }
  }

  // DataProvider의 interval에 따라 주기적으로 데이터를 업데이트합니다.
  private static startRefreshInterval(target: any, interval: number) {
    this.stopRefreshInterval(target);
    if (interval > 0) {
      const options = this.getOptions(target);
      options.refreshId = setInterval(() => {
        this.refreshData(target);
      }, interval);
    }
  }

  // DataProvider의 interval을 중지합니다.
  private static stopRefreshInterval(target: any) {
    const options = this.getOptions(target);
    const refreshId = options.refreshId;
    if (refreshId) {
      clearInterval(refreshId);
      options.refreshId = undefined;
    }
  }

  /** ==================== DataProvider Main Methods End ==================== **/



  /** ==================== Public Methods Start ==================== **/

  /**
   * 타겟 오브젝트에 속성(props)를 설정하고, 데이터(data)를 jsonata 문법으로 바인딩합니다, 데이터 제공자(dataProvider)를 설정시, 데이터를 주기적으로 업데이트합니다.
   * @param p - 바인딩 설정
   * @param p.target - 타겟 오브젝트(HTMLElement, Object, Class, ...)
   * @param p.props - 타겟 오브젝트에 설정할 속성
   * @param p.data - 속성값에 바인딩할 데이터
   * @param p.dataProvider - 데이터 제공자 설정
   * @example
   * ```ts
   * const target = document.querySelector("target");
   * Bind.binding({ 
   *    target: target,
   *    props: { style: "color: {{color}}" },
   *    data: { color: "red" },
   *    dataProvider: { type: "webapi", url: "https://api.example.com/data" }
   * });
   * ```
   */
  public static async binding(p: { target: any, props: any, data?: any, dataProvider?: DataProvider }) {
    const { target, props, data, dataProvider } = p;
    this.setProps(target, props);
    if (data) {
      this.setData(target, data);
    }
    if (dataProvider) {
      this.updateDataProvider({ target, dataProvider });
    }
    await this.refresh(target);
  }

  /**
   * 바인드된 타겟의 속성을 업데이트하고, 필요시 타겟을 갱신합니다.
   * @param p - 설정할 파라미터
   * @param refresh - 업데이트 속성을 즉시 반영할지 설정합니다. 기본값은 true입니다.
   */
  public static async updateProps(p: { target: any, props: any }, refresh: boolean = true) {
    const { target, props } = p;
    this.setProps(target, props);
    if (refresh) {
      await this.refresh(target);
    }
  }

  /**
   * 바인드된 타겟의 데이터를 업데이트하고, 필요시 타겟을 갱신합니다.
   * @param p - 설정할 파라미터
   * @param refresh - 업데이트 데이터를 즉시 반영할지 설정합니다. 기본값은 true입니다.
   */
  public static async updateData(p: { target: any, data: any }, refresh: boolean = true) {
    const { target, data } = p;
    this.setData(target, data);
    if (refresh) {
      await this.refresh(target);
    }
  }

  /**
   * 바인딩된 타겟의 데이터 제공자를 설정합니다.
   * @param p - 설정할 파라미터
   * @param p.target - 바인드된 타겟 오브젝트
   * @param p.dataProvider - 설정할 데이터 제공자
   */
  public static async updateDataProvider(p: { target: any, dataProvider: DataProvider }) {
    const { target, dataProvider } = p;
    this.setDataProvider(target, dataProvider);
    this.refreshData(target);
    const interval = dataProvider.interval || 0;
    this.startRefreshInterval(target, interval);
  }

  /**
   * 바인드된 타겟의 속성에 데이터를 갱신합니다.
   * @param target - 바인드된 타겟 오브젝트
   */
  public static async refresh(target: any) {
    const props = this.getProps(target);
    const data = this.getData(target);
    await this.applyProps(target, props, data);
  }

  /** ==================== Public Methods Start ==================== **/

}