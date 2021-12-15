import React, {Suspense, useState, useEffect} from "react";
import "./policy.css";
const Cookies = React.lazy(() => import("./cookies"));
const Privacy = React.lazy(() => import("./privacy"));
// Material-UI
const Snackbar = React.lazy(() => import("@mui/material/Snackbar"));
const Button = React.lazy(() => import("@mui/material/Button"));
const Dialog = React.lazy(() => import("@mui/material/Dialog"));
const DialogTitle = React.lazy(() => import("@mui/material/DialogTitle"));
const DialogContent = React.lazy(() => import("@mui/material/DialogContent"));

/** Cookies and privacy policy */
export default function Policy() {
	const [displayCnP, setDisplayCnP] = useState(false);
	const [displayCnPDialog, setDisplayCnPDialog] = useState(false);

	/**
	 * Determines if a cookies and policy should be displayed or not
	 */
	async function determineCookiesAndPolicy() {
		/** The last version number loaded */
		let lastVersion;
		/** Whether the cookies and policy was displayed before */
		let openedCnP;
		/** All document cookies */
		let cookies = document.cookie?.split(";");

		for (let i in cookies) {
			/** Cookie parameters */
			let cookieParams = cookies[i].split("=");

			if (cookieParams[0].trim().toLowerCase() === "ajs_p_version") {
				lastVersion = cookieParams[1];
			} else if (cookieParams[0].trim().toLowerCase() === "openedcnp") {
				if (cookieParams[1] === "true") {
					openedCnP = true;
				} else {
					openedCnP = false;
				}
			}
		}

		/** Whether it was an older version [true] or not [false, default] */
		let olderVersion = false;
		if (lastVersion) {
			/** Last version number loaded */
			let ajs_p_version = lastVersion.split(".");
			/** Current version number */
			let currentNum = process.env.REACT_APP_VERSION.split(".");

			if (Number(ajs_p_version[0]) < Number(currentNum[0])) {
				olderVersion = true;
			} else if (Number(ajs_p_version[1]) < Number(currentNum[1])) {
				olderVersion = true;
			} else if (Number(ajs_p_version[2]) < Number(currentNum[2])) {
				olderVersion = true;
			}
		}

		if (!openedCnP || olderVersion) {
			setDisplayCnP(true);

			document.cookie = `ajs_p_version=${process.env.REACT_APP_VERSION}; expires=Friday, December 31, 9999 at 7:00:00 AM;`;
		}
	}

	/**
	 * Handle click on cookie and policy snackbar for closing
	 * @param {*} event
	 * @param {*} reason
	 * @returns
	 */
	function handleClickCnPSnackbar(event, reason) {
		if (reason === "clickaway") {
			return;
		}

		setDisplayCnP(false);

		document.cookie = `openedCnP=true; expires=Friday, December 31, 9999 at 7:00:00 AM;`;
	}

	/**
	 * Handle click cookie and policy dialog
	 */
	function handleClickCnPDialog() {
		setDisplayCnP(false);

		setDisplayCnPDialog(!displayCnPDialog);

		document.cookie = `openedCnP=true; expires=Friday, December 31, 9999 at 7:00:00 AM;`;
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
					<React.Fragment>
						<Button
							variant="outlined"
							color="secondary"
							onClick={() => handleClickCnPDialog()}
						>
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
					</React.Fragment>
				}
			/>

			<Dialog open={displayCnPDialog} onClose={() => handleClickCnPDialog()}>
				<DialogTitle id="cookies-and-privacy-dialog">
					Cookies and Privacy Policy
				</DialogTitle>
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
