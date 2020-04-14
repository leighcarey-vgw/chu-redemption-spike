import { Router } from "express";
import { FizzBuzzDomain } from "./domain";
import { decorateExpressRouter } from "http-schemas/server";
import { fizzbuzz } from "@chu-redemption-spike/shared";

export const setupFizzBuzzRoutes = (app: Router, fizzBuzzDomain: FizzBuzzDomain): void => {
    const router = decorateExpressRouter({ schema: fizzbuzz.schema, router: app });
    router.get("/api/fizzbuzz/:i", (req, res) => {
        const result = fizzBuzzDomain.get(Number(req.params.i));
        setTimeout(
            () => res.send(result),
            1000 + 1000 * Math.random());
    });
};
