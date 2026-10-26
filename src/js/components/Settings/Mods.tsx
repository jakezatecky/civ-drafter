import { useContext } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { LanguageContext } from '#js/contexts.ts';
import modsNodes from '#json/mods-tree.json';

interface ModsProps {
    mods: string[];
    onChange: (mods: string[]) => void;
}

function Mods({ mods, onChange }: ModsProps) {
    const language = useContext(LanguageContext);

    return (
        <div aria-label={language('settings.enabledMods')} role="group">
            <CheckboxTree
                checked={mods}
                expanded={[]}
                id="settings-mods"
                nodes={modsNodes}
                showNodeIcon={false}
                onCheck={onChange}
            />
        </div>
    );
}

export default Mods;
