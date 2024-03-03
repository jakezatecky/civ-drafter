import kebabCase from 'lodash/kebabCase.js';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { Slider, ThemeProvider } from '@mui/material';

import { ThemeContext } from '#js/contexts.js';
import materialTheme from '#js/utils/materialTheme.js';

const propTypes = {
    label: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,

    id: PropTypes.string,
};

/* eslint-disable react/jsx-props-no-spreading */
function SliderControl({
    label,
    min,
    max,
    id = null,
    ...otherProps
}) {
    const theme = useContext(ThemeContext);

    // Derive ID from label
    const sliderId = id || kebabCase(label);

    // Construct label marks underneath
    const numberOfMarks = max - min + 1;
    const marks = [...Array(numberOfMarks).keys()].map((number) => (
        { label: number + 1, value: number + 1 }
    ));

    return (
        <div className="control-range">
            <label className="form-label" id={sliderId}>
                {label}
            </label>
            <ThemeProvider theme={materialTheme(theme)}>
                <Slider
                    aria-label={label}
                    aria-labelledby={sliderId}
                    marks={marks}
                    max={max}
                    min={min}
                    steps={1}
                    valueLabelDisplay="auto"
                    {...otherProps}
                />
            </ThemeProvider>
        </div>
    );
}

SliderControl.propTypes = propTypes;

export default SliderControl;
