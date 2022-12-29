import { kebabCase } from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@mui/material/styles';

import materialTheme from 'js/components/materialTheme';

/* eslint-disable react/jsx-props-no-spreading */
class SliderControl extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        max: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
    };

    render() {
        const {
            label,
            max,
            min,
            ...otherProps
        } = this.props;

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
                <ThemeProvider theme={materialTheme}>
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
}

export default SliderControl;
