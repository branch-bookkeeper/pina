import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class LoadingScreen extends PureComponent {
    static propTypes = {
        isLoadingNeeded: PropTypes.bool.isRequired,
        load: PropTypes.func.isRequired,
        children: PropTypes.element.isRequired,
    };

    render() {
        const { isLoadingNeeded, children } = this.props;

        return isLoadingNeeded
            ? <div>Loading...</div>
            : children;
    }

    componentDidMount() {
        const { isLoadingNeeded, load } = this.props;

        isLoadingNeeded && load();
    }
}

export default LoadingScreen;
