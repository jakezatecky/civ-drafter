import { assert } from 'chai';
import { render } from '@testing-library/react';

import MarkdownText from '#js/components/Utils/MarkdownText.jsx';

describe('<MarkdownText />', () => {
    it('should only add the wrapper classes when no class name is given', () => {
        const { container } = render(<MarkdownText text="**Oops!**" />);

        assert.equal(container.firstChild.className, 'markdown-wrapper markdown-wrapper-inline');
    });

    it('should add the given class name', () => {
        const { container } = render(<MarkdownText className="alert-text" text="Text" />);

        assert.isTrue(container.firstChild.classList.contains('alert-text'));
    });
});
