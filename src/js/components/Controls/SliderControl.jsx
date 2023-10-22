import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@mui/material/styles';

import { ThemeContext } from 'js/contexts';
import materialTheme from 'js/utils/materialTheme';

const propTypes = {
    label: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
};

/* eslint-disable react/jsx-props-no-spreading */
function SliderControl(props) {
    const {
        label,
        max,
        min,
        ...otherProps
    } = props;
    const theme = useContext(ThemeContext);

    // Derive ID from label
    const id = otherProps.id || kebabCase(label);

    // Construct label marks underneath
    const numberOfMarks = max - min + 1;
    const marks = [...Array(numberOfMarks).keys()].map((number) => (
        { label: number + 1, value: number + 1 }
    ));

    return (
        <div className="control-range">
            <label className="form-label" htmlFor={id}>
                {label}
            </label>
            <ThemeProvider theme={materialTheme(theme)}>
                <Slider
                    aria-label={label}
                    id={id}
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
