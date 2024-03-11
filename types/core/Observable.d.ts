type onChangeCallback = (target: any, options: {
    property: string | symbol;
    oldValue: any;
    value: any;
}) => void;
export declare class Observable {
    [name: string]: any;
    callback?: onChangeCallback;
    constructor(obj: any, callback?: onChangeCallback);
    static isObservable(data: any): any;
    static getPureObject(observable: any): any;
}
export declare function observable(obj: any, callback?: onChangeCallback): Observable;
export {};
