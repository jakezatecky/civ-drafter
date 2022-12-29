import { createTheme } from '@mui/material/styles';

import { primaryColor, secondaryColor } from 'js/constants/theme';

export default createTheme({
    palette: {
        type: 'light',
        primary: {
            main: primaryColor,
        },
        secondary: {
            main: secondaryColor,
        },
    },
});
