import * as React from "react";
import { FunctionComponent, useEffect, useState } from "react";
import { fizzbuzz } from "@chu-redemption-spike/shared";
import { createHttpClient } from "http-schemas/client";

import styles from "./FizzBuzz.module.scss";
import loading from './loading.png';

const fizzBuzzClient = createHttpClient(fizzbuzz.schema);
const getResults = async (index: number) => {
    try {
        const params = { i: String(index) };
        return await fizzBuzzClient.get("/api/fizzbuzz/:i", { params });
    } catch (e) {
        console.log(`Error fetching result for index ${index}`, e.message);
        return e.response ? e.response.status : e.message;
    }
};

type Props = { index: number };
export const FizzBuzz: FunctionComponent<Props> = ({ index }) => {
    const [result, setResult] = useState<fizzbuzz.FizzBuzzType>();
    const [error, setError] = useState<string>();

    const getCardClassName = () => {
        let className = styles.card;
        if (result) {
            className += " " + styles.flipped;
        }
        return className;
    };

    const getContent = () => {
        return result === "fizzbuzz"
               ? "fizz buzz"
               : result;
    };

    useEffect(() => { getResults(index).then(setResult, setError) }, [index]);

    return (
        <div className={styles.item}>
            <div className={getCardClassName()}>
                <div className={styles.front}>
                    <img className={styles.spinner} src={loading} alt="loading"/>
                </div>
                <div className={styles.back}>
                    <span className={styles.content}>
                        { getContent() }
                    </span>
                </div>
            </div>
        </div>
    );
};
