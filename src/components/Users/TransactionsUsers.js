import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel,  Checkbox, Slide, Tooltip, Button, Paper} from '@material-ui/core';
import { Loop, PlaylistAdd, Payment, AttachMoney } from '@material-ui/icons';
import ProjectStyles from '../Styles/ProjectStyles'
import Modal from '../DialogModal/ModalDialog';
import ControlPanel from "../ControlPanel/ControlPanel";
import { connect } from 'react-redux';
import { fetchAllTransactions } from '../../actions/transaction';
import { depositAccount } from '../../actions/user';
import {authenticationService} from '../../services';
import FormHead from "../Tables/FormHead";
import CreateDialogDepositAccount from "../DialogModal/CreateDialogDepositAccount"
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


class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const rows = [
      // { id: 'idTransacttion', numeric: false, disablePadding: true, label: 'idTransacttion' },
      // { id: 'idUser', numeric: false, disablePadding: true, label: 'idUser' },
      { id: 'date', numeric: false, disablePadding: false, label: this.props.strings.date },
      { id: 'transactionType', numeric: false, disablePadding: false, label: this.props.strings.transactionType },
      { id: 'amount', numeric: true, disablePadding: false, label: this.props.strings.amount },
      { id: 'isVerify', numeric: false, disablePadding: false, label: this.props.strings.confirmed },
  
    ];
    const { order, orderBy} = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                style={{color: '#ff6600', fontWeight: 'bold'}}
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
                onClick={this.handleClickOpen}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


const styles = ProjectStyles;
let check=<Checkbox
value="1"
/>
class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],   
    page: 0,
    rowsPerPage: 10,
    open: false,
    checkedG: true,
    nameDialog: "",
    openModal: false,
    title: "",
    selectedRow: { userName: null, userSurName: null, userAccountNumber: null }
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

  handleRowSelect = (event, id, userName, userSurName, userAccountNumber) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected[0] = id;
      this.setState({ selected: newSelected, selectedRow: { userName: userName, userSurName: userSurName, userAccountNumber: userAccountNumber } });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      this.setState({ selected: newSelected, selectedRow: { userName: null, userSurName: null, userAccountNumber: null } });
    }    
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };
 

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  componentDidMount() {
    this.props.refreshTransactions(authenticationService.currentUserValue.id)
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

  render() {
    strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
    const { classes } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.transactions.length - page * rowsPerPage);
    
    return (
      <Paper className={classes.root}>
        <FormHead title={strings.score} numSelected={selected.length} id = {authenticationService.currentUserValue.id} onSearch={this.props.refreshTransactions.bind(this)} isSearch={true}/>

        <div className={classes.controlPanel}>
        <Button onClick={() => this.props.refreshTransactions(authenticationService.currentUserValue.id)} className={classes.gradientButton}>
            {<Loop />}
            {strings.upd}
        </Button>  
        {
          <ControlPanel
              idDialog={"update-account"}
              title={strings.accountReplenishment}
              icon={<AttachMoney />}
              nameDialog={<CreateDialogDepositAccount setIsOpenModel={this.setIsOpenModel.bind(this)} onDepositAccount={this.props.onDepositAccount.bind(this)} actionCode='update-account'/>}
              handleOpenModal={this.handleOpenModal}
              isDisable={false}
              buttonName = {strings.replenishAccount}
            /> 
          }            
      </div>
      <Modal {...this.state} onCloseModal={this.handleCloseModal} onSaveModal={this.handleSaveModal}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              strings = {strings}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={this.props.transactions.length}
            />
            <TableBody>
              {stableSort(this.props.transactions, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.idTransacttion);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleRowSelect(event, n.idTransacttion, n.userName, n.userSurName, n.userAccountNumber)}
                      onDoubleClick={this.handleClickOpen}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.IdTrip}
                      selected={isSelected}
                    >
                      {/* <TableCell component="th" scope="row" padding="none">{n.idTransacttion}</TableCell>
                      <TableCell align="left">{n.idUser}</TableCell> */}
                      <TableCell align="left"  type="date">{n.date !== null ? moment(n.date).format('DD.MM.YYYY HH:mm:ss') : ""}</TableCell>         
                      <TableCell align="left">{n.transactionType}</TableCell>
                      <TableCell align="right"><font color={n.transactionCode === 1 || n.transactionCode === 3 ? "Green" : "Red"}>{n.transactionCode === 1 || n.transactionCode === 3 ? n.amount : "-" + n.amount}</font></TableCell> 
                      <TableCell align="left" ><Checkbox checked={n.isVerify} /></TableCell>
                                   
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={this.props.transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    transactions: state.transactions,
    language: state.language
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshTransactions: (idUser, filter) => { dispatch(fetchAllTransactions(idUser, filter)); },
    onDepositAccount: (idUser, depositAmount) => { dispatch(depositAccount({ idUser, depositAmount })); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnhancedTable));
