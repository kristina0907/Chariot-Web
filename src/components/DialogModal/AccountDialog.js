import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ProjectStyles from '../Styles/ProjectStyles';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = ProjectStyles;

class AccountDialog extends React.Component {
    state = {
        isEnable: false
    };

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.handleReset();
    };

    handleReset = () => {
        this.setState({
            isEnable: false
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <form id="account-user" noValidate className={classes.content_form} onSubmit={this.handleSubmit}>
                    <DialogContentText>                        
                        <font color="black">Номер счета: {this.props.selectedUser.accountNumber}</font> <br />
                        <font color="black">Баланс счета: {this.props.selectedUser.accountBalance}</font>
                    </DialogContentText>                                  
            </form>
        );
    }
}

AccountDialog.propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    openModal: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
};

export default withStyles(styles)(AccountDialog);