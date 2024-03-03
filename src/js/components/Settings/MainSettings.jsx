import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import SliderControl from '#js/components/Controls/SliderControl.jsx';
import { LanguageContext } from '#js/contexts.js';

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
    const language = useContext(LanguageContext);

    return (
        <>
            <SliderControl
                id="num-players"
                label={language('settings.numPlayers')}
                max={12}
                min={1}
                value={numPlayers}
                onChange={onNumPlayersChange}
            />
            <SliderControl
                id="num-choices"
                label={language('settings.numChoices')}
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
