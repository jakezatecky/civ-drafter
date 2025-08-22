import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import AutocompleteControl from '#js/components/Controls/AutocompleteControl.jsx';
import leaderShape from '#js/shapes/leaderShape.js';
import { LanguageContext } from '#js/contexts.js';

const propTypes = {
    bans: PropTypes.arrayOf(PropTypes.string).isRequired,
    leaders: PropTypes.arrayOf(leaderShape).isRequired,
    mods: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
};

function Bans({
    bans,
    leaders,
    mods,
    onChange,
}) {
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
                        src={`/assets/img/leader-icons/${image}`}
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

Bans.propTypes = propTypes;

export default Bans;
