import React from 'react';
import styles from './App.module.scss';
import { FizzBuzz } from './fizzbuzz/FizzBuzz';

function App() {
  const init = false;
  const [count, setCount] = React.useState(0);
  const addItem = () => setCount(count => count + 1);

  return (
      <section className={[styles.appContainer, styles.clearfix, init ? styles.init : ''].join(' ')}>
        { createComponents(count) }
        <div className={styles.nextItem}>
          <button className={styles.selectNew} onClick={addItem}>&#65291;</button>
        </div>
      </section>
  );
}

function createComponents(count: number) {
  const components = [];
  for (let i = 0; i < count; ++i) {
    components.push(
        <FizzBuzz key={i} index={i + 1} />
    );
  }
  return components;
}

export default App;
