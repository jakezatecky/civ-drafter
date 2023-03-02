import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import materialTheme from 'js/components/materialTheme';
import ThemeContext from 'js/context/ThemeContext';

const propTypes = {
    label: PropTypes.node.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

            label: PropTypes.node,
        }),
    ).isRequired,
};

/**
 * Material UI's autocomplete component's idiotic design requires that the `value` property also
 * have all attributes of the original option, rather than referencing the original option for those
 * attributes.
 *
 * This means we cannot have simple values, like an array of strings, without creating a map object
 * for the functions to reference.
 *
 * @param {Object} options
 *
 * @returns {Object}
 */
function getOptionMap(options) {
    const optionMap = {};

    options.forEach((option) => {
        const { value } = option;
        optionMap[value] = option;
    });

    return optionMap;
}

/* eslint-disable react/jsx-props-no-spreading */
function AutocompleteControl({ label, options, ...otherProps }) {
    const theme = useContext(ThemeContext);
    const formattedOptions = options.map(({ value }) => value);
    const optionMap = getOptionMap(options);

    return (
        <ThemeProvider theme={materialTheme(theme)}>
            <Autocomplete
                getOptionLabel={(value) => optionMap[value].name}
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
                        {optionMap[value].label || optionMap[value].name}
                    </Box>
                )}
                {...otherProps}
            />
        </ThemeProvider>
    );
}

AutocompleteControl.propTypes = propTypes;

export default AutocompleteControl;
