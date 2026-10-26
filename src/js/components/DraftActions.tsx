import { useContext } from 'react';

import CopyToClipboard from '#js/components/Utils/CopyToClipboard.tsx';
import { LanguageContext } from '#js/contexts.ts';
import type { DraftResults } from '#js/types.ts';

interface DraftActionsProps {
    results?: DraftResults | null;
}

function DraftActions({ results = null }: DraftActionsProps) {
    const language = useContext(LanguageContext);
    const hasDraftResults = results !== null && !('error' in results);

    return (
        <div className="draft-actions">
            <button className="btn-submit" form="draft-form" type="submit">
                {language('actions.draft')}
            </button>
            {hasDraftResults ? (
                <CopyToClipboard domSelector=".draft-results" />
            ) : null}
        </div>
    );
}

export default DraftActions;
