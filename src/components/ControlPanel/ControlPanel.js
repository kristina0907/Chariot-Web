import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ProjectStyles from '../Styles/ProjectStyles';


const styles = ProjectStyles;

class ControlPanel extends React.Component {
    openModal = () => {
        const { nameDialog, handleOpenModal, title, actionName, idDialog } = this.props;
        handleOpenModal({ nameDialog, title, actionName, idDialog });
    };

    render() {
        const { classes } = this.props;

        return (
            <Button onClick={this.openModal} disabled = {this.props.isDisable} style={{color:"#ffffff"}} className={classes.gradientButton}>
                {this.props.icon}
                {this.props.buttonName}
            </Button>
        );
    }
}

ControlPanel.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlPanel);

