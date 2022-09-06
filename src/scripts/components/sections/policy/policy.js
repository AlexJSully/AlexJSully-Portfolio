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
		if (window.localStorage?.getItem("ajs_version") !== process.env.REACT_APP_VERSION) {
			setDisplayCnP(true);

			window.localStorage.setItem("ajs_version", process.env.REACT_APP_VERSION);
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
