import { useCallback, useContext, useState } from 'react';

import draftLeaders, { NotEnoughLeadersError } from '#js/calculation/draftLeaders.ts';
import withTrollResults from '#js/calculation/withTrollResults.ts';
import DraftActions from '#js/components/DraftActions.tsx';
import DraftResults from '#js/components/DraftResults.tsx';
import DraftSettings from '#js/components/DraftSettings.tsx';
import { LanguageContext } from '#js/contexts.ts';
import type {
    DraftResults as DraftResultsType,
    DraftSettings as Settings,
    Leader,
} from '#js/types.ts';

interface DraftAreaProps {
    leaders: Leader[];
    // One in this many drafts trolls the players; 0 disables it
    trollFactor?: number;
}

function DraftArea({ leaders, trollFactor = 0 }: DraftAreaProps) {
    const [results, setResults] = useState<DraftResultsType | null>(null);
    const language = useContext(LanguageContext);
    const onSubmit = useCallback((settings: Settings) => {
        try {
            setResults(withTrollResults(draftLeaders(leaders, settings), trollFactor));
        } catch (error) {
            if (error instanceof NotEnoughLeadersError) {
                setResults({
                    error: language('error.notEnoughLeaders', {
                        totalChoices: error.totalChoices,
                        availableLeaders: error.availableLeaders,
                    }),
                });
            } else {
                throw error;
            }
        }
    }, [leaders, trollFactor, language]);

    return (
        <section className="draft-area">
            <h1 className="visually-hidden">{language('mainHeader')}</h1>
            <DraftSettings leaders={leaders} onSubmit={onSubmit} />
            <DraftActions results={results} />
            {results !== null ? <DraftResults results={results} /> : null}
        </section>
    );
}

export default DraftArea;
