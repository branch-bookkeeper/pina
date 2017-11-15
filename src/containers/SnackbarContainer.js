import { connect } from 'react-redux';

import Snackbar from '../components/Snackbar';
import {
    hideSnackbar,
} from '../redux/ui';

const mapStateToProps = ({
    ui: {
        snackbar: {
            show,
            message,
            action,
            actionDescription,
        },
    },
}) => ({
    open: show,
    message,
    buttonLabel: actionDescription,
    action,
});

const mapDispatchToProps = dispatch => ({
    onRequestClose: () => dispatch(hideSnackbar()),
    dispatch,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const { action } = stateProps;
    const { dispatch, ...otherDispatchProps } = dispatchProps;

    return {
        ...ownProps,
        ...stateProps,
        onButtonClick: action ? () => dispatch(action) : null,
        ...otherDispatchProps,
    };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Snackbar);
