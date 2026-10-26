import { marked } from 'marked';

import RawHtml from '#js/components/Utils/RawHtml.tsx';

interface MarkdownTextProps {
    text: string;
}

function MarkdownText({ text }: MarkdownTextProps) {
    return (
        <RawHtml
            className="markdown-wrapper markdown-wrapper-inline"
            html={marked.parseInline(text, { async: false })}
        />
    );
}

export default MarkdownText;
