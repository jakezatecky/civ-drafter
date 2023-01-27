import PropTypes from 'prop-types';
import React, { Component } from 'react';

import DraftArea from 'js/components/DraftArea';
import ThemeContext from 'js/context/ThemeContext';

class App extends Component {
    static propTypes = {
        initialTheme: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = { theme: props.initialTheme };
        this.onThemeChange = this.onThemeChange.bind(this);
    }

    componentDidMount() {
        this.watchThemeChange();
    }

    onThemeChange(theme) {
        this.setState({ theme });
    }

    /**
     * Observe the HTML root for any theme changes.
     *
     * @returns {void}
     */
    watchThemeChange() {
        const htmlRoot = document.querySelector('html');
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    this.onThemeChange(htmlRoot.dataset.bsTheme);
                }
            });
        });
        observer.observe(htmlRoot, { attributes: true });
    }

    render() {
        const { theme } = this.state;

        return (
            <ThemeContext.Provider value={theme}>
                <DraftArea />
            </ThemeContext.Provider>
        );
    }
}

export default App;
