import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'
let strings = new LocalizedStrings(data);

class RequiredFieldsDialog extends React.Component {

    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"                >
                <DialogTitle id="alert-dialog-title">{strings.warning}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    {this.props.messageText}                        
            </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary" autoFocus>
                        {strings.close}
            </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state) {
    return {     
      language: state.language
    };
} 
  
//connect позволяет подключить наше хранилище резервов к компоненту
export default connect(mapStateToProps, null)(RequiredFieldsDialog);
//по сути создается контейнер для хранения состояния приложения