import { useContext, type SyntheticEvent } from 'react';

import AutocompleteControl from '#js/components/Controls/AutocompleteControl.tsx';
import { leaderIconSize } from '#js/constants/theme.ts';
import { LanguageContext } from '#js/contexts.ts';
import type { Leader } from '#js/types.ts';

interface BansProps {
    // The banned leaders' long names
    bans: string[];
    leaders: Leader[];
    mods: string[];
    onChange: (event: SyntheticEvent, bans: string[]) => void;
}

function Bans({
    bans,
    leaders,
    mods,
    onChange,
}: BansProps) {
    const language = useContext(LanguageContext);
    const leaderOptions = leaders
        .filter(({ mod }) => !mod || mod.every((leaderMod) => mods.includes(leaderMod)))
        .map(({ longName, image }) => ({
            value: longName,
            name: longName,
            label: (
                <div className="leader-box">
                    <img
                        alt={language('leaderAltText', { name: longName })}
                        className="leader-icon"
                        height={leaderIconSize}
                        src={`/assets/img/leader-icons/${image}`}
                        width={leaderIconSize}
                    />
                    <span className="leader-name">{`${longName}`}</span>
                </div>
            ),
        }));

    return (
        <div className="draft-settings-bans">
            <AutocompleteControl
                label={language('settings.bans')}
                options={leaderOptions}
                value={bans}
                onChange={onChange}
            />
        </div>
    );
}

export default Bans;
