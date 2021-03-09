import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Paper, Checkbox, Tooltip, Button, TextField } from '@material-ui/core';
import { Loop, PlaylistAdd, ListAlt, SwapCalls, Build, AccountBalanceWallet, Edit } from '@material-ui/icons';
import ProjectStyles from '../Styles/ProjectStyles'
import Modal from '../DialogModal/ModalDialog';
import ControlPanel from "../ControlPanel/ControlPanel";
import CreateDialogUser from "../DialogModal/CreateDialogUser";
import CreateDialogPassword from "../DialogModal/CreateDialogPassword";

import Trips from "./TripsUsers";
import Transactions from "./TransactionsUsers";
import FormHead from "../Tables/FormHead";
import AccountDialog from "../DialogModal/AccountDialog";
import FormDialog from "../DialogModal/FormDialog";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchAllUsers, updateUser, updatePassword } from '../../actions/user';
import { setLanguage } from '../../actions/language';

import { authenticationService } from '../../services';
import { getPermissionsFromToken } from '../../helpers';
import RequiredFieldsDialog from '../DialogModal/RequiredFieldsDialog';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'

let strings = new LocalizedStrings(data);
var moment = require('moment');

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const styles = ProjectStyles;

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    page: 0,
    rowsPerPage: 10,
    open: false,
    nameDialog: "",
    openModal: false,
    openMessage: false,
    title: "",
    idDialog: "",
    selectedRow: { idUser: null, name: null, surName: null, accountNumber: null, accountBalance: null, isOperator: null },
  };

  setIsOpenModel(isOpenModel){
    this.setState({ openModal: isOpenModel });
  }
  handleOpenModal = ({ nameDialog, title, idDialog }) => {
    this.setState({ nameDialog, openModal: true, title, idDialog });
  };

  handleSaveModal = () => {
  };
  handleCloseModal = () => {
    this.setState({ openModal: false });
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      //this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleRowSelect = (event, id, name, surName, accountNumber, accountBalance, isOperator) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected[0] = id;
      this.setState({ selected: newSelected, selectedRow: {idUser: id, name: name, surName: surName, accountNumber: accountNumber, accountBalance: accountBalance, isOperator: isOperator } });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      this.setState({ selected: newSelected, selectedRow: { idUser: null, name: null, surName: null, accountNumber: null, accountBalance: null, isOperator: null } });
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };


  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  refresh(){
    this.setState({ selected: [], selectedRow: { idUser: null, name: null, surName: null, accountNumber: null, accountBalance: null } });
    this.props.refreshUsers(authenticationService.currentUserValue.id)
  }

  componentDidMount() {
    this.props.refreshUsers(authenticationService.currentUserValue.id)
  }
  componentWillReceiveProps(newProps) {
    if(newProps.error == null){
      this.setIsOpenModel(false);      
    }
    else{
      if(this.props.error != newProps.error)
            this.setIsOpenMessage(true);
    }
  }
  setIsOpenMessage(isOpenMessage){
    this.setState({openMessage: isOpenMessage});
  }
  handleClose = () => {    
    this.setIsOpenMessage(false); 
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
  render() {
    strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
    const { classes } = this.props;
    const { rowsPerPage, page } = this.state;
    
    return (
      <Paper className={classes.root}>
        <FormHead title={strings.profile} isSearch={false}/>

        <div className={classes.controlPanel}> 
          <Button onClick={() => this.props.refreshUsers(authenticationService.currentUserValue.id)} className={classes.gradientButton}>
            {<Loop />}
            {strings.upd}
          </Button>    
          {
          <ControlPanel
              idDialog={"update-user"}
              title={strings.changingProfile}
              icon={<Edit />}
              nameDialog={<CreateDialogUser setIsOpenModel={this.setIsOpenModel.bind(this)} onUpdateUser={this.props.onUpdateUser.bind(this)} actionCode='update-user' isOperator = {this.state.selectedRow.isOperator}/>}
              handleOpenModal={this.handleOpenModal}
              isDisable={false}
              buttonName = {strings.changeProfile}
            /> 
          } 
          {
          <ControlPanel
              idDialog={"update-password"}
              title={strings.changingPassword}
              icon={<Edit />}
              nameDialog={<CreateDialogPassword setIsOpenModel={this.setIsOpenModel.bind(this)} onUpdatePassword={this.props.onUpdatePassword.bind(this)} actionCode='update-password'/>}
              handleOpenModal={this.handleOpenModal}
              isDisable={false}
              buttonName = {strings.changePassword}
            /> 
          }                     
        </div>
        <Modal {...this.state} onCloseModal={this.handleCloseModal} onSaveModal={this.handleSaveModal} />
        <RequiredFieldsDialog messageText={this.props.error != undefined ? this.props.error.data : this.props.error} open={this.state.openMessage} handleClose={this.handleClose.bind(this)}></RequiredFieldsDialog>
            {              
              this.props.users.length !== 0 ?
              <div className={classes.profile_form}>
                <TextField  
                    //style={{floa: '#ff6600', fontWeight: 'bold'}}                  
                    label={strings.balance}
                    className={classes.textField}
                    inputProps={{
                        'aria-label': 'Description',
                    }}
                    name="accountBalance"
                    variant="outlined"
                    InputProps={{
                      style: { fontWeight : 'bold', color: (this.props.users[0].accountBalance > 0) ? 'green' : 'red'},                     
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      className: classes.labelStyle
                    }}
                    value={this.props.users[0].accountBalance}
                />                
                <div className={classes.clear}></div> 
                <TextField
                    label={strings.nameUser}
                    className={classes.textField}
                    inputProps={{
                        'aria-label': 'Description',
                    }}
                    name="name"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      className: classes.labelStyle
                    }}
                    value={this.props.users[0].name}
                />                
                <div className={classes.clear}></div> 
                <TextField
                    label={strings.surname}
                    className={classes.textField}
                    inputProps={{
                        'aria-label': 'Description',
                    }}
                    name="surName"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      className: classes.labelStyle
                    }}
                    value={this.props.users[0].surName}
                /> 
                <div className={classes.clear}></div> 
                <TextField
                    id="datetime-local"
                    label={strings.birthday}
                    type="date"
                    variant="outlined"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      className: classes.labelStyle
                    }}
                    name="birtDate"
                    value={this.props.users[0].birtDate == null ? null : this.formatDate(this.props.users[0].birtDate)}
                />                
                <div className={classes.clear}></div>               
                <TextField
                    label={strings.phone}
                    className={classes.textField}
                    inputProps={{
                        'aria-label': 'Description',
                    }}
                    name="phone"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      className: classes.labelStyle
                    }}
                    value={this.props.users[0].phone}
                />                
                <div className={classes.clear}></div>
                <TextField
                    label={strings.email}
                    className={classes.textField}
                    inputProps={{
                        'aria-label': 'Description',
                    }}
                    name="email"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      className: classes.labelStyle
                    }}
                    value={this.props.users[0].email}
                />
                </div>               
                : null
                }     
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users.data,
    error: state.users.error,
    language: state.language
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshUsers: (idUser, filter) => { dispatch(fetchAllUsers(idUser, filter)); }, //dispatch передает действие fetchAllUsers в redux, состояние меняет reduser
    onUpdateUser: user => { dispatch(updateUser(user)); },
    onUpdatePassword: (idUser, oldPassword, newPassword) => { dispatch(updatePassword({ idUser, oldPassword, newPassword })); }, 

    //onChangeLanguage: language => { dispatch(setLanguage(language)); },

  };
};

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

//connect позволяет подключить наше хранилище резервов к компоненту
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnhancedTable));
//по сути создается контейнер для хранения состояния приложения