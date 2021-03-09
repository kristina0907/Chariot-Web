import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Button } from '@material-ui/core';
import ProjectStyles from '../Styles/ProjectStyles';
import FormHead from "../Tables/FormHead";
import MapView from "../Map/MapView";

import { connect } from 'react-redux';
import { fetchAllStationMet } from '../../actions/stationMet';
import { fetchAllMetCoordinates } from '../../actions/track';

import ControlPanel from "../ControlPanel/ControlPanel";
import { PlaylistAdd } from '@material-ui/icons';
import FormDialog from "../DialogModal/FormDialog";
import { authenticationService } from '../../services';
import { hasInternetAccess } from '../../actions/url'
import { from } from 'rxjs';

const styles = ProjectStyles;

class Home extends React.Component {
    state = {
        titleHeadTable: "Главная",
        nameDialog: "",
        openModal: false,
        title: "",
        idDialog: "",
        actionName: "",
        isClosed: false,
        isLoad: false
    };    
    componentWillMount() {
        this.props.refreshStaionMets();
        this.props.refreshMetCoordinates();
    }     

    handleOpenModal = ({ nameDialog, title, actionName, idDialog }) => {
        this.setState({ nameDialog, openModal: true, title, actionName, idDialog });
    };
    handleSaveModal = () => {
        this.setState({ 
            openModal: false,
            isClosed: false           
        });
    };
    handleCloseModal = () => {
        this.setState({ openModal: false, isClosed: true });        
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.stationMets.length != 0)
            this.setState({isLoad: true});
    }
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <div className={classes.container_block}>                    
                    {(hasInternetAccess && (this.props.stationMets.length !== 0 && this.props.metCoordinates.length !== 0 || this.state.isLoad)) ?
                        <MapView
                            stationMetsLatLng={this.props.stationMets}
                            metCoordinatesLatLng={this.props.metCoordinates}
                            refreshMetCoordinates= {this.props.refreshMetCoordinates}
                            refreshStaionMets= {this.props.refreshStaionMets}
                            /> : null
                    }
                </div>
                <FormDialog {...this.state} onCloseModal={this.handleCloseModal} onSaveModal={this.handleSaveModal} />
            </Paper>
        );
    }
}

function mapStateToProps(state) {
    return {
        stationMets: state.stationMets.data,
        metCoordinates: state.metCoordinates,
        chariotRentInfo: state.chariotRentInfo
    };
}

const mapDispatchToProps = dispatch => {
    return {
        refreshStaionMets: () => { dispatch(fetchAllStationMet()); },
        refreshMetCoordinates: (idUser) => { dispatch(fetchAllMetCoordinates(idUser)); }
    };
};

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));