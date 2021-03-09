import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { Loop, Directions, DirectionsBike, DirectionsWalk, DirectionsCar, Motorcycle, Delete, ChildFriendly, Timeline } from '@material-ui/icons';
import ProjectStyles from '../Styles/ProjectStyles';
import { GoogleMap, withGoogleMap, withScriptjs, Marker, InfoWindow, DirectionsRenderer } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { connect } from 'react-redux';
import { fetchSelectStationMet } from '../../actions/stationMet';
import { fetchActualTarif } from '../../actions/tarif';
import { authenticationService } from '../../services';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'

let strings = new LocalizedStrings(data);
const styles = ProjectStyles;
const bykeSpeed = 40;
const chariotSpeed = 30;
const scooterSpeed = 50;
const footSpeed = 5;
var currentZoom = 13;
var currentCenter = null;
class MapView extends Component {
    state = {
        clickLatLng: null,
        lat: 54.6289781,
        lng: 39.7091743,
        center: null,
        zoom: 13,
        markers: [],
        markersMet: [],
        routeMode: 'DRIVING',
        metType: 'byke',
        isOpenMetInfo: false,
        isOpenStationInfo: false,
        marker: null,
        routeMarkerFrom: null,
        routeMarkerTo: null,
        route: null,
        routeDistance: null,
        routeDuration: null
    };

    constructor(props) {
        super(props);
        this.googleMap = React.createRef();
    }
    componentWillMount() {
        currentCenter = { lat: this.props.stationMetsLatLng[0].latitude, lng: this.props.stationMetsLatLng[0].longitude };
        this.setState({ center: { lat: this.props.stationMetsLatLng[0].latitude, lng: this.props.stationMetsLatLng[0].longitude } })
    }
    componentDidMount() {
        this.setMarkers(this.props)
    }
    componentWillReceiveProps(newProps) {
        if (this.props.stationMet !== newProps.stationMet) {
            currentCenter = { lat: newProps.stationMet[0].latitude, lng: newProps.stationMet[0].longitude };
            this.setState({
                marker: newProps.stationMet[0],
                isOpenStationInfo: true,
                isOpenMetInfo: false,
                center: { lat: newProps.stationMet[0].latitude, lng: newProps.stationMet[0].longitude },
                zoom: currentZoom
            })
        }
        if (this.props.stationMetsLatLng !== newProps.stationMetsLatLng || this.props.metCoordinatesLatLng !== newProps.metCoordinatesLatLng) {
            this.setMarkers(newProps)
        }
    }
    refresh() {
        this.props.refreshStaionMets();
        this.props.refreshMetCoordinates(authenticationService.currentUserValue.id);
        this.setState({ isOpenMetInfo: false, isOpenStationInfo: false })
    }
    setMarkers(props) {
        var markers = [];
        var markersMet = [];
        if (props.metCoordinatesLatLng.length != 0) {
            props.metCoordinatesLatLng.forEach(function (item, i, arr) {
                markersMet.push({                    
                    isSelect: false,
                    key: item.idTrack,
                    latlng: {
                        lat: item.latitude,
                        lng: item.longitude,
                    },
                    children: {
                        idChariot: item.idChariot,
                        chargeLevel: item.chargeLevel,
                        metTypeName: item.metTypeName,
                        chariotNumber: item.chariotNumber,
                        isForsaken: item.isForsaken,
                    }
                })
            });
        }
        if (props.stationMetsLatLng.length != 0) {
            props.stationMetsLatLng.forEach(function (item, i, arr) {
                markers.push({
                    isSelect: false,
                    latlng: {
                        lat: item.latitude,
                        lng: item.longitude,
                    },
                    //title: item.name,
                    //description: item.name,
                    children: {
                        idStationMet: item.idStationMet,
                        //name: item.name,
                        //adress: item.adress,
                        //code: item.code,
                        //countFreeSlots: item.countFreeSlots,
                        countCharging: item.countCharging,
                        //countSlots: item.countSlots,
                        //countChariot: item.countChariot,
                        //countByke: item.countByke,
                        //countMoto: item.countMoto
                    }
                })
            })
        }
        this.setState({
            markers: markers,
            markersMet: markersMet
        })
    }
    handleStationInfoOpen(marker) {
        this.props.refreshStaionMet(marker.children.idStationMet);
        var markersMet = [];
        this.state.markersMet.forEach(function (item, i, arr) {
            item.isSelect = false;
            markersMet.push({
                isSelect: item.isSelect,
                key: item.key,
                latlng: item.latlng,
                children: item.children
            })
        })
        var markers = [];
        this.state.markers.forEach(function (item, i, arr) {
            if (item == marker)
                item.isSelect = true;
            else
                item.isSelect = false;
            markers.push({
                isSelect: item.isSelect,
                latlng: item.latlng,
                //title: item.title,
                //description: item.description,
                children: item.children
            })
        })
        this.setState({ marker: marker, markers: markers, markersMet: markersMet, clickLatLng: null })
    }
    handleMetInfoOpen(marker) {
        var markers = [];
        this.state.markers.forEach(function (item, i, arr) {
            item.isSelect = false;
            markers.push({
                isSelect: item.isSelect,
                latlng: item.latlng,
                //title: item.title,
                //description: item.description,
                children: item.children
            })
        })
        var markersMet = [];
        this.state.markersMet.forEach(function (item, i, arr) {
            if (item == marker)
                item.isSelect = true;
            else
                item.isSelect = false;
            markersMet.push({
                isSelect: item.isSelect,
                key: item.key,
                latlng: item.latlng,
                children: item.children
            })
        })
        currentCenter = { lat: marker.latlng.lat, lng: marker.latlng.lng };
        this.setState({ markers: markers, markersMet: markersMet })
        this.setState({
            marker: marker,
            isOpenMetInfo: true,
            isOpenStationInfo: false,
            center: { lat: marker.latlng.lat, lng: marker.latlng.lng },
            zoom: currentZoom,
            clickLatLng: null
        })
    }

    handleZoomChanged = () => {
        currentZoom = this.googleMap.current.getZoom();
        currentCenter = this.googleMap.current.getCenter();
        // var newCenter = this.googleMap.current.getCenter();
        // this.setState({
        //   zoom: this.googleMap.current.getZoom(),
        //   lat: newCenter.lat(),
        //   lng: newCenter.lng()
        // });       
    };
    handleCenterChanged = () => {
        currentCenter = this.googleMap.current.getCenter();
    };
    setMarkerFrom() {
        var latLng;
        if (this.state.clickLatLng != null) {
            latLng = this.state.clickLatLng;
            this.setState({ routeMarkerFrom: latLng, clickLatLng: null })
            this.buildRoute(latLng, this.state.routeMarkerTo)
        }
        else {
            latLng = {
                lat: (this.state.marker.latlng === undefined ? this.state.marker.latitude : this.state.marker.latlng.lat),
                lng: (this.state.marker.latlng === undefined ? this.state.marker.longitude : this.state.marker.latlng.lng)
            };
            this.setState({ routeMarkerFrom: { lat: latLng.lat, lng: latLng.lng } })
            this.buildRoute(latLng, this.state.routeMarkerTo)
        }
    }
    setMarkerTo() {
        var latLng;
        if (this.state.clickLatLng != null) {
            latLng = this.state.clickLatLng;
            this.setState({ routeMarkerTo: latLng, clickLatLng: null })
            this.buildRoute(this.state.routeMarkerFrom, latLng)
        }
        else {
            latLng = {
                lat: (this.state.marker.latlng === undefined ? this.state.marker.latitude : this.state.marker.latlng.lat),
                lng: (this.state.marker.latlng === undefined ? this.state.marker.longitude : this.state.marker.latlng.lng)
            };
            this.setState({ routeMarkerTo: { lat: latLng.lat, lng: latLng.lng } })
            this.buildRoute(this.state.routeMarkerFrom, latLng)
        }
    }
    buildRoute(routeMarkerFrom, routeMarkerTo) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: routeMarkerFrom,
                destination: routeMarkerTo,
                travelMode: this.state.routeMode
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    this.setState({
                        route: result,
                        routeDistance: result.routes[0].legs[0].distance.text,                        
                    });
                    this.calculateRouteDuration(result.routes[0].legs[0].distance.value, this.state.metType)
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            }
        );
    }
    handleMapClick(event) {
        this.setState({ clickLatLng: { lat: event.latLng.lat(), lng: event.latLng.lng() }, zoom: currentZoom, center: currentCenter })
    }
    deleteRoute() {
        this.setState({ routeMarkerFrom: null, routeMarkerTo: null, clickLatLng: null, route: null, zoom: currentZoom, center: currentCenter })
    }
    chariotClick = async (e) => {
        await this.setState({ metType: "chariot", routeMode: "WALKING" });
        this.buildRoute(this.state.routeMarkerFrom, this.state.routeMarkerTo);
    }
    bikeClick = async (e) => {
        await this.setState({ metType: "byke", routeMode: "WALKING" });
        this.buildRoute(this.state.routeMarkerFrom, this.state.routeMarkerTo);
    }
    footClick = async (e) => {
        await this.setState({ metType: "foot", routeMode: "WALKING" });
        this.buildRoute(this.state.routeMarkerFrom, this.state.routeMarkerTo);
    }
    motoClick = async (e) => {
        await this.setState({ metType: "scooter", routeMode: "DRIVING" });
        this.buildRoute(this.state.routeMarkerFrom, this.state.routeMarkerTo);
    }
    calculateRouteDuration(distance, transportType) {
        switch (transportType) {
          case 'byke':
            var time = (distance / (1000 * bykeSpeed)) * 60;
            this.setState({ routeDuration: time.toFixed(2) });
            this.props.getActualTarif(36);
            break;
          case 'chariot':
            var time = (distance / (1000 * chariotSpeed)) * 60;
            this.setState({ routeDuration: time.toFixed(2) });
            this.props.getActualTarif(32);
            break;
          case 'scooter':
            var time = (distance / (1000 * scooterSpeed)) * 60;
            this.setState({ routeDuration: time.toFixed(2) });
            this.props.getActualTarif(34);
            break;
          case 'foot':
            var time = (distance / (1000 * footSpeed)) * 60;
            this.setState({ routeDuration: time.toFixed(2) });
            break;
        }
    }
    filterStations = (event, value) => {
        var marker = null;
        if(value != undefined){            
            this.state.markers.every(function(item, i) {
                if(item.children.idStationMet === value.idStationMet){
                    marker = item;
                    return false;
                } 
                else{
                    return true;
                }  
            });
            if(marker !== null)
                this.handleStationInfoOpen(marker)
        }
    }
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)

        const { classes } = this.props;
        const Map = withScriptjs(withGoogleMap(props => (

            <GoogleMap
                zoom={this.state.zoom}
                center={this.state.center}
                onZoomChanged={props.onZoomChanged.bind(this)}
                onCenterChanged={props.onCenterChanged.bind(this)}
                ref={this.googleMap}
                onClick={(e) => this.handleMapClick(e)}
            >
                {
                    this.state.route != null &&
                    <DirectionsRenderer
                        directions={this.state.route}
                    />
                }
                {
                    this.state.clickLatLng != null &&
                    <Marker
                        position={this.state.clickLatLng}
                        icon={{ url: require("../../images/clickLatLng.png"), scaledSize: { width: 16, height: 16 } }}
                    >
                    </Marker>
                }
                {
                    this.state.routeMarkerFrom != null && this.state.route === null &&
                    <Marker
                        position={this.state.routeMarkerFrom}
                    //label={{ text: "C", color: "#ffffff" }}
                    >
                    </Marker>
                }
                {
                    this.state.routeMarkerTo != null && this.state.route === null &&
                    <Marker
                        position={this.state.routeMarkerTo}
                    //label={{ text: "D", color: "#ffffff" }}
                    >
                    </Marker>
                }
                {
                    this.state.markers.length != 0 ?
                        this.state.markers.map((marker, index) => {
                            return (
                                <Marker
                                    key={index}
                                    position={marker.latlng}
                                    icon={marker.isSelect ? { url: require("../../images/station_blue.png"), scaledSize: { width: 52, height: 52 } }
                                        : { url: require("../../images/station_brown.png"), scaledSize: { width: 52, height: 52 } }}
                                    label={{ text: marker.children.countCharging.toString(), color: "#ffffff" }}
                                    onClick={() => this.handleStationInfoOpen(marker)}
                                >
                                </Marker>
                            )
                        })
                        : null
                }
                {
                    this.state.markersMet.length != 0 ?
                        this.state.markersMet.map((marker, index) => {
                            return (
                                <Marker
                                    key={index}
                                    position={marker.latlng}
                                    icon={marker.isSelect ? { url: require("../../images/circle_blue.png"), scaledSize: { width: 42, height: 42 } } 
                                                          : ((marker.children.chargeLevel < 50) ? { url: require("../../images/circle_dark_gray.png"), scaledSize: { width: 42, height: 42 } }
                                                                                              : ((marker.children.isForsaken) ? { url: require("../../images/circle_yellow.png"), scaledSize: { width: 42, height: 42 } } 
                                                                                                                   : { url: require("../../images/circle_green.png"), scaledSize: { width: 42, height: 42 } }))}
                                    label={{ text: marker.children.metTypeName[0].toString(), color: "#ffffff" }}
                                    onClick={() => this.handleMetInfoOpen(marker)}
                                >
                                </Marker>
                            )
                        })
                        : null
                }
            </GoogleMap>

        )));
        return (
            <div>
                <div className={classes.controlButtonMap}>
                    {
                        <Button onClick={() => this.refresh()} className={classes.gradientButton}>
                            {<Loop />}
                            {strings.upd}
                        </Button>
                    }                   
                    {
                        this.state.route != null &&
                        <Button onClick={this.chariotClick} className={this.state.metType === "chariot" ? classes.activeButton : classes.gradientButton}>
                            {<ChildFriendly />}
                        </Button>
                    }
                    {
                        this.state.route != null &&
                        <Button onClick={this.bikeClick} className={this.state.metType === "byke" ? classes.activeButton : classes.gradientButton}>
                            {<DirectionsBike />}
                        </Button>
                    }
                    {
                        this.state.route != null &&
                        <Button onClick={this.footClick} className={this.state.metType === "foot" ? classes.activeButton : classes.gradientButton}>
                            {<DirectionsWalk />}
                        </Button>
                    }
                    {
                        this.state.route != null &&
                        <Button onClick={this.motoClick} className={this.state.metType === "scooter" ? classes.activeButton : classes.gradientButton}>
                            {<Motorcycle />}
                        </Button>
                    }
                    {
                        (this.state.clickLatLng != null || this.state.isOpenMetInfo || this.state.isOpenStationInfo) &&
                        <Button onClick={() => this.setMarkerFrom()} className={classes.gradientButton}>
                            {<Directions />}
                            {strings.fromHere}
                        </Button>
                    }
                    {
                        (this.state.clickLatLng != null || this.state.isOpenMetInfo || this.state.isOpenStationInfo) &&
                        <Button onClick={() => this.setMarkerTo()} className={classes.gradientButton}>
                            {<Directions />}
                            {strings.here}
                        </Button>
                    }
                    {
                        <Autocomplete
                            className={classes.comboForMap}                            
                            onChange={this.filterStations}
                            id="stations"
                            options={this.props.stationMetsLatLng}
                            getOptionLabel={option => option.adress + "; " + option.name}
                            style={{ width: 400 }}
                            renderInput={params => (
                            <TextField {...params} label={strings.chooseStation} variant="outlined" fullWidth />
                            )}
                      />
                    }
                    {
                        (this.state.routeMarkerFrom != null || this.state.routeMarkerTo != null || this.state.clickLatLng != null) &&
                        <Button onClick={() => this.deleteRoute()} className={classes.gradientButton}>
                            {<Timeline />}
                            {strings.delete}
                        </Button>
                    }                   
                    {
                        this.state.route != null &&
                        <div style={{ lineHeight: 0.1}}>
                        <h5><font color="#1178bd">{strings.distance}: </font>{this.state.routeDistance + " km"}</h5>
                        <h5><font color="#1178bd">{strings.duration}: </font>{this.state.routeDuration + " min"}</h5>
                        {this.state.metType != 'foot' &&
                        <h5><font color="#1178bd">{strings.cost}: </font>{(Math.ceil(this.state.routeDuration/this.props.actualTarif.intervalMinute) * this.props.actualTarif.price).toFixed(2) }</h5>
                        }
                        </div>
                    }                    
                </div>
                <br/>
                <Map
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAkT4_S6OTbGMer1-VRBbWASaH_bluGfuQ&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `550px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    onZoomChanged={this.handleZoomChanged}
                    onCenterChanged={this.handleCenterChanged}
                />
                {
                    this.state.isOpenStationInfo ?
                        <div style={{ lineHeight: 0.1}}>
                            <h5><font color="#1178bd">{strings.station}: </font>{"№" + this.state.marker.code}</h5>
                            <h5><font color="#1178bd">{strings.address}: </font>{this.state.marker.adress}</h5>
                            <h5><font color="#1178bd">{strings.transport}: </font>{strings.chariot + "(" + this.state.marker.countChariot + "); " + strings.byke + "(" + this.state.marker.countByke + "); " + strings.moto +"(" + this.state.marker.countMoto + "); "}</h5>
                            <h5><font color="#1178bd">{strings.slots}: </font>{strings.free + "(" + this.state.marker.countFreeSlots + "); " + strings.isCharging + "(" + this.state.marker.countCharging + "); "}</h5>
                        </div>
                        : null
                }
                {
                    this.state.isOpenMetInfo ?
                        <div style={{ lineHeight: 0.1}}>
                            <h5><font color="#1178bd">{strings.transportType}: </font>{this.state.marker.children.metTypeName}</h5>
                            <h5><font color="#1178bd">{strings.chargeLevel}: </font>{this.state.marker.children.chargeLevel + "%"}</h5>
                            <h5><font color="#1178bd">{strings.number}: </font>{this.state.marker.children.chariotNumber}</h5>
                        </div>
                        : null
                }
            </div>
        );
    }
};
function mapStateToProps(state) {
    return {
        stationMet: state.stationMet,
        actualTarif: state.actualTarif,
        language: state.language
    };
}
const mapDispatchToProps = dispatch => {
    return {
        refreshStaionMet: (idStationMet) => { dispatch(fetchSelectStationMet(idStationMet)); },
        getActualTarif: (metTypeCode) => { dispatch(fetchActualTarif(metTypeCode)); },

    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapView));




