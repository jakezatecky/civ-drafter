import { useContext } from 'react';

import MarkdownText from '#js/components/Utils/MarkdownText.tsx';
import { LanguageContext } from '#js/contexts.ts';

interface LanguageTextProps {
    keyName: string;
    variables?: Record<string, string>;
}

function LanguageText({ keyName, variables = {} }: LanguageTextProps) {
    const language = useContext(LanguageContext);

    return <MarkdownText text={language(keyName, variables)} />;
}

export default LanguageText;
