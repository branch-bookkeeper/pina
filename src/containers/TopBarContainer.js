import { connect } from 'react-redux';

import TopBar from '../components/TopBar';
import {
    pushNotificationsSubscribe,
    pushNotificationsUnsubscribe,
} from '../redux/push';

const mapStateToProps = ({
    push,
    user,
    entities: {
        users,
    },
    requests: {
        user: userRequest,
    },
}) => ({
    push,
    user: user ? users[user] : null,
    userRequest,
});

const mapDispatchToProps = {
    onPushSubscribe: pushNotificationsSubscribe,
    onPushUnsubscribe: pushNotificationsUnsubscribe,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
