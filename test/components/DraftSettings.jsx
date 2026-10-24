import { assert } from 'chai';
import { render, screen } from '@testing-library/react';

import DraftSettings from '#js/components/DraftSettings.jsx';
import english from '#json/language/en.json';
import wrapper from '../languageWrapper.jsx';

const leaders = [
    {
        id: 'Alexander',
        civilization: 'Macedonian',
        shortName: 'Alexander',
        longName: 'Alexander (Macedonian)',
        image: 'blank.png',
        dlc: ['Vanilla'],
    },
];

function renderSettings() {
    render(<DraftSettings leaders={leaders} onSubmit={() => {}} />, { wrapper });
}

function getPlayerNames() {
    return screen.getAllByRole('textbox', { name: 'Player name' }).map(({ value }) => value);
}

describe('<DraftSettings />', () => {
    afterEach(() => {
        localStorage.removeItem('draftSettings');
    });

    it('should load valid stored settings without an alert', () => {
        const storedSettings = JSON.stringify({
            numPlayers: 2,
            players: [
                { name: 'Alex', enabledDlc: ['Vanilla'] },
                { name: 'Emma', enabledDlc: ['Vanilla'] },
            ],
        });
        localStorage.setItem('draftSettings', storedSettings);

        renderSettings();

        assert.deepEqual(getPlayerNames(), ['Alex', 'Emma']);
        assert.isNull(screen.queryByRole('alert'));
        assert.equal(localStorage.getItem('draftSettings'), storedSettings);
    });

    it('should alert, use the defaults, and remove corrupt settings', () => {
        localStorage.setItem('draftSettings', '{"numPlayers": 4,');

        renderSettings();

        assert.equal(screen.getByRole('alert').textContent.trim(), english.error.invalidStored);
        assert.equal(getPlayerNames().length, 6);
        assert.isNull(localStorage.getItem('draftSettings'));
    });
});
