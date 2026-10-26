import { useContext, type ChangeEvent } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { LanguageContext } from '#js/contexts.ts';
import type { PlayerSettings } from '#js/types.ts';
import dlcNodes from '#json/dlc-tree.json';

interface PlayersProps {
    players: PlayerSettings[];
    // Return a handler that updates one setting of one player
    onChange: <Key extends keyof PlayerSettings>(
        playerIndex: number,
        settingsKey: Key,
    ) => (newValue: PlayerSettings[Key]) => void;
}

function Players({ players, onChange }: PlayersProps) {
    const language = useContext(LanguageContext);
    const onNameChange = (playerIndex: number) => (
        (event: ChangeEvent<HTMLInputElement>) => {
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
            <div
                aria-label={language('settings.playerDlc')}
                className="draft-settings-dlc"
                role="group"
            >
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

export default Players;
