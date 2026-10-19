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
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    // Match the accessible border color of our other form controls
                    notchedOutline: {
                        borderColor: 'var(--draft-border-color)',
                    },
                },
            },
        },
    });
}

export default getTheme;
