import { DELAYS } from '@constants/index';
import { debounce } from 'lodash';

/** Prints the site's ASCII-art logo to the browser console. */
export function consoleLogLogo() {
	console.log(`
                     #+.
               =######%##-
           -+#################=
            -#################.
            *##################
            ##############+*###*
            =######*:......+####
            : :.*=....*=...+####
              ..*.....*-...*=.*
              :....-...........
               =............-
                  -=:..:-=
               *%@@%+-=#*:
            +++++++*@@@@@@@
            ++=..++*@@@@@@@#
            +++++++*+@@@@@@@.
           ..::@@@=..#@%###*
           :=:.@@@*+:....-..

   Welcome to my portfolio! Here you can view a showcase of the projects I've worked on, as well as my publications, resume and contact information & socials. Enjoy!
   `);
}

/**
 * Debounced {@link consoleLogLogo}, so repeated calls print the logo once.
 *
 * Change `DELAYS.CONSOLE_LOGO_DEBOUNCE` in the constants module to adjust the window.
 */
export const debounceConsoleLogLogo = debounce(consoleLogLogo, DELAYS.CONSOLE_LOGO_DEBOUNCE);
