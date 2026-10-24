import PropTypes from 'prop-types';
import { Autocomplete, Box, TextField } from '@mui/material';

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
    const formattedOptions = options.map(({ value }) => value);
    const optionMap = getOptionMap(options);

    // MUI keeps rendering the options from when the list was last open, so that the list can fade
    // out, and those may no longer be among the current options (such as when disabling a mod
    // removes its leaders). Fall back to the value itself for any option that is now missing.
    const getOption = (value) => optionMap[value] ?? { name: String(value) };

    return (
        <Autocomplete
            getOptionLabel={(value) => getOption(value).name}
            multiple
            options={formattedOptions}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                />
            )}
            // React requires `key` to be passed directly, rather than spread with the other props
            renderOption={({ key, ...props }, value) => (
                <Box key={key} component="li" {...props}>
                    {getOption(value).label || getOption(value).name}
                </Box>
            )}
            {...otherProps}
        />
    );
}

AutocompleteControl.propTypes = propTypes;

export default AutocompleteControl;
