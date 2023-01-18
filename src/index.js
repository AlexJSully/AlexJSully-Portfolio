import { CaptureConsole, Offline } from "@sentry/integrations";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React from "react";
import { createRoot } from "react-dom/client";
// eslint-disable-next-line import/namespace, no-unused-vars
import * as firebase from "./firebase";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./scripts/App";
import { register } from "./serviceWorkerRegistration";

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,
	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	integrations: [
		new BrowserTracing(),
		new CaptureConsole({
			levels: ["error"],
		}),
		new Offline(),
	],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
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
register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
