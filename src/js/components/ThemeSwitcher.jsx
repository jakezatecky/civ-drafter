import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

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

    const label = isDarkMode ? 'Switch to light theme' : 'Switch to dark theme';
    const className = classNames({
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
