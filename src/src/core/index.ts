import dayjs from 'dayjs'
import numeral from 'numeral';

  // 바인딩 표현식 처리
  // 표현식의 예시
  // 기본형: ${name}
  // 기본값: ${name || tom}
  // 배열: ${items[0]}
  // 배열의 속성: ${items[4].name}
  // 포멧: ${date:yy-MM-dd}, day.js 사용
  // 포멧과 기본값: ${date:yy-MM-dd || 2020-01-01}
  // 숫자포멧: ${number:0,0.00}
  // 숫자포멧과 기본값: ${number:0,0.00 || 0}
  // 배열과 포멧: ${items[0]:yy-MM-dd}   

class Bind {

  // ## private methods...
  private setProps(target: any, props: any) {
    target.__$bind_props__ = props;
  }

  private setData(target: any, data: any) {
    target.__$bind_data__ = data;
  }

  private setDataProvider(target: any, dataProvider: any) {
    target.__$bind_data_provider__ = dataProvider;
  }

  private setOptions(target: any, options: any) {
    target.__$bind_data_options__ = options;
  }
  
  private getProps(target: any) {
    const props = target.__$bind_props__;
    if (props == null) {
      this.setProps(target, {});
    }
    return target.__$bind_props__;
  }

  private getData(target: any) {
    const data = target.__$bind_data__;
    if (data == null) {
      this.setData(target, {});
    }
    return target.__$bind_data__;
  }

  private getDataProvider(target: any) {
    const dataProvider = target.__$bind_data_provider__;
    if (dataProvider == null) {
      this.setDataProvider(target, {});
    }
    return target.__$bind_data_provider__;
  }

  private getOptions(target: any) {
    const options = target.__$bind_data_options__;
    if (options == null) {
      this.setOptions(target, {});
    }
    return target.__$bind_data_options__;
  }

  private applyFormat(value: any, format: string) {
    // 숫자 또는 숫자 형태의 문자열인 경우
    if (typeof value === 'number' || (typeof value === 'string' && /^[+-]?(\d+|\d+\.\d*|\.\d+)([eE][+-]?\d+)?$/.test(value))) {
      return numeral(value).format(format);
    }
    // value가 Date 객체인 경우
    else if (value instanceof Date) {
      return dayjs(value).format(format);
    }
    // value가 문자열이고, ISO 날짜 형식에 맞는 경우
    else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return dayjs(value).format(format);
    }
    else {
      // 알 수 없는 타입에 대한 처리
      console.error('Unknown value type for formatting', value);
      return value;
    }
  }  
  
  private resolveValue(data: any, key: string, defaultValue: any = '', format: string = null): any {
    let value = data;
    const pathParts = key.split('.');
    for (const part of pathParts) {
      if (value === undefined || value === null) {
        return defaultValue;
      }
  
      const arrayMatch = part.match(/^([^\[]+)(?:\[(\d+)\])?$/);
      if (arrayMatch) {
        const [, propName, index] = arrayMatch;
        value = value[propName];
  
        if (value && index !== undefined) {
          value = value[parseInt(index, 10)];
        }
      } else {
        value = value[part];
      }
  
      if (value === undefined) {
        return defaultValue;
      }
    }
  
    if (format && value !== undefined) {
      value = this.applyFormat(value, format);
    }
  
    return value;
  }  
  
  private applyProps(target: any, props: any, data: any) {
    Object.keys(props).forEach(propName => {
      const propValue = props[propName];
      if (typeof propValue === 'string' && propValue.includes('${')) {
        // 바인딩 표현식 처리
        const replacedValue = propValue.replace(/\$\{([^}]+)\}/g, (_, expr) => {
          const [path, format] = expr.split(':').map(s => s.trim());
          const [key, defaultValue] = path.split('||').map(s => s.trim());
  
          return this.resolveValue(data, key, defaultValue, format);
        });
        target[propName] = replacedValue;
      } else if (typeof propValue === 'object') {
        // 깊은 객체 처리
        this.applyProps(target[propName], propValue, data);
      } else {
        // 기본 값 할당
        target[propName] = propValue;
      }
    });
  }  
  
  private async getDataByWebApiAsync(dataProvider: any) {
    const url = dataProvider.url;
    const method = dataProvider.method || 'GET';
    const headers = dataProvider.headers || {};
    let fetchOptions = {
      method,
      headers,
    };
  
    // POST 또는 다른 메서드인 경우에만 body를 추가
    if (method !== 'GET' && method !== 'HEAD') {
      const body = dataProvider.body || {};
      fetchOptions['body'] = JSON.stringify(body);
    }
    
    const res = await fetch(url, fetchOptions);
    return await res.json();
  }
  
  private async getDataByProviderAsync(dataProvider: any) {
    if (dataProvider.type === 'webapi') {
      return await this.getDataByWebApiAsync(dataProvider);
    } else {
      console.debug('unknown data provider type', dataProvider);
      return {};
    }
  }

  private async refreshData(target: any) {
    const dataProvider = this.getDataProvider(target);
    if (dataProvider && dataProvider.type) {
      const data = await this.getDataByProviderAsync(dataProvider);
      console.log('refreshData', data);
      this.setData(target, data);
      this.refresh(target);
    }
  }

  private startRefreshInterval(target: any, interval: number) {
    this.stopRefreshInterval(target);
    if (interval > 0) {
      const options = this.getOptions(target);
      options.refreshIntervalId = setInterval(() => {
        this.refreshData(target);
      }, interval);
    }
  }

  private stopRefreshInterval(target: any) {
    const options = this.getOptions(target);
    const refreshIntervalId = options.refreshIntervalId;
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      options.refreshIntervalId = undefined;
    }
  }
  
  // ## public methods...
  binding(p: {target: any, props: any, data: any, dataProvider: any}) {

    this.setProps(p.target, p.props);
    this.setData(p.target, p.data);

    this.updateDataProvider({
      target: p.target,
      dataProvider: p.dataProvider
    });
    
    this.refresh(p.target);
  }

  updateProps(p: {target: any, props: any}, withRefresh: boolean = true) {
    this.setProps(p.target, p.props);

    if (withRefresh) {
      this.refresh(p.target);
    }

    // console.log('updateProps', p.target);
  }

  updateData(p: {target: any, data: any}, withRefresh: boolean = true) {
    this.setData(p.target, p.data);

    if (withRefresh) {
      this.refresh(p.target);
    }
  }

  updateDataProvider(p: {target: any, dataProvider: any}) {
    this.setDataProvider(p.target, p.dataProvider);
    this.refreshData(p.target);

    const refreshInterval = p.dataProvider.refreshInterval || 0;
    this.startRefreshInterval(p.target, refreshInterval);
  }

  refresh(target: any) {
    const props = this.getProps(target);
    const data = this.getData(target);
    this.applyProps(target, props, data);
  }
}

export const bind = new Bind();