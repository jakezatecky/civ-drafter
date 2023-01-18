import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import materialTheme from 'js/components/materialTheme';

class ThemeSwitcher extends Component {
    static propTypes = {
        initialTheme: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            theme: props.initialTheme,
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const { theme } = this.state;

        this.setRootTheme(theme);
    }

    onChange(event) {
        const darkMode = event.target.checked;
        const theme = darkMode ? 'dark' : 'light';

        this.setState({ theme }, () => {
            this.setRootTheme(theme);
            this.saveTheme(theme);
        });
    }

    setRootTheme(theme) {
        document.querySelector('html').dataset.bsTheme = theme;
    }

    saveTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    render() {
        const { theme } = this.state;
        const darkMode = theme === 'dark';
        const label = (
            <span className="theme-label">
                <span aria-label="Dark mode" className="fa fa-circle-half-stroke" />
            </span>
        );

        return (
            <ThemeProvider theme={materialTheme(theme)}>
                <FormControlLabel
                    control={<Switch checked={darkMode} color="default" onChange={this.onChange} />}
                    label={label}
                />
            </ThemeProvider>
        );
    }
}

export default ThemeSwitcher;
