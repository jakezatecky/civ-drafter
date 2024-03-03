import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { LanguageContext } from '#js/contexts.js';
import dlcNodes from '#json/dlc-tree.json';

const propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        enabledDlc: PropTypes.arrayOf(PropTypes.string).isRequired,
    })).isRequired,
    onChange: PropTypes.func.isRequired,
};

function Players({ players, onChange }) {
    const language = useContext(LanguageContext);
    const onNameChange = (playerIndex) => (
        (event) => {
            onChange(playerIndex, 'name')(event.target.value);
        }
    );

    /* eslint-disable react/no-array-index-key */
    const playerList = players.map(({ name, enabledDlc }, playerIndex) => (
        <li key={playerIndex}>
            <h4 className="visually-hidden">
                {name}
            </h4>
            <input
                aria-label={language('settings.playerName')}
                className="form-control"
                type="text"
                value={name}
                onChange={onNameChange(playerIndex)}
            />
            <div aria-label={language('settings.playerDlc')} className="draft-settings-dlc">
                <CheckboxTree
                    checked={enabledDlc}
                    expanded={[]}
                    id={`settings-player-dlc-${playerIndex}`}
                    nodes={dlcNodes}
                    showNodeIcon={false}
                    onCheck={onChange(playerIndex, 'enabledDlc')}
                />
            </div>
        </li>
    ));
    /* eslint-enable react/no-array-index-key */

    return (
        <div className="draft-settings-players">
            <ol>{playerList}</ol>
        </div>
    );
}

Players.propTypes = propTypes;

export default Players;
