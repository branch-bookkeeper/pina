import { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const propTypes = {
    history: PropTypes.shape({
        listen: PropTypes.func.isRequired,
    }).isRequired,
    children: PropTypes.element.isRequired,
};

class HistoryTracker extends Component {
    componentDidMount() {
        this.unlisten = this.props.history.listen(location => this.props.onChange(location));
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        return this.props.children;
    }
}

HistoryTracker.propTypes = propTypes;

export default withRouter(HistoryTracker);
