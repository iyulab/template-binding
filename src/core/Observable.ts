
type onChangeCallback = (target: any, options: { property: string | symbol, oldValue: any, value: any }) => void;

export class Observable {
  [name: string]: any;

  callback?: onChangeCallback;

  constructor(obj: any, callback?: onChangeCallback) {
    if (Observable.isObservable(obj)) {
      return obj; // 이미 Observable인 경우 그대로 반환
    }

    this.callback = callback;

    return new Proxy(obj, {
      set: (target, property, value) => {
        // 객체의 속성이 객체인 경우, 해당 속성도 Observable로 변환
        if (
          value &&
          typeof value === "object" &&
          !Observable.isObservable(value)
        ) {
          value = new Observable(value, this.callback);
        }

        const oldValue = target[property];
        target[property] = value;

        if (this.callback) {
          this.callback(target, { property, oldValue, value });
        }
        return true;
      },
      get: (target, property) => {
        if (property === "_observableInstance") {
          return this;
        }
        return target[property];
      },
    });
  }

  static isObservable(data: any) {
    return data && data._observableInstance instanceof Observable;
  }

  static getPureObject(observable: any) {
    if (Observable.isObservable(observable)) {
      const pureObject = { ...observable };
      Object.keys(pureObject).forEach((key) => {
        if (Observable.isObservable(pureObject[key])) {
          pureObject[key] = Observable.getPureObject(pureObject[key]);
        }
      });
      return pureObject;
    }
    return observable;
  }
}

export function observable(obj: any, callback?: onChangeCallback) {
  return new Observable(obj, callback);
}