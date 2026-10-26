import type { Theme } from '#js/types.ts';

function getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('theme');

    // Return saved theme if set
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }

    // Otherwise default to system theme
    const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return darkMode ? 'dark' : 'light';
}

export default getInitialTheme;
