import PropTypes from 'prop-types';
import React from 'react';
import CheckboxTree from 'react-checkbox-tree';

import dlcNodes from 'json/dlc-tree.json';

const propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        enabledDlc: PropTypes.arrayOf(PropTypes.string).isRequired,
    })).isRequired,
    onChange: PropTypes.func.isRequired,
};

function Players({ players, onChange }) {
    const playerList = players.map(({ name, enabledDlc }, playerIndex) => (
        <li key={name}>
            <h4>{name}</h4>
            <CheckboxTree
                checked={enabledDlc}
                expanded={[name]}
                id={`setting-player-dlc-${playerIndex}`}
                nodes={dlcNodes}
                showNodeIcon={false}
                onCheck={onChange(playerIndex)}
            />
        </li>
    ));

    return (
        <div className="draft-settings-dlc">
            <ol className="draft-settings-players">{playerList}</ol>
        </div>
    );
}

Players.propTypes = propTypes;

export default Players;
