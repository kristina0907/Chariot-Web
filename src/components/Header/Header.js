import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu,Select,Input,CardMedia } from '@material-ui/core';
import { Notifications, AccountCircle, Close, MoreVert } from '@material-ui/icons';
import Flag from 'react-world-flags'

import MenuIcon from '@material-ui/icons/Menu';

import { authenticationService } from '../../services';

import headerStyles from './HeaderStyles';

import { connect } from 'react-redux';
import { setLanguage } from '../../actions/language';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'
let strings = new LocalizedStrings(data);
const styles = headerStyles;

class PrimarySearchAppBar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    language: localStorage.getItem('language') != undefined ? localStorage.getItem('language') : "en"
  };

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
    this.props.onChangeLanguage(event.target.value);
    localStorage.setItem('language', event.target.value);
  };

  onLogout = () => {   
      this.props.onLogout();
  }

  render() {
    strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)

    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >       
        <MenuItem onClick={this.onLogout.bind(this)}>{strings.logOut}</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >

        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
let ru= <Flag code="ru" height="16" />;
    return (
      <React.Fragment>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          <Link className={classes.nameAplication} to='/'> Chariot</Link>
        </Typography>
        <div className={classes.grow} />
        <div >          
          <Select
            native
            value={this.state.language}
            onChange={this.handleChange('language')}
            input={<Input id="age-native-simple" />}
            style={{color:'#ffffff',textDecoration:'none'}}
          >
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </Select>
          
          <IconButton
            title = {strings.user + ": " + authenticationService.currentUserValue.name +  " " + authenticationService.currentUserValue.surName }
            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleProfileMenuOpen}
            color="inherit"
          >
            <div style={{fontSize:"16px",margin:"0 25px"}}>{authenticationService.currentUserValue.name + " " + authenticationService.currentUserValue.surName}</div>
            <AccountCircle style={{fontSize:"35px"}}/>
          </IconButton>
        </div>
        <div className={classes.sectionMobile}>
        </div>       

        {renderMenu}
        {renderMobileMenu}
      </React.Fragment>

    );
  }
}
function mapStateToProps(state) {
  return {     
    language: state.language
  };
}  
const mapDispatchToProps = dispatch => {
  return {
    onChangeLanguage: language => { dispatch(setLanguage(language)); },
  };
};
PrimarySearchAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};
//connect позволяет подключить наше хранилище резервов к компоненту
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PrimarySearchAppBar));
//по сути создается контейнер для хранения состояния приложения
