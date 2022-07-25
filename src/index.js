import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable"; // For IE 11 support
// Firebase
// eslint-disable-next-line no-unused-vars
import * as firebase from "./firebase";
// CSS
import "./index.css";
// React
import React from "react";
import {createRoot} from "react-dom/client";
// Main app
import App from "./scripts/App";
// Sentry
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";
// Service workers
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// Google Analytics
import reportWebVitals from "./reportWebVitals";

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY,
	integrations: [new BrowserTracing()],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 0.5,
	enabled: process.env.NODE_ENV !== "development",
});

Sentry.configureScope((scope) => {
	scope.setTag("app-version", process.env.REACT_APP_VERSION);
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
