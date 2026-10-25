import { createTheme, sliderClasses } from '@mui/material';

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
        // Use the page's font, rather than Roboto, which is not loaded
        typography: {
            fontFamily: 'inherit',
            allVariants: {
                letterSpacing: 'normal',
            },
        },
        components: {
            // Match the text colors of our other form controls
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        color: 'var(--btn-input-fg)',
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        color: 'var(--placeholder-color)',
                    },
                },
            },
            MuiAutocomplete: {
                styleOverrides: {
                    paper: {
                        color: 'var(--fg-body)',
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        color: 'var(--fg-body)',
                    },
                },
            },
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
                    markLabel: {
                        color: 'var(--placeholder-color)',

                        [`&.${sliderClasses.markLabelActive}`]: {
                            color: 'var(--fg-body)',
                        },
                    },
                },
            },
        },
    });
}

export default getTheme;
