import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ProjectStyles from '../Styles/ProjectStyles';
import TrackMap from "../Map/TrackMap";
import { connect } from 'react-redux';
import { fetchAllTrackCoordinates } from '../../actions/track';
import {  Button} from '@material-ui/core';
import { Loop } from '@material-ui/icons';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'
import { hasInternetAccess } from '../../actions/url'

let strings = new LocalizedStrings(data);
const styles = ProjectStyles;

class Track extends React.Component {
    state = {
        vehicleType: "car",
        trackCoordinates: []
    };
    componentWillMount() {
        this.props.getTrackCoordinates(this.props.selectedTrip[0])
    }
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (          
            <div className={classes.container_block}>
            <Button onClick={() => this.props.getTrackCoordinates(this.props.selectedTrip[0])} className={classes.gradientButton}>
                {<Loop />}
                {strings.upd}
            </Button>
            {
                hasInternetAccess && <TrackMap trackCoordinates={this.props.tracks} />
            }
            </div>
        );
    }
}

Track.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        tracks: state.tracks,
        language: state.language
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTrackCoordinates: (idTrip) => { dispatch(fetchAllTrackCoordinates(idTrip)); }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Track));

