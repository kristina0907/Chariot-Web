import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Checkbox, Slide, Tooltip, Button, Paper } from '@material-ui/core';
import { Loop, SwapCalls } from '@material-ui/icons';
import ProjectStyles from '../Styles/ProjectStyles'
import Modal from '../DialogModal/DialogModal';
import ControlPanel from "../ControlPanel/ControlPanel";
import Track from "../DialogModal/Track";
import { connect } from 'react-redux';
import { fetchAllTrips } from '../../actions/trip';
import {authenticationService} from '../../services';
import FormHead from "../Tables/FormHead";
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
    var rows = [
      // { id: 'idTrip', numeric: true, disablePadding: false, label: 'idTrip' },
      { id: 'tripStatus', numeric: false, disablePadding: false, label: this.props.strings.tripStatus },  
      { id: 'metTypeName', numeric: false, disablePadding: false, label: this.props.strings.transportType }, 
      { id: 'chariotNumber', numeric: false, disablePadding: false, label: this.props.strings.metNumber },
      // { id: 'idUser', numeric: true, disablePadding: false, label: 'idUser' },
      { id: 'dateStart', numeric: false, disablePadding: false, label: this.props.strings.dateTimeStart },
      { id: 'dateFinish', numeric: false, disablePadding: false, label: this.props.strings.dateTimeFinish },
      { id: 'durationPay', numeric: true, disablePadding: false, label: this.props.strings.durationMin },
      { id: 'amountPay', numeric: true, disablePadding: false, label: this.props.strings.cost },
      
    ];   
    const { order, orderBy } = this.props;   
   
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
let check = <Checkbox
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
    selectedRow: { idTrip: null },
    idDialog: ""
  };
  handleOpenModal = ({ nameDialog, title, idDialog }) => {
    this.setState({ nameDialog, openModal: true, title, idDialog });
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

  handleRowSelect = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected[0] = id;
      this.setState({ selected: newSelected, selectedRow: { idTrip: id } });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      this.setState({ selected: newSelected, selectedRow: { idTrip: null} });
    }    
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };


  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  componentDidMount() {
    this.props.refreshTrips(authenticationService.currentUserValue.id)
  }

  render() {   
    strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
    const { classes } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.trips.length - page * rowsPerPage);   
    return (
      <Paper className={classes.root}>
        <FormHead title={strings.trips} numSelected={selected.length} id = {authenticationService.currentUserValue.id} onSearch={this.props.refreshTrips.bind(this)} isSearch={true}/>
        <div className={classes.controlPanel}>
          <Button onClick={() => this.props.refreshTrips(authenticationService.currentUserValue.id)} className={classes.gradientButton}>
            {<Loop />}
            {strings.upd}
          </Button>
          {
            <ControlPanel
              idDialog={"get-track"}
              title={strings.track}
              icon={<SwapCalls style={{color:'#ffffff'}}/>}
              nameDialog= {<Track selectedTrip={this.state.selected} />}
              handleOpenModal={this.handleOpenModal}
              isDisable={this.state.selectedRow.idTrip === null}
              buttonName = {strings.track}
            /> 
          }            
        </div>
        <Modal {...this.state} onCloseModal={this.handleCloseModal} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              strings = {strings}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={this.props.trips.length}
            />
            <TableBody>
              {stableSort(this.props.trips, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.idTrip);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleRowSelect(event, n.idTrip)}
                      onDoubleClick={this.handleClickOpen}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.idTrip}
                      selected={isSelected}
                    >
                      <TableCell align="left" >
                      <font color={(n.isForsaken && n.dateFinish === null) ? "Orange" : ((n.isRentEnds && n.dateFinish === null) ? "Red" : ((n.dateFinish === null) ? "Green" : "Black"))}>
                      {(n.isForsaken && n.dateFinish === null) ? "Брошена" : ((n.isRentEnds && n.dateFinish === null) ? "В штрафном режиме" : ((n.dateFinish === null) ? "Активная" : "Завершена"))}
                      </font>
                      </TableCell>  
                      {/* <TableCell component="th" scope="row" padding="none">{n.idTrip}</TableCell> */}
                      <TableCell align="left">{n.metTypeName}</TableCell> 
                      <TableCell align="left">{n.chariotNumber}</TableCell>
                      {/* <TableCell align="right">{n.idUser}</TableCell> */}                                                         
                      <TableCell align="left"  type="date">{n.dateStart !== null ? moment(n.dateStart).format('DD.MM.YYYY HH:mm:ss') : ""}</TableCell>                   
                      <TableCell align="left"  type="date">{n.dateFinish !== null ? moment(n.dateFinish).format('DD.MM.YYYY HH:mm:ss') : ""}</TableCell>  
                      <TableCell align="right">{n.durationPay}</TableCell>
                      <TableCell align="right">{n.amountPay}</TableCell>         
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
          count={this.props.trips.length}
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
    trips: state.trips,
    language: state.language
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshTrips: (idUser, filter) => { dispatch(fetchAllTrips(idUser, filter)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnhancedTable));
