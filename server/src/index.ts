import * as express from "express";
import * as compression from "compression";
import { setupFizzBuzzRoutes } from "./fizzbuzz/routes";
import { createFizzBuzzDomain } from "./fizzbuzz/domain";

const fizzBuzzDomain = createFizzBuzzDomain();

const app = express();
const port = 80;

app.use(compression());
setupFizzBuzzRoutes(app, fizzBuzzDomain);
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`chu-redemption-spike listening on port ${port}`));
