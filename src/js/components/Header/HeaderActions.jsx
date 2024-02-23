import PropTypes from 'prop-types';
import React from 'react';

import ThemeSwitcher from 'js/components/Header/ThemeSwitcher';

const propTypes = {
    initialTheme: PropTypes.string.isRequired,
};

function HeaderActions({ initialTheme }) {
    return <ThemeSwitcher initialTheme={initialTheme} />;
}

HeaderActions.propTypes = propTypes;

export default HeaderActions;
