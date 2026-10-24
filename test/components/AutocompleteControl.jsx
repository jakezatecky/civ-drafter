import { assert } from 'chai';
import { fireEvent, render, screen } from '@testing-library/react';

import AutocompleteControl from '#js/components/Controls/AutocompleteControl.jsx';

const options = [
    { value: 'Alexander (Macedonian)', name: 'Alexander (Macedonian)' },
    { value: 'Ahiram (Phoenician)', name: 'Ahiram (Phoenician)' },
];

function renderControl(controlOptions) {
    return (
        <AutocompleteControl
            label="Banned leaders"
            options={controlOptions}
            value={[]}
            onChange={() => {}}
        />
    );
}

describe('<AutocompleteControl />', () => {
    // MUI keeps rendering the options from when the list was last open, so that the list can fade
    // out. Those options may no longer be among the current ones, such as when disabling a mod
    // removes its leaders.
    it('should not crash when a previously listed option is removed', () => {
        const { rerender } = render(renderControl(options));
        const input = screen.getByRole('combobox', { name: 'Banned leaders' });

        // Open and close the list while it shows every option
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        assert.equal(screen.getAllByRole('option').length, 2);
        fireEvent.keyDown(input, { key: 'Escape' });

        rerender(renderControl(options.slice(0, 1)));

        // Reopening shows only the current options
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        const listedOptions = screen.getAllByRole('option').map(({ textContent }) => textContent);
        assert.deepEqual(listedOptions, ['Alexander (Macedonian)']);
    });
});
