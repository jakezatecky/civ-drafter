import PropTypes from 'prop-types';

import ThemeSwitcher from '#js/components/Header/ThemeSwitcher.jsx';

const propTypes = {
    theme: PropTypes.string.isRequired,
    onThemeChange: PropTypes.func.isRequired,
};

function HeaderActions({ theme, onThemeChange }) {
    return <ThemeSwitcher theme={theme} onChange={onThemeChange} />;
}

HeaderActions.propTypes = propTypes;

export default HeaderActions;
