import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import CheckboxTree from 'react-checkbox-tree';

import { LanguageContext } from 'js/contexts';
import duplicationNodes from 'json/duplication-tree.json';

const propTypes = {
    duplications: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
};

function Duplications({ duplications, onChange }) {
    const language = useContext(LanguageContext);

    return (
        <div aria-label={language('settings.playerDlc')} className="draft-settings-duplications">
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

Duplications.propTypes = propTypes;

export default Duplications;
