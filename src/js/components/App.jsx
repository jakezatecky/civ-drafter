import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import DraftArea from '#js/components/DraftArea.jsx';
import HeaderActions from '#js/components/Header/HeaderActions.jsx';
import { trollFactor } from '#js/constants/calculation.js';
import { ThemeContext } from '#js/contexts.js';
import leaders from '#json/leaders.json';

const propTypes = {
    headerActionsContainer: PropTypes.instanceOf(Element).isRequired,
    initialTheme: PropTypes.string.isRequired,
};

function App({ headerActionsContainer, initialTheme }) {
    const [theme, setTheme] = useState(initialTheme);

    // Apply the theme to the whole page, including the parts that React does not render
    useEffect(() => {
        document.documentElement.dataset.bsTheme = theme;
    }, [theme]);

    // Save the user's choice for future visits
    const onThemeChange = useCallback((newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            <DraftArea leaders={leaders} trollFactor={trollFactor} />
            {/* The header sits outside of the main mount point */}
            {createPortal(
                <HeaderActions theme={theme} onThemeChange={onThemeChange} />,
                headerActionsContainer,
            )}
        </ThemeContext.Provider>
    );
}

App.propTypes = propTypes;

export default App;
