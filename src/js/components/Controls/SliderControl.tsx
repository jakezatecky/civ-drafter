import kebabCase from 'lodash/kebabCase.js';
import { Slider, type SliderProps } from '@mui/material';

// Any other props are passed through to Material UI's `Slider`, for a single value
interface SliderControlProps extends SliderProps<'span', object, number> {
    label: string;
    max: number;
    min: number;
    // Defaults to the label in kebab case
    id?: string;
}

/* eslint-disable react/jsx-props-no-spreading */
function SliderControl({
    label,
    min,
    max,
    id = kebabCase(label),
    ...otherProps
}: SliderControlProps) {
    // Construct label marks underneath
    const numberOfMarks = max - min + 1;
    const marks = [...Array(numberOfMarks).keys()].map((offset) => (
        { label: min + offset, value: min + offset }
    ));

    return (
        <div className="control-range">
            <label className="form-label" id={id}>
                {label}
            </label>
            <Slider
                aria-label={label}
                aria-labelledby={id}
                marks={marks}
                max={max}
                min={min}
                valueLabelDisplay="auto"
                {...otherProps}
            />
        </div>
    );
}

export default SliderControl;
