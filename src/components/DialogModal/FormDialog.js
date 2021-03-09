import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog } from "@material-ui/core";
import ProjectStyles from '../Styles/ProjectStyles';

const styles = ProjectStyles;

class FormDialog extends React.Component {
    openModal = () => {
        const { nameDialog, handleOpenModal, title, actionName} = this.props;
        handleOpenModal({ nameDialog, title , actionName});
    };

    render() {
        const { classes, nameDialog, onCloseModal, onSaveModal, openModal, title, actionName, idDialog } = this.props;

        return (
                <div>      
                <Dialog  open={openModal} onClose={onCloseModal} aria-labelledby="form-dialog-title" fullScreen = {false}>
                    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                    <DialogContent>                    
                    {nameDialog}
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={onCloseModal} color="primary">
                        Закрыть
                    </Button>
                    {idDialog !== "error" ?
                    <Button form={idDialog} type="submit" onClick={onSaveModal} color="primary">                    
                        {actionName}
                    </Button> 
                    : null}
                    </DialogActions>                    
                </Dialog>
                </div>
        );
    }
}

FormDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    nameDialog: PropTypes.string.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
};

export default withStyles(styles)(FormDialog);


    
