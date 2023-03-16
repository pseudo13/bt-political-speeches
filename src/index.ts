import express, { Application } from "express";
import 'dotenv/config';
import evaluationRoute from './routes/evaluationRoute';

// Express app runs under PORT
export const buildApp = (port = process.env.PORT || 3000) => {
    const app = express();

    app.use(express.json())
    app.use(express.static('public'));
    app.use('/evaluation', evaluationRoute)

    app.listen(port, () => {
        console.log("Listening on port: 3000")
    });
    return app
}

buildApp();

