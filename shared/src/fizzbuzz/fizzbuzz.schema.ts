import { createHttpRoute, createHttpSchema, t, TypeFromTypeInfo } from "http-schemas";

export type FizzBuzzType = TypeFromTypeInfo<typeof fizzBuzzTypeInfo>;
const fizzBuzzTypeInfo = t.union(
    t.number,
    t.unit("fizz"),
    t.unit("buzz"),
    t.unit("fizzbuzz")
);

export const schema = createHttpSchema([
    createHttpRoute({
        method: "GET",
        path: "/api/fizzbuzz/:i",
        paramNames: ["i"],
        requestBody: t.undefined,
        responseBody: fizzBuzzTypeInfo
    })
]);
