import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";

const styles = theme => ({
    paper: {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px ${
          theme.spacing(1)
      }px ${theme.spacing(2)}px`
  },
  avatar: {
      backgroundColor: theme.palette.primary.main
  }
});

const propTypes = {
    classes: PropTypes.object.isRequired,
    callToAction: PropTypes.string,
    callToActionHref: PropTypes.string,
    dismissable: PropTypes.bool,
    icon: PropTypes.element.isRequired,
    children: PropTypes.node,
    onCallToActionClick: PropTypes.func,
};

const defaultProps = {
    callToAction: null,
    callToActionHref: null,
    dismissable: false,
    children: null,
    onCallToActionClick: () => {},
};

const PageBanner = ({
    classes,
    icon,
    callToAction,
    callToActionHref,
    onCallToActionClick,
    dismissable,
    children,
}) => {
    const [dismissed, setDismissed] = useState(false);

    return (
        <Collapse in={!dismissed}>
            <Divider />
            <Grid container justify="center">
                <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
                    <Paper elevation={0} className={classes.paper}>
                        <Grid container spacing={2} alignItems="center" wrap="nowrap">
                            <Grid item>
                                <Avatar className={classes.avatar}>
                                    {icon}
                                </Avatar>
                            </Grid>
                            <Grid item>
                                {children}
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-end" spacing={1}>
                            {callToAction && (
                                <Grid item>
                                    <Button
                                        color="primary"
                                        href={callToActionHref}
                                        onClick={onCallToActionClick}
                                    >
                                        {callToAction}
                                    </Button>
                                </Grid>
                            )}
                            {dismissable && (
                                <Grid item>
                                    <Button color="primary" onClick={() => setDismissed(true)}>Dismiss</Button>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Collapse>
    );
}

PageBanner.propTypes = propTypes;
PageBanner.defaultProps = defaultProps;

export default withStyles(styles)(PageBanner);
