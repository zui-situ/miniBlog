export interface Config {
    baseURL: string;
    header: any;
    method: string;
    dataType:string;
    responseType:string;
}

export interface Options {
    baseURL: string;
    header: any;
    method: string;
    dataType:string;
    responseType:string;
    data:any;
    url:string;
    success?:function;
    fail?:function;
}