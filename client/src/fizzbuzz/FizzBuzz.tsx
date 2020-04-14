import * as React from "react";
import { fizzbuzz } from "@chu-redemption-spike/shared";
import { createHttpClient } from "http-schemas/client";

import styles from "./FizzBuzz.module.scss";
import loading from './loading.png';

type Props = { index: number };
type State = {
    result?: fizzbuzz.FizzBuzzType,
    error?: string
}

const fizzBuzzClient = createHttpClient(fizzbuzz.schema);

export class FizzBuzz extends React.Component<Props, State> {

    async componentDidMount(): Promise<void> {
        try {
            const result = await fizzBuzzClient.get("/api/fizzbuzz/:i", {
                params: { i: String(this.props.index) }
            });
            this.setState({ result } as any);
        } catch (e) {
            this.setState({ error: e.message });
        }
    }

    render() {
        return (
            <div className={styles.item}>
                <div className={this.getCardClassName()}>
                    <div className={styles.front}>
                        <img className={styles.spinner} src={loading} alt="loading"/>
                    </div>
                    <div className={styles.back}>
                        <span className={styles.content}>
                            { this.getContent() }
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    private getCardClassName() {
        let className = styles.card;
        if (this.state && this.state.result) {
            className += " " + styles.flipped;
        }
        return className;
    }

    private getContent() {
        if (this.state) {
            return this.state.result === "fizzbuzz"
                   ? "fizz buzz"
                   : this.state.result;
        }
    }
}
