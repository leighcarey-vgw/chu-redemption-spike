import { fizzbuzz } from "@chu-redemption-spike/shared";

export interface FizzBuzzDomain {
    get(i: number): number | "fizz" | "buzz" | "fizzbuzz"
}

export const createFizzBuzzDomain = (): FizzBuzzDomain => {
    return { get };
};

export const get = (i: number): fizzbuzz.FizzBuzzType => {
    if (i % 3 === 0) {
        return i % 5 === 0 ? "fizzbuzz" : "fizz";
    }

    return i % 5 === 0 ? "buzz" : i;
};
