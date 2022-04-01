import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable"; // For IE 11 support
// React
import React from "react";
import ReactDOM from "react-dom";
// Sentry
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";
// Main app
import "./index.css";
import App from "./scripts/App";
// Service workers
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// Google Analytics
import reportWebVitals from "./reportWebVitals";
// Firebase
// eslint-disable-next-line no-unused-vars
import * as firebase from "./firebase";

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY,
	integrations: [new BrowserTracing()],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
