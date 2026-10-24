import PropTypes from 'prop-types';
import { useContext } from 'react';

import SliderControl from '#js/components/Controls/SliderControl.jsx';
import { choiceLimits, playerLimits } from '#js/constants/settings.js';
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
                max={playerLimits.max}
                min={playerLimits.min}
                value={numPlayers}
                onChange={onNumPlayersChange}
            />
            <SliderControl
                id="num-choices"
                label={language('settings.numChoices')}
                max={choiceLimits.max}
                min={choiceLimits.min}
                value={numChoices}
                onChange={onNumChoicesChange}
            />
        </>
    );
}

MainSettings.propTypes = propTypes;

export default MainSettings;
