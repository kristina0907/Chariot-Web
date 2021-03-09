import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import ProjectStyles from '../Styles/ProjectStyles';
import { GoogleMap, withGoogleMap, withScriptjs, Marker, Polyline } from "react-google-maps";
const styles = ProjectStyles;


class TrackMap extends Component {
    render() {
        const { classes, trackCoordinates } = this.props;
        const center = trackCoordinates[0];
        const Map = withScriptjs(withGoogleMap(props => (
            trackCoordinates.length != 0 ?
            <GoogleMap
                defaultZoom={18}
                defaultCenter={center}
            >
                <Marker
                    position={center}
                />
                <Polyline
                    path={trackCoordinates}
                    geodesic={true}
                    options={{
                        strokeColor: "#ff2527",
                        strokeOpacity: 0.75,
                        strokeWeight: 2                        
                    }}
                />
            </GoogleMap>            
            : <GoogleMap
                defaultZoom={8}
                defaultCenter={{ lat: -34.397, lng: 150.644 }}>
            </GoogleMap>
            
        )));
        return (
            <div>
                <Map
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAkT4_S6OTbGMer1-VRBbWASaH_bluGfuQ&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `700px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        );
    }
};
export default withStyles(styles)(TrackMap);




