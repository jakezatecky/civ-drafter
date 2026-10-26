import {
    Autocomplete,
    Box,
    TextField,
    type AutocompleteProps,
} from '@mui/material';
import type { ReactNode } from 'react';

interface AutocompleteOption {
    name: string;
    value: string;
    label?: ReactNode;
}

// Material UI's `Autocomplete` props, for multiple string values
type MuiProps = AutocompleteProps<string, true, false, false>;

// Any other props are passed through to Material UI's `Autocomplete`, which works with the
// options' values rather than the options themselves
interface AutocompleteControlProps extends Partial<Omit<MuiProps, 'options'>> {
    label: ReactNode;
    options: AutocompleteOption[];
}

/**
 * Material UI's autocomplete component's idiotic design requires that the `value` property also
 * have all attributes of the original option, rather than referencing the original option for those
 * attributes.
 *
 * This means we cannot have simple values, like an array of strings, without creating a map object
 * for the functions to reference.
 */
function getOptionMap(options: AutocompleteOption[]): Record<string, AutocompleteOption> {
    const optionMap: Record<string, AutocompleteOption> = {};

    options.forEach((option) => {
        const { value } = option;
        optionMap[value] = option;
    });

    return optionMap;
}

/* eslint-disable react/jsx-props-no-spreading */
function AutocompleteControl({
    label,
    options,
    ...otherProps
}: AutocompleteControlProps) {
    const formattedOptions = options.map(({ value }) => value);
    const optionMap = getOptionMap(options);

    // MUI keeps rendering the options from when the list was last open, so that the list can fade
    // out, and those may no longer be among the current options (such as when disabling a mod
    // removes its leaders). Fall back to the value itself for any option that is now missing.
    const getOption = (value: string): AutocompleteOption => (
        optionMap[value] ?? { name: value, value }
    );

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

export default AutocompleteControl;
