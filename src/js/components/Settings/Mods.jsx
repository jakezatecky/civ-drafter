import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { LanguageContext } from '#js/contexts.js';
import modsNodes from '#json/mods-tree.json';

const propTypes = {
    mods: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
};

function Mods({ mods, onChange }) {
    const language = useContext(LanguageContext);

    return (
        <div aria-label={language('settings.enabledMods')}>
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

Mods.propTypes = propTypes;

export default Mods;
