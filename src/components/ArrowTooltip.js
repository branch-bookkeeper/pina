import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';

const propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
};

const arrowGenerator = (color) => ({
    '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.95em',
        width: '100%',
        height: '1em',
        '&::before': {
            borderWidth: '0 1em 1em 1em',
            borderColor: `transparent transparent ${color} transparent`,
        },
    },
    '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.95em',
        width: '100%',
        height: '1em',
        '&::before': {
            borderWidth: '1em 1em 0 1em',
            borderColor: `${color} transparent transparent transparent`,
        },
    },
    '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: '-0.95em',
        height: '3em',
        width: '1em',
        '&::before': {
            borderWidth: '1em 1em 1em 0',
            borderColor: `transparent ${color} transparent transparent`,
        },
    },
    '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: '-0.95em',
        height: '3em',
        width: '1em',
        '&::before': {
            borderWidth: '1em 0 1em 1em',
            borderColor: `transparent transparent transparent ${color}`,
        },
    },
});

const styles = theme => ({
    button: {
        margin: theme.spacing(),
    },
    arrowPopper: arrowGenerator(theme.palette.grey[700]),
    arrow: {
        position: 'absolute',
        fontSize: 6,
        width: '3em',
        height: '3em',
        '&::before': {
            content: '""',
            margin: 'auto',
            display: 'block',
            width: 0,
            height: 0,
            borderStyle: 'solid',
        },
    },
});

class ArrowTooltip extends Component {
    arrowRef = null;

    setArrowRef = (ref) => {
        this.arrowRef = ref;
    };

    render() {
        const { classes, children, title, ...otherProps } = this.props;

        return (
            <Tooltip
                {...otherProps}
                title={(
                    <React.Fragment>
                        {title}
                        <span className={classes.arrow} ref={this.setArrowRef} />
                    </React.Fragment>
                )}
                classes={{ popper: classes.arrowPopper }}
                PopperProps={{
                    popperOptions: {
                        modifiers: {
                            arrow: {
                                enabled: Boolean(this.arrowRef),
                                element: this.arrowRef,
                            },
                        },
                    },
                }}
            >
                {children}
            </Tooltip>
        );
    }
}

ArrowTooltip.propTypes = propTypes;

export default withStyles(styles)(ArrowTooltip);
