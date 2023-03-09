import PropTypes from 'prop-types';
import React from 'react';
import SliderControl from '../Controls/SliderControl';

const propTypes = {
    numChoices: PropTypes.number.isRequired,
    numPlayers: PropTypes.number.isRequired,
    onNumChoicesChange: PropTypes.func.isRequired,
    onNumPlayersChange: PropTypes.func.isRequired,
};

function MainSettings({
    numChoices,
    numPlayers,
    onNumChoicesChange,
    onNumPlayersChange,
}) {
    return (
        <>
            <SliderControl
                id="num-players"
                label="Number of players"
                max={12}
                min={1}
                value={numPlayers}
                onChange={onNumPlayersChange}
            />
            <SliderControl
                id="num-choices"
                label="Number of choices"
                max={6}
                min={1}
                value={numChoices}
                onChange={onNumChoicesChange}
            />
        </>
    );
}

MainSettings.propTypes = propTypes;

export default MainSettings;
