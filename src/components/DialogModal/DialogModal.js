import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    Toolbar, Typography, IconButton,  AppBar,
} from "@material-ui/core";
import ProjectStyles from '../Styles/ProjectStyles';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'
let strings = new LocalizedStrings(data);

const styles = ProjectStyles;
class Modal extends React.Component {
    openModal = () => {
        const { nameDialog, handleOpenModal, title} = this.props;
        handleOpenModal({ nameDialog, title });
    };
   
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes,nameDialog, onCloseModal, onSaveModal, openModal, title, idDialog } = this.props;

        return (
            <Dialog
                open={openModal}
                onClose={onCloseModal}
                fullScreen = {true}

            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={onCloseModal} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="#ffffff" className={classes.flex}>
                            {title}
                        </Typography>
                        <Button form={idDialog} color="inherit" type="submit" onClick={onSaveModal}>
                            {idDialog === "send-command-bu" ? "Отправить" : (idDialog === "account-user" || idDialog === "get-track") ? null : strings.save}
                  </Button>
                    </Toolbar>
                </AppBar>
                {/* <main className={classes.content}> */}
                <main>
                    {nameDialog}
                </main>
            </Dialog>
        );
    }
}

Modal.propTypes = {
    classes: PropTypes.object.isRequired,
    nameDialog: PropTypes.string.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {     
      language: state.language
    };
}  
  
//connect позволяет подключить наше хранилище резервов к компоненту
export default connect(mapStateToProps, null)(withStyles(styles)(Modal));
//по сути создается контейнер для хранения состояния приложения


    