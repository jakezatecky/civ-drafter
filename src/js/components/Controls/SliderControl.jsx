import kebabCase from 'lodash/kebabCase.js';
import PropTypes from 'prop-types';
import { Slider } from '@mui/material';

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
    // Derive ID from label
    const sliderId = id || kebabCase(label);

    // Construct label marks underneath
    const numberOfMarks = max - min + 1;
    const marks = [...Array(numberOfMarks).keys()].map((offset) => (
        { label: min + offset, value: min + offset }
    ));

    return (
        <div className="control-range">
            <label className="form-label" id={sliderId}>
                {label}
            </label>
            <Slider
                aria-label={label}
                aria-labelledby={sliderId}
                marks={marks}
                max={max}
                min={min}
                valueLabelDisplay="auto"
                {...otherProps}
            />
        </div>
    );
}

SliderControl.propTypes = propTypes;

export default SliderControl;
