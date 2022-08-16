// CSS
import "./policy.css";
// React
import React, {Suspense, lazy, useEffect, useState} from "react";

// Lazy-load components
// Custom components
const Cookies = lazy(() => import("./cookies"));
const Privacy = lazy(() => import("./privacy"));
// Material-UI
const Button = lazy(() => import("@mui/material/Button"));
const Dialog = lazy(() => import("@mui/material/Dialog"));
const DialogContent = lazy(() => import("@mui/material/DialogContent"));
const DialogTitle = lazy(() => import("@mui/material/DialogTitle"));
const Snackbar = lazy(() => import("@mui/material/Snackbar"));

/** Cookies and privacy policy */
export default function Policy() {
	const [displayCnP, setDisplayCnP] = useState(false);
	const [displayCnPDialog, setDisplayCnPDialog] = useState(false);

	/**
	 * Determines if a cookies and policy should be displayed or not
	 */
	function determineCookiesAndPolicy() {
		/** The last version number loaded */
		let lastVersion;
		/** Whether the cookies and policy was displayed before */
		let openedCnP;
		/** All document cookies */
		const cookies = document.cookie?.split(";");

		for (const i in cookies) {
			/** Cookie parameters */
			const cookieParams = cookies[i].split("=");

			if (cookieParams[0].trim().toLowerCase() === "ajs_p_version") {
				lastVersion = cookieParams[1];
			} else if (cookieParams[0].trim().toLowerCase() === "openedcnp") {
				openedCnP = cookieParams?.[1] === "true";
			}
		}

		/** Whether it was an older version [true] or not [false, default] */
		let olderVersion = false;
		if (lastVersion) {
			/** Last version number loaded */
			const ajs_p_version = lastVersion.split(".");
			/** Current version number */
			const currentNum = process.env.REACT_APP_VERSION.split(".");

			/** Major version number */
			const majorOlder = Number(ajs_p_version[0]) < Number(currentNum[0]);
			/** Minor version number */
			const minorOlder = Number(ajs_p_version[1]) < Number(currentNum[1]);
			/** Patch version number */
			const patchOlder = Number(ajs_p_version[2]) < Number(currentNum[2]);

			if (majorOlder || minorOlder || patchOlder) {
				olderVersion = true;
			}
		}

		if (!openedCnP || olderVersion) {
			setDisplayCnP(true);

			document.cookie = `ajs_p_version=${process.env.REACT_APP_VERSION}; expires=Friday, December 31, 9999 at 7:00:00 AM; SameSite=Strict; Secure`;
		}
	}

	/**
	 * Handle click on cookie and policy snackbar for closing
	 * @param {*} event
	 * @param {*} reason
	 * @returns
	 */
	function handleClickCnPSnackbar(_event, reason) {
		if (reason === "clickaway") {
			return;
		}

		setDisplayCnP(false);
		// If the dialog is open, close it
		if (displayCnPDialog) {
			setDisplayCnPDialog(false);
		}

		document.cookie = "openedCnP=true; expires=Friday, December 31, 9999 at 7:00:00 AM; SameSite=Strict; Secure";
	}

	/**
	 * Handle click cookie and policy dialog
	 */
	function handleClickCnPDialog() {
		setDisplayCnP(false);

		setDisplayCnPDialog(!displayCnPDialog);

		document.cookie = "openedCnP=true; expires=Friday, December 31, 9999 at 7:00:00 AM; SameSite=Strict; Secure";
	}

	useEffect(() => {
		determineCookiesAndPolicy();
	});

	return (
		<Suspense fallback={null}>
			<Snackbar
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				open={displayCnP}
				onClose={() => handleClickCnPSnackbar()}
				message="I use cookies to improve your experience!"
				action={
					<>
						<Button variant="outlined" color="secondary" onClick={() => handleClickCnPDialog()}>
							See cookies & privacy policy
						</Button>
						<Button
							variant="outlined"
							color="secondary"
							className="policy-button"
							onClick={() => handleClickCnPSnackbar()}
						>
							CLOSE
						</Button>
					</>
				}
			/>

			<Dialog open={displayCnPDialog} onClose={() => handleClickCnPDialog()}>
				<DialogTitle id="cookies-and-privacy-dialog">Cookies and Privacy Policy</DialogTitle>
				<DialogContent>
					<Cookies />
					<br />
					<hr />
					<br />
					<Privacy />
				</DialogContent>
			</Dialog>
		</Suspense>
	);
}
