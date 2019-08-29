import { connect } from 'react-redux';

import TopBar from '../components/TopBar';
import {
    openSettingsDialog,
} from '../redux/ui';
import { logout } from '../redux/auth';

console.log(TopBar);

const mapStateToProps = ({
    user,
    entities: {
        users,
    },
    requests: {
        user: userRequest,
    },
}) => ({
    user: user ? users[user] : null,
    userRequest,
});

const mapDispatchToProps = {
    onOpenSettings: openSettingsDialog,
    onLogout: logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
