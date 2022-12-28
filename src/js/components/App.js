import PropTypes from 'prop-types';
import React from 'react';

class App extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
    };

    render() {
        const { name } = this.props;

        return <h1>{`Hello, ${name}!`}</h1>;
    }
}

export default App;
