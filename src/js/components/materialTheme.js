import { createTheme } from '@mui/material/styles';

import { primaryColor, secondaryColor } from 'js/constants/theme';

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
