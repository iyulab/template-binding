export class Observable {
  callback?: Function;

  constructor(obj: any, callback?: Function) {
    if (Observable.isObservable(obj)) {
      return obj; // 이미 Observable인 경우 그대로 반환
    }

    this.callback = callback;
    const observableInstance = this;

    return new Proxy(obj, {
      set: (target, property, value) => {
        // 객체의 속성이 객체인 경우, 해당 속성도 Observable로 변환
        if (value && typeof value === 'object' && !Observable.isObservable(value)) {
          value = new Observable(value, observableInstance.callback);
        }

        const oldValue = target[property];
        target[property] = value;
        
        if (observableInstance.callback) {
          observableInstance.callback(target, { property, oldValue, value });
        }
        return true;
      },
      get: (target, property) => {
        if (property === "_observableInstance") {
          return observableInstance;
        }
        return target[property];
      }
    });
  }

  static isObservable(data: any) {
    return data && data._observableInstance instanceof Observable;
  }

  static getPureObject(observable: any) {
    if (Observable.isObservable(observable)) {
      const pureObject = { ...observable };
      Object.keys(pureObject).forEach(key => {
        if (Observable.isObservable(pureObject[key])) {
          pureObject[key] = Observable.getPureObject(pureObject[key]);
        }
      });
      return pureObject;
    }
    return observable;
  }
}

export function observable(obj: any, callback?: Function) {
  return new Observable(obj, callback);
}
