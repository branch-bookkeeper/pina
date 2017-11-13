import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { default as BaseSnackbar } from 'material-ui/Snackbar';

class Snackbar extends Component {
    render() {
        const {
            open,
            message,
            onRequestClose,
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
                onRequestClose={onRequestClose}
                message={message}
                action={[
                    ...buttonLabel && onButtonClick ? [
                        <Button key="action" color="primary" dense onClick={this.handleButtonClick}>
                            {buttonLabel}
                        </Button>
                    ] : [],
                ]}
            />
        );
    }

    handleButtonClick = () => {
        const { onButtonClick, onRequestClose } = this.props;

        onRequestClose();
        onButtonClick();
    }
}

export default Snackbar;
