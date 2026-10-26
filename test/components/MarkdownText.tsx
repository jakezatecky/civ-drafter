import { assert } from 'chai';
import { render } from '@testing-library/react';

import MarkdownText from '#js/components/Utils/MarkdownText.tsx';

describe('<MarkdownText />', () => {
    it('should render the markdown as an inline wrapper', () => {
        const { container } = render(<MarkdownText text="**Oops!** All Gorgo!" />);
        const markdownWrapper = container.firstElementChild;

        assert.isNotNull(markdownWrapper);
        assert.equal(markdownWrapper.className, 'markdown-wrapper markdown-wrapper-inline');
        assert.equal(markdownWrapper.innerHTML, '<strong>Oops!</strong> All Gorgo!');
    });
});
