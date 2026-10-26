import { useContext } from 'react';

import SliderControl from '#js/components/Controls/SliderControl.tsx';
import { choiceLimits, playerLimits } from '#js/constants/settings.ts';
import { LanguageContext } from '#js/contexts.ts';

interface MainSettingsProps {
    numChoices: number;
    numPlayers: number;
    onNumChoicesChange: (event: Event, numChoices: number) => void;
    onNumPlayersChange: (event: Event, numPlayers: number) => void;
}

function MainSettings({
    numChoices,
    numPlayers,
    onNumChoicesChange,
    onNumPlayersChange,
}: MainSettingsProps) {
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

export default MainSettings;
