import { useContext } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { LanguageContext } from '#js/contexts.ts';
import duplicationNodes from '#json/duplication-tree.json';

interface DuplicationsProps {
    duplications: string[];
    onChange: (duplications: string[]) => void;
}

function Duplications({ duplications, onChange }: DuplicationsProps) {
    const language = useContext(LanguageContext);

    return (
        <div
            aria-label={language('settings.duplications')}
            className="draft-settings-duplications"
            role="group"
        >
            <CheckboxTree
                checked={duplications}
                expanded={[]}
                id="settings-duplications"
                nodes={duplicationNodes}
                showNodeIcon={false}
                onCheck={onChange}
            />
        </div>
    );
}

export default Duplications;
