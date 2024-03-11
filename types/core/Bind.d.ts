type DataProvider = (APIProvider) & {
    /**
     * 데이터 제공자의 업데이트 주기를 설정합니다.
     * 단위는 밀리초(ms)이며, 0보다 큰 값이어야 합니다.
     */
    interval?: number;
};
interface APIProvider {
    type: 'webapi';
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';
    headers?: HeadersInit;
    body?: BodyInit;
}
/**
 * The `Bind` class provides methods for binding properties and data to a target object.
 * It supports binding expressions using the jsonata syntax and allows for data updates from a data provider.
 * @see https://template-binding.github.io
 */
export declare class Bind {
    /** ==================== Bind Field ==================== **/
    private static singleExpr;
    private static multiExpr;
    /** ==================== Bind Field ==================== **/
    /** ==================== Get Set Methods Start ==================== **/
    private static setProps;
    private static setData;
    private static setDataProvider;
    private static setOptions;
    private static getProps;
    private static getData;
    private static getDataProvider;
    private static getOptions;
    /** ==================== Get Set Methods End ==================== **/
    /** ==================== Bind Main Methods Start ==================== **/
    private static applyProps;
    private static resolveValue;
    private static findValue;
    private static replaceAsync;
    /** ==================== Bind Main Methods End ==================== **/
    /** ==================== DataProvider Main Methods End ==================== **/
    private static getDataByProviderAsync;
    private static getDataByWebApiAsync;
    private static refreshData;
    private static startRefreshInterval;
    private static stopRefreshInterval;
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
    static binding(p: {
        target: any;
        props: any;
        data?: any;
        dataProvider?: DataProvider;
    }): Promise<void>;
    /**
     * 바인드된 타겟의 속성을 업데이트하고, 필요시 타겟을 갱신합니다.
     * @param p - 설정할 파라미터
     * @param refresh - 업데이트 속성을 즉시 반영할지 설정합니다. 기본값은 true입니다.
     */
    static updateProps(p: {
        target: any;
        props: any;
    }, refresh?: boolean): Promise<void>;
    /**
     * 바인드된 타겟의 데이터를 업데이트하고, 필요시 타겟을 갱신합니다.
     * @param p - 설정할 파라미터
     * @param refresh - 업데이트 데이터를 즉시 반영할지 설정합니다. 기본값은 true입니다.
     */
    static updateData(p: {
        target: any;
        data: any;
    }, refresh?: boolean): Promise<void>;
    /**
     * 바인딩된 타겟의 데이터 제공자를 설정합니다.
     * @param p - 설정할 파라미터
     * @param p.target - 바인드된 타겟 오브젝트
     * @param p.dataProvider - 설정할 데이터 제공자
     */
    static updateDataProvider(p: {
        target: any;
        dataProvider: DataProvider;
    }): Promise<void>;
    /**
     * 바인드된 타겟의 속성에 데이터를 갱신합니다.
     * @param target - 바인드된 타겟 오브젝트
     */
    static refresh(target: any): Promise<void>;
}
export {};
