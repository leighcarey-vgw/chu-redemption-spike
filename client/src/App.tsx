import React from 'react';
import styles from './App.module.scss';
import { FizzBuzz } from './fizzbuzz/FizzBuzz';
import { FizzBuzzReactive } from "./fizzbuzz/FizzBuzzReactive";

type Props = { useRx?: boolean }
function App(props: Props) {
    const init = false;
    const [count, setCount] = React.useState(10);
    const addItem = () => setCount(count => count + 1);

    return (
        <section className={[styles.appContainer, styles.clearfix, init ? styles.init : ''].join(' ')}>
            { createComponents(count) }
            <div className={styles.nextItem}>
                <button className={styles.selectNew} onClick={addItem}>&#65291;</button>
            </div>
        </section>
    );

    function createComponents(count: number) {
        const components = [];
        for (let i = 0; i < count; ++i) {
            components.push(props.useRx
                ? <FizzBuzzReactive key={i} index={i + 1} />
                : <FizzBuzz key={i} index={i + 1} />
            );
        }
        return components;
    }
}

export default App;
