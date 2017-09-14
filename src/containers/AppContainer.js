import compose from 'ramda/src/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import App from '../pages/App';
import { loadUser } from '../redux/requests';

const mapStateToProps = ({
    user,
    entities: {
        users,
    },
}) => ({
    user,
    users,
});

const mapDispatchToProps = {
    loadUser,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(App);
