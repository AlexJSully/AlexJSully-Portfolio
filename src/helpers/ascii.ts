import { DELAYS } from '@constants/index';
import { debounce } from 'lodash';

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

export const debounceConsoleLogLogo = debounce(consoleLogLogo, DELAYS.CONSOLE_LOGO_DEBOUNCE);
