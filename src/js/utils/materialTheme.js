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
            MuiSlider: {
                styleOverrides: {
                    // Reserve only the room the mark labels need, so that sliders are followed by
                    // the same spacing as other controls
                    marked: {
                        marginBottom: '0.75rem',
                    },
                },
            },
        },
    });
}

export default getTheme;
