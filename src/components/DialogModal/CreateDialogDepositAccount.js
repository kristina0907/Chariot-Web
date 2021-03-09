import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import ProjectStyles from '../Styles/ProjectStyles';
import RequiredFieldsDialog from '../DialogModal/RequiredFieldsDialog';
import {authenticationService} from '../../services';
import { connect } from 'react-redux';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'
let strings = new LocalizedStrings(data);
const styles = ProjectStyles;

class CreateDialog extends React.Component {
    state = {
        idUser: authenticationService.currentUserValue.id,
        depositAmount: ''       
    };
    
    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleInputChange = e => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({
                [e.target.name]: e.target.value
            });
        }        
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.setIsOpenModel(true);
        if (this.state.depositAmount === null || this.state.depositAmount === ''){            
            this.setState({ open: true });
        }
        else {
            this.props.onDepositAccount(this.state.idUser, this.state.depositAmount);        
        }
    };

    handleReset = () => {
        this.setState({
            depositAmount: ''            
        });
    };    
    componentWillMount() {        
    }   
    
    handleClose = () => {
        this.setState({
            open: false
        });
    }   
    
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;

        return (
            <form id={this.props.actionCode} noValidate className={classes.content_form} onSubmit={this.handleSubmit}>
                <RequiredFieldsDialog messageText = {strings.notAllRequiredFields} open={this.state.open} handleClose={this.handleClose.bind(this)}></RequiredFieldsDialog>
                <TextField
                    label={strings.enterAmount}
                    className={classes.textField}
                    inputProps={{
                        'aria-label': 'Description',
                    }}
                    InputLabelProps={{
                        className: classes.labelStyle
                    }}
                    variant="outlined"
                    name="depositAmount"
                    onChange={this.handleInputChange}
                    value={this.state.depositAmount}
                />      
            </form>
        );
    }
}

CreateDialog.propTypes = {
    classes: PropTypes.object.isRequired,
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
export default connect(mapStateToProps, null)(withStyles(styles)(CreateDialog));
//по сути создается контейнер для хранения состояния приложения