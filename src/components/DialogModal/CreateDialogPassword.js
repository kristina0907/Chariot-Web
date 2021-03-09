import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Input, Checkbox, Button, TextField, FormControlLabel } from '@material-ui/core';
import ProjectStyles from '../Styles/ProjectStyles';
import RequiredFieldsDialog from '../DialogModal/RequiredFieldsDialog';
import {authenticationService} from '../../services';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'

let strings = new LocalizedStrings(data);

const styles = ProjectStyles;

class CreateDialog extends React.Component {
    state = {
        message:"Не все обязательные поля заполнены",
        idUser: authenticationService.currentUserValue.id,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
    };
    
    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.setIsOpenModel(true);
        if (this.state.confirmPassword !== this.state.newPassword){            
            this.setState({ open: true, message: strings.passwordsNotMatch });
            return;
        }
        if (this.state.password === null || this.state.password === '' || 
            this.state.oldPassword === null || this.state.oldPassword === '' || 
            this.state.confirmPassword === null || this.state.confirmPassword === ''){            
            this.setState({ open: true, message: strings.notAllRequiredFields });
        }
        else {
            this.props.onUpdatePassword(this.state.idUser, this.state.oldPassword, this.state.newPassword);        
        }
    };

    handleReset = () => {
        this.setState({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };    
    componentWillMount() {        
    }   
    
    handleClose = () => {
        this.setState({
            open: false
        });
    }
    handleClickShowOldPassword = () => {
        this.setState({
            showOldPassword: true
        });
    };
    
    handleMouseDownOldPassword = () => {
        this.setState({
            showOldPassword: false
        });
    };
    handleClickShowNewPassword = () => {
        this.setState({
            showNewPassword: true
        });
    };
    
    handleMouseDownNewPassword = () => {
        this.setState({
            showNewPassword: false
        });
    };
    handleClickShowConfirmPassword = () => {
        this.setState({
            showConfirmPassword: true
        });
    };
    
    handleMouseDownConfirmPassword = () => {
        this.setState({
            showConfirmPassword: false
        });
    };
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;        
        return (
            <form id={this.props.actionCode} noValidate className={classes.content_form} onSubmit={this.handleSubmit}>
                <RequiredFieldsDialog messageText = {this.state.message} open={this.state.open} handleClose={this.handleClose.bind(this)}></RequiredFieldsDialog>
                <TextField
                    label={strings.oldPassword}
                    className={classes.textField}
                    InputLabelProps={{
                        className: classes.labelStyle
                    }}                    
                    InputProps={{
                        'aria-label': 'Description',
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label="toggle password visibility"
                              onClick={this.handleClickShowOldPassword}
                              onMouseDown={this.handleMouseDownOldPassword}
                            >
                              {this.state.showOldPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    variant="outlined"
                    name="oldPassword"
                    type={this.state.showOldPassword ? 'text' : 'password'}
                    onChange={this.handleInputChange}
                    value={this.state.oldPassword}
                />                
                <div className={classes.clear}></div> 
                <TextField
                    label={strings.newPassword}
                    className={classes.textField}
                    InputLabelProps={{
                        className: classes.labelStyle
                    }}
                    InputProps={{
                        'aria-label': 'Description',
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label="toggle password visibility"
                              onClick={this.handleClickShowNewPassword}
                              onMouseDown={this.handleMouseDownNewPassword}
                            >
                              {this.state.showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    variant="outlined"
                    name="newPassword"
                    type={this.state.showNewPassword ? 'text' : 'password'}
                    onChange={this.handleInputChange}
                    value={this.state.newPassword}
                />             
                <div className={classes.clear}></div>
                <TextField
                    label={strings.confirmPassword}
                    className={classes.textField}
                    InputLabelProps={{
                        className: classes.labelStyle
                    }}
                    InputProps={{
                        'aria-label': 'Description',
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label="toggle password visibility"
                              onClick={this.handleClickShowConfirmPassword}
                              onMouseDown={this.handleMouseDownConfirmPassword}
                            >
                              {this.state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    name="confirmPassword"
                    type={this.state.showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    onChange={this.handleInputChange}
                    value={this.state.confirmPassword}
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

