import classNames from 'classnames';
import { useCallback, useContext } from 'react';

import { LanguageContext } from '#js/contexts.ts';
import type { Theme } from '#js/types.ts';

interface ThemeSwitcherProps {
    theme: Theme;
    onChange: (theme: Theme) => void;
}

function ThemeSwitcher({ theme, onChange }: ThemeSwitcherProps) {
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

export default ThemeSwitcher;
