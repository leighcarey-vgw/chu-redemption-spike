export interface FizzBuzzDomain {
    get(i: number): number | "fizz" | "buzz" | "fizzbuzz"
}

export const createFizzBuzzDomain = (): FizzBuzzDomain => {
    return { get };
};

export const get = (i: number) => {
    if (i % 3 === 0) {
        return i % 5 === 0 ? "fizzbuzz" : "fizz";
    }

    return i % 5 === 0 ? "buzz" : i;
};
