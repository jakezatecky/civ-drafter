import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import materialTheme from 'js/components/materialTheme';
import ThemeContext from 'js/context/ThemeContext';

/* eslint-disable react/jsx-props-no-spreading */
class AutocompleteControl extends PureComponent {
    static contextType = ThemeContext;

    static propTypes = {
        label: PropTypes.node.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

                label: PropTypes.node,
            }),
        ).isRequired,
    };

    constructor(props) {
        super(props);

        this.optionMap = this.getOptionMap(props);
    }

    /**
     * Material UI's autocomplete component's idiotic design requires that the `value` property also
     * have all attributes of the original option, rather than referencing the original option for
     * those attributes.
     *
     * This means we cannot have simple values, like an array of strings, without creating a map
     * object for the functions to reference.
     *
     * @param {Object} options
     *
     * @returns {Object}
     */
    getOptionMap({ options }) {
        const optionMap = {};

        options.forEach((option) => {
            const { value } = option;
            optionMap[value] = option;
        });

        return optionMap;
    }

    render() {
        const { label, options, ...otherProps } = this.props;
        const formattedOptions = options.map(({ value }) => value);

        return (
            <ThemeProvider theme={materialTheme(this.context)}>
                <Autocomplete
                    getOptionLabel={(value) => this.optionMap[value].name}
                    multiple
                    options={formattedOptions}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                        />
                    )}
                    renderOption={(props, value) => (
                        <Box component="li" {...props}>
                            {this.optionMap[value].label || this.optionMap[value].name}
                        </Box>
                    )}
                    {...otherProps}
                />
            </ThemeProvider>
        );
    }
}

export default AutocompleteControl;
