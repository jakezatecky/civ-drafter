import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import materialTheme from 'js/components/materialTheme';

/* eslint-disable react/jsx-props-no-spreading */
class AutocompleteControl extends PureComponent {
    static propTypes = {
        label: PropTypes.node.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                label: PropTypes.node,
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            }),
        ).isRequired,
    };

    render() {
        const { label, options, ...otherProps } = this.props;

        return (
            <ThemeProvider theme={materialTheme}>
                <Autocomplete
                    getOptionLabel={({ name }) => name}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    multiple
                    options={options}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            {option.label || option.name}
                        </Box>
                    )}
                    {...otherProps}
                />
            </ThemeProvider>
        );
    }
}

export default AutocompleteControl;
