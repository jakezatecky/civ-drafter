import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { ThemeProvider } from '@mui/material';

import DraftArea from '#js/components/DraftArea.tsx';
import HeaderActions from '#js/components/Header/HeaderActions.tsx';
import { trollFactor } from '#js/constants/calculation.ts';
import type { Theme } from '#js/types.ts';
import materialTheme from '#js/utils/materialTheme.ts';
import leaders from '#json/leaders.json';

interface AppProps {
    headerActionsContainer: Element;
    initialTheme: Theme;
}

function App({ headerActionsContainer, initialTheme }: AppProps) {
    const [theme, setTheme] = useState(initialTheme);
    const muiTheme = useMemo(() => materialTheme(theme), [theme]);

    // Apply the theme to the whole page, including the parts that React does not render
    useEffect(() => {
        document.documentElement.dataset.bsTheme = theme;
    }, [theme]);

    // Save the user's choice for future visits
    const onThemeChange = useCallback((newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }, []);

    return (
        <ThemeProvider theme={muiTheme}>
            <DraftArea leaders={leaders} trollFactor={trollFactor} />
            {/* The header sits outside the main mount point */}
            {createPortal(
                <HeaderActions theme={theme} onThemeChange={onThemeChange} />,
                headerActionsContainer,
            )}
        </ThemeProvider>
    );
}

export default App;
