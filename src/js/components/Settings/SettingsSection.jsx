import PropTypes from 'prop-types';

import AccordionIcon from '#js/components/Utils/AccordionIcon.jsx';

const propTypes = {
    children: PropTypes.node.isRequired,
    header: PropTypes.node.isRequired,

    defaultOpen: PropTypes.bool,
};

function SettingsSection({ header, children, defaultOpen = false }) {
    return (
        <details className="accordion-item" open={defaultOpen}>
            <summary className="accordion-header">
                <h3>{header}</h3>
                <AccordionIcon />
            </summary>
            <div className="accordion-body">{children}</div>
        </details>
    );
}

SettingsSection.propTypes = propTypes;

export default SettingsSection;
