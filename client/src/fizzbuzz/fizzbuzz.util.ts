import styles from "./FizzBuzz.module.scss";
import { fizzbuzz } from "@chu-redemption-spike/shared";
import { HttpSchema } from "http-schemas/dist/shared";
import { HttpClient } from "http-schemas/client";
import * as RxJS from "rxjs";
import { ParamNames, Paths, RequestBody, ResponseBody } from "http-schemas/dist/util";

export const getCardClassName = (flipped: boolean, error: Error | undefined) => {
    let className = styles.card;
    if (flipped) {
        className += ` ${styles.flipped}`;
        if (error) {
            className += ` ${styles.error}`;
        }
    }

    return className;
};

export const getContent = (result: fizzbuzz.FizzBuzzType | Error | undefined) => {
    if (result instanceof Error) {
        return result.message;
    }

    if (result === "fizzbuzz") {
        return "fizz buzz";
    }

    return result || null;
};


// Possible extension to http-clients
export function wrapHttpClient<S extends HttpSchema>(client: HttpClient<S>): RxHttpClient<S> {
    return {
        get: (path, ...info) => RxJS.defer(() => client.get(path, ...info)),
        post: (path, ...info) => RxJS.defer(() => client.post(path, ...info))
    };
}
type RxHttpClient<S extends HttpSchema> = {
    get<P extends Paths<S, 'GET'>>(path: P, ...info: HasParamsOrBody<S, 'GET', P> extends false ? [RequestInfo<S, 'GET', P>?] : [RequestInfo<S, 'GET', P>]): RxJS.Observable<ResponseBody<S, 'GET', P>>;
    post<P extends Paths<S, 'POST'>>(path: P, ...info: HasParamsOrBody<S, 'POST', P> extends false ? [RequestInfo<S, 'POST', P>?] : [RequestInfo<S, 'POST', P>]): RxJS.Observable<ResponseBody<S, 'POST', P>>;
};
type HasParamsOrBody<S extends HttpSchema, M extends 'GET' | 'POST', P extends S[any]['path']> = HasParams<S, M, P> extends true ? true : HasBody<S, M, P>;
type RequestInfo<S extends HttpSchema, M extends 'GET' | 'POST', P extends S[any]['path'] = string> = (HasParams<S, M, P> extends true ? { params: Record<ParamNames<S, M, P>, string>; } : { params?: Record<string, never>;}) & (HasBody<S, M, P> extends true ? { body: RequestBody<S, M, P>; } : { body?: never; });
type HasParams<S extends HttpSchema, M extends 'GET' | 'POST', P extends S[any]['path']> = ParamNames<S, M, P> extends never ? false : true;
type HasBody<S extends HttpSchema, M extends 'GET' | 'POST', P extends S[any]['path']> = RequestBody<S, M, P> extends undefined ? false : true;
