import React, { Suspense } from 'react';
import './policy.css';
const Cookies = React.lazy(() => import('./cookies'));
const Privacy = React.lazy(() => import('./privacy'));
// Material-UI
const Snackbar = React.lazy(() => import('@mui/material/Snackbar'));
const Button = React.lazy(() => import('@mui/material/Button'));
const Dialog = React.lazy(() => import('@mui/material/Dialog'));
const DialogTitle = React.lazy(() => import('@mui/material/DialogTitle'));
const DialogContent = React.lazy(() => import('@mui/material/DialogContent'));

/** Cookies and privacy policy */
export default class Policy extends React.Component {
    constructor() {
        super();

        // Handler functions
        this.handleClickCnPSnackbar = this.handleClickCnPSnackbar.bind(this);
        this.handleClickCnPDialog = this.handleClickCnPDialog.bind(this);

        this.state = {
            displayCnP: false,
            displayCnPDialog: false
        };
    };

    /**
     * Determines if a cookies and policy should be displayed or not
     */
     async determineCookiesAndPolicy() {
        /** The last version number loaded */
        let lastVersion;
        /** Whether the cookies and policy was displayed before */
        let openedCnP;
        /** All document cookies */
        let cookies = document.cookie?.split(';');

        for (let i in cookies) {
            /** Cookie parameters */
            let cookieParams = cookies[i].split('=');

            if (cookieParams[0].trim().toLowerCase() === 'ajs_p_version') {
                lastVersion = cookieParams[1];
            } else if (cookieParams[0].trim().toLowerCase() === 'openedcnp') {
                if (cookieParams[1] === 'true') {
                    openedCnP = true;
                } else {
                    openedCnP = false;
                };
            };
        };

        /** Whether it was an older version [true] or not [false, default] */
        let olderVersion = false;
        if (lastVersion) {
            /** Last version number loaded */
            let ajs_p_version = lastVersion.split('.');
            /** Current version number */
            let currentNum = process.env.REACT_APP_VERSION.split('.');

            if (Number(ajs_p_version[0]) < Number(currentNum[0])) {
                olderVersion = true;
            } else if (Number(ajs_p_version[1]) < Number(currentNum[1])) {
                olderVersion = true;
            } else if (Number(ajs_p_version[2]) < Number(currentNum[2])) {
                olderVersion = true;
            };
        };

        if (!openedCnP || olderVersion) {
            this.setState({
                displayCnP: true
            });
            
            document.cookie = `ajs_p_version=${process.env.REACT_APP_VERSION}; expires=Friday, December 31, 9999 at 7:00:00 AM;`;
        };
    };

    /**
     * Handle click on cookie and policy snackbar for closing
     * @param {*} event 
     * @param {*} reason 
     * @returns 
     */
    handleClickCnPSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        };
    
        this.setState({
            displayCnP: false
        });

        document.cookie = `openedCnP=true; expires=Friday, December 31, 9999 at 7:00:00 AM;`;
    };

    /**
     * Handle click cookie and policy dialog
     */
    handleClickCnPDialog() {
        this.setState({
            displayCnP: false
        });

        this.setState({
            displayCnPDialog: !this.state.displayCnPDialog
        });

        document.cookie = `openedCnP=true; expires=Friday, December 31, 9999 at 7:00:00 AM;`;
    };

    componentDidMount() {
        this.determineCookiesAndPolicy();
    };

    render() {
        return (
            <Suspense fallback={null}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.displayCnP}
                    onClose={this.handleClickCnPSnackbar}
                    message="I use cookies to improve your experience!"
                    action={
                        <React.Fragment>
                            <Button variant="outlined" color="secondary" onClick={this.handleClickCnPDialog}>
                                See cookies & privacy policy
                            </Button>
                            <Button variant="outlined" color="secondary" className="policy-button" onClick={this.handleClickCnPSnackbar}>
                                CLOSE
                            </Button>
                        </React.Fragment>
                    }
                />

                <Dialog
                    open={this.state.displayCnPDialog}
                    onClose={this.handleClickCnPDialog}
                >
                    <DialogTitle id="cookies-and-privacy-dialog">
                        Cookies and Privacy Policy
                    </DialogTitle>
                    <DialogContent>
                        <Cookies />
                        <br/>
                        <hr />
                        <br />
                        <Privacy />
                    </DialogContent>
                </Dialog>
            </Suspense>
        );
    };
};