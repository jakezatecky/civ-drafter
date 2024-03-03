import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { LanguageContext } from '#js/contexts.js';

const propTypes = {
    initialTheme: PropTypes.string.isRequired,
};

function setRootTheme(theme) {
    document.querySelector('html').dataset.bsTheme = theme;
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

function ThemeSwitcher({ initialTheme }) {
    const language = useContext(LanguageContext);
    const [theme, setTheme] = useState(initialTheme);
    const isFirstRender = useRef(true);
    const isDarkMode = theme === 'dark';

    // Set initial root theme
    useEffect(() => {
        setRootTheme(theme);
    }, []);

    // Save user's changes
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setRootTheme(theme);
        saveTheme(theme);
    }, [theme]);

    // Toggle the user's theme
    const onChange = useCallback(() => {
        setTheme(isDarkMode ? 'light' : 'dark');
    }, [theme]);

    const label = isDarkMode ? language('theme.switchLight') : language('theme.switchDark');
    const className = classNames({
        'header-action': true,
        'theme-switcher': true,
        'theme-dark': isDarkMode,
        'theme-light': !isDarkMode,
    });

    return (
        <button
            aria-label={label}
            className={className}
            title={label}
            type="button"
            onClick={onChange}
        >
            <span className="fa fa-circle-half-stroke" />
        </button>
    );
}

ThemeSwitcher.propTypes = propTypes;

export default ThemeSwitcher;
