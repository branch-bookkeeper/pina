import { connect } from 'react-redux';

import SettingsDialog from '../components/SettingsDialog';
import {
    pushNotificationsSubscribe,
    pushNotificationsUnsubscribe,
} from '../redux/push';
import {
    closeSettingsDialog,
} from '../redux/ui';

const mapStateToProps = ({
    user,
    entities: {
        users,
    },
    push,
    ui: {
        settingsDialog: {
            show,
        },
    },
}) => ({
    open: show,
    user: users[user],
    push,
});

const mapDispatchToProps = {
    onRequestClose: closeSettingsDialog,
    onPushSubscribe: pushNotificationsSubscribe,
    onPushUnsubscribe: pushNotificationsUnsubscribe,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
