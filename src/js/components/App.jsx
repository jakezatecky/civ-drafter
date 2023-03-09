import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import DraftArea from 'js/components/DraftArea';
import ThemeContext from 'js/contexts/ThemeContext';
import leaders from 'json/leaders.json';

const propTypes = {
    initialTheme: PropTypes.string.isRequired,
};

function App({ initialTheme }) {
    const [theme, setTheme] = useState(initialTheme);

    // Observe the HTML root for any theme changes.
    useEffect(() => {
        const htmlRoot = document.querySelector('html');
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    setTheme(htmlRoot.dataset.bsTheme);
                }
            });
        });

        observer.observe(htmlRoot, { attributes: true });
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            <DraftArea leaders={leaders} />
        </ThemeContext.Provider>
    );
}

App.propTypes = propTypes;

export default App;
