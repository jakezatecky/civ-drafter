import PropTypes from 'prop-types';
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

const propTypes = {
    children: PropTypes.node.isRequired,
    eventKey: PropTypes.string.isRequired,
    header: PropTypes.node.isRequired,
};

function SettingsSection({ eventKey, header, children }) {
    return (
        <Accordion.Item eventKey={eventKey}>
            <Accordion.Header as="h3">{header}</Accordion.Header>
            <Accordion.Body>{children}</Accordion.Body>
        </Accordion.Item>
    );
}

SettingsSection.propTypes = propTypes;

export default SettingsSection;
