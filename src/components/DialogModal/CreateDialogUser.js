import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Input, Checkbox, Button, TextField, FormControlLabel } from '@material-ui/core';
import ProjectStyles from '../Styles/ProjectStyles';
import RequiredFieldsDialog from '../DialogModal/RequiredFieldsDialog';
import { editUser } from '../../actions/user';
import { connect } from 'react-redux';
import {authenticationService} from '../../services';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'

let strings = new LocalizedStrings(data);
const styles = ProjectStyles;

class CreateDialog extends React.Component {
    state = {
        message:"Не все обязательные поля заполнены",
        isEnable: false,
        isOperator: true,
        name: '',
        surName: '',
        birtDate: '',
        login: '',
        password: '',
        phone: '',
        email: '',
        comment: '',
        open: false,
        idUser: 0,
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

        if (this.state.name === null || this.state.name === '' || 
            this.state.surName === null || this.state.surName === ''){            
            this.setState({ open: true, message: strings.notAllRequiredFields });
        }
        else {
            this.props.onUpdateUser(this.state); 
        }
    };

    handleReset = () => {
        this.setState({
            isEnable: false,
            isOperator: true,
            name: '',
            surName: '',
            birtDate: '',
            login: '',
            phone: '',
            email: '',
            comment: '',
            open: false,
            idUser: 0,
            password: ''
        });
    };    
    componentWillMount() {
        if (this.props.actionCode === 'update-user')
            this.props.onEditUser(authenticationService.currentUserValue.id);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.actionCode === 'update-user' && nextProps.user.length !== 0) {
            this.setState({
                name: nextProps.user.name,
                isEnable: nextProps.user.isEnable,
                isOperator: nextProps.user.isOperator,
                surName: nextProps.user.surName,
                login: nextProps.user.login,
                phone: nextProps.user.phone,
                birtDate: nextProps.user.birtDate == null ? null : this.formatDate(nextProps.user.birtDate),
                idUser: nextProps.user.idUser,
                email: nextProps.user.email,
                comment: nextProps.user.comment,
                //password: nextProps.user.password
            });
        }
    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
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
                <RequiredFieldsDialog messageText = {this.state.message} open={this.state.open} handleClose={this.handleClose.bind(this)}></RequiredFieldsDialog>
                <TextField
                    label={strings.nameUser}                  
                    className={classes.textField}
                    inputProps={{
                        'aria-label': 'Description',
                        maxLength: 50
                    }}
                    InputLabelProps={{
                        className: classes.labelStyle
                    }}
                    variant="outlined"
                    name="name"
                    onChange={this.handleInputChange}
                    value={this.state.name}
                />                
                <div className={classes.clear}></div> 
                <TextField
                    label={strings.surname}
                    className={classes.textField}
                    inputProps={{
                        'aria-label': 'Description',
                        maxLength: 50
                    }}
                    InputLabelProps={{
                        className: classes.labelStyle
                    }}
                    variant="outlined"
                    name="surName"
                    onChange={this.handleInputChange}
                    value={this.state.surName}
                />                
                <div className={classes.clear}></div>
                <TextField
                    id="datetime-local"
                    label={strings.birthday}
                    type="date"
                    variant="outlined"
                    defaultValue="2017-05-24T10:30"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.labelStyle
                    }}
                    name="birtDate"
                    onChange={this.handleInputChange}
                    value={this.state.birtDate}
                />           
                <div className={classes.clear}></div>
                <TextField
                    label={strings.email}
                    className={classes.textField}
                    InputLabelProps={{
                        className: classes.labelStyle
                    }}
                    inputProps={{
                        'aria-label': 'Description',
                        maxLength: 50
                    }}
                    name="email"
                    variant="outlined"
                    onChange={this.handleInputChange}
                    value={this.state.email}
                />                                          
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.userInfo,
        language: state.language
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onEditUser: idUser => { dispatch(editUser(idUser)); }
    };
};

CreateDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CreateDialog));