function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');

    // Return saved theme if set
    if (savedTheme) {
        return savedTheme;
    }

    // Otherwise default to system theme
    const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return darkMode ? 'dark' : 'light';
}

export default getInitialTheme;
