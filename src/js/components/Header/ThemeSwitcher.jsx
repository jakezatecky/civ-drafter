import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useCallback, useContext } from 'react';

import { LanguageContext } from '#js/contexts.js';

const propTypes = {
    theme: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

function ThemeSwitcher({ theme, onChange }) {
    const language = useContext(LanguageContext);
    const isDarkMode = theme === 'dark';

    // Toggle the user's theme
    const onClick = useCallback(() => {
        onChange(isDarkMode ? 'light' : 'dark');
    }, [isDarkMode, onChange]);

    const label = isDarkMode ? language('theme.switchLight') : language('theme.switchDark');
    const className = classNames({
        'header-action': true,
        'theme-switcher': true,
        'theme-switcher-dark': isDarkMode,
    });

    return (
        <button
            aria-label={label}
            className={className}
            title={label}
            type="button"
            onClick={onClick}
        >
            <span className="fa fa-circle-half-stroke" />
        </button>
    );
}

ThemeSwitcher.propTypes = propTypes;

export default ThemeSwitcher;
