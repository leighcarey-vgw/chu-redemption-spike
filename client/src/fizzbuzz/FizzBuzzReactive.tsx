import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import * as RxJS from "rxjs";
import { catchError, map, mapTo, shareReplay, startWith, switchMap, tap } from "rxjs/operators";
import styles from "./FizzBuzz.module.scss";
import loading from './loading.png';
import { fizzbuzz } from "@chu-redemption-spike/shared";
import { createHttpClient } from "http-schemas/client";
import { getCardClassName, getContent, wrapHttpClient } from "./fizzbuzz.util";

const fizzBuzzClient = wrapHttpClient(createHttpClient(fizzbuzz.schema));
const getResults = (index: number) => {
    const params = { i: String(index) };
    const result$ = fizzBuzzClient.get("/api/fizzbuzz/:i", { params });
    return result$.pipe(
        catchError(error => {
            console.log(`Error fetching result for index ${index}`, error.message);
            return RxJS.throwError(new Error(error.response ? error.response.status : error.message));
        })
    );
};

type Props = { index: number };
export const FizzBuzzReactive: FunctionComponent<Props> = ({index}) => {
    // Define component state
    const [revealEvent$] = useState(new RxJS.Subject<void>()); // Event emitter for 'reveal' events
    const result$ = getResults(index); // Create result stream

    // Define `flipped` values
    const flipped$ = revealEvent$.pipe( // Use 'reveal' events as a data source
        mapTo(true),                    // Map to true
        tap(flipped => console.log(`Card ${index} ${flipped ? 'is' : 'is not'} flipped`)), // Side-effect: do some logging
        startWith(false),               // Set initial value to false
        shareReplay(1)                  // Buffer most recent value and multicast values to all subscribers
    );

    // Define `result` values
    const mapFlippedResults = (flipped: boolean) => flipped ? result$ : RxJS.of(null);
    const flippedResult$ = flipped$.pipe(           // Use `flipped` values as data source
        switchMap(mapFlippedResults),               // Map to result stream and flatten
        catchError(error => RxJS.of<Error>(error))  // Catch errors and pass through
    );

    // Define `cardClassName` values
    const classNameInput$ = RxJS.combineLatest([flipped$, flippedResult$]);
    const cardClassName$ = classNameInput$.pipe(    // Use `classNameInput` values as data source
        map(([flipped, result]) => getCardClassName(flipped, result instanceof Error ? result : undefined))  // Map to CSS classes
    );

    // Define `content` values
    const content$ = flippedResult$.pipe(               // Use `error` values as data source
        tap(result => console.log(`Value for card ${index} is ${result}`)), // Side-effect: do some logging
        map(result => getContent(result || undefined))  // Map to displayed content
    );

    const reveal = () => revealEvent$.next();
    return (
        <div className={styles.item}>
            <Rx $={cardClassName$}>
            { cardClassName => (
                <div className={cardClassName}>
                    <div className={styles.front}>
                        <button className={styles.revealBtn} onClick={reveal}>↻</button>
                    </div>
                    <div className={styles.back}>
                        <Rx $={content$}>
                        { content => (
                          content
                          ? <span className={styles.content}>{ content }</span>
                          : <img className={styles.spinner} src={loading} alt="loading"/>
                        )}
                        </Rx>
                    </div>
                </div>
            )}
            </Rx>
        </div>
    );
};

// Handled by redux-observable
type RxProps<P> = { $: RxJS.Observable<P>, children: (result: P) => React.ReactElement }
function Rx<P>(props: RxProps<P>) {
    const [result, setResult] = useState<P | undefined>();
    useEffect(() => {
        const sub = props.$.subscribe(setResult);
        return () => sub.unsubscribe();
    }, []);

    return result === undefined ? null : props.children(result);
}
