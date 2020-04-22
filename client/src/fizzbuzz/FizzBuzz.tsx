import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import styles from "./FizzBuzz.module.scss";
import loading from './loading.png';

import { fizzbuzz } from "@chu-redemption-spike/shared";
import { createHttpClient } from "http-schemas/client";
import { getCardClassName, getContent } from "./fizzbuzz.util";

const fizzBuzzClient = createHttpClient(fizzbuzz.schema);
const getResults = async (index: number) => {
    try {
        const params = { i: String(index) };
        return await fizzBuzzClient.get("/api/fizzbuzz/:i", { params });
    } catch (e) {
        console.log(`Error fetching result for index ${index}`, e.message);
        throw new Error(e.response ? e.response.status : e.message);
    }
};

type Props = { index: number };
export const FizzBuzz: FunctionComponent<Props> = ({ index }) => {
    // Define component state
    const [flipped, setFlipped] = useState(false);
    const [result, setResult] = useState<fizzbuzz.FizzBuzzType>();
    const [error, setError] = useState<Error>();

    // Do something when `result` changes
    useEffect(() => {
        console.log(`Value for card ${index} is ${result}`); // Do some logging
    }, [result, index]);

    // Do something when `flipped` changes
    useEffect(() => {
        console.log(`Card ${index} ${flipped ? 'is' : 'is not'} flipped`); // Do some logging
        if (flipped) {
            getResults(index)           // Fetch the result
            .then(setResult, setError)  // Update our state
        } else {
            setResult(undefined);       // Update our state
            setError(undefined);        // Ditto
        }
    }, [flipped, index]);

    const reveal = () => setFlipped(true);
    const content = getContent(error || result);
    return (
        <div className={styles.item}>
            <div className={getCardClassName(flipped, error)}>
                <div className={styles.front}>
                    <button className={styles.revealBtn} onClick={reveal}>↻</button>
                </div>
                <div className={styles.back}>
                { content
                  ? <span className={styles.content}>{ content }</span>
                  : <img className={styles.spinner} src={loading} alt="loading"/>
                }
                </div>
            </div>
        </div>
    );
};
