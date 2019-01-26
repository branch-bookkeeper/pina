import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { default as BaseSnackbar } from '@material-ui/core/Snackbar';

class Snackbar extends Component {
    render() {
        const {
            open,
            message,
            onClose,
            onButtonClick,
            buttonLabel,
        } = this.props;

        return (
            <BaseSnackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                autoHideDuration={10000}
                onClose={onClose}
                message={message}
                action={[
                    ...buttonLabel && onButtonClick ? [
                        <Button key="action" color="primary" onClick={this.handleButtonClick}>
                            {buttonLabel}
                        </Button>
                    ] : [],
                ]}
            />
        );
    }

    handleButtonClick = () => {
        const { onButtonClick, onClose } = this.props;

        onClose();
        onButtonClick();
    }
}

export default Snackbar;
