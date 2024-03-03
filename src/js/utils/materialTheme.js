import { createTheme } from '@mui/material';

import { primaryColor, secondaryColor } from '#js/constants/theme.js';

function getTheme(mode = 'light') {
    return createTheme({
        palette: {
            mode,
            primary: {
                main: primaryColor,
            },
            secondary: {
                main: secondaryColor,
            },
        },
    });
}

export default getTheme;
