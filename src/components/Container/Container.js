import React from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Drawer, AppBar, Toolbar, CssBaseline, Divider, IconButton } from '@material-ui/core';
import { Menu, ChevronLeft, ChevronRight, Info, Motorcycle, PermIdentity, EvStation, Assignment, ImportContacts, EuroSymbol, Map, Timeline, Help, AttachMoney } from '@material-ui/icons';
import Header from '../Header/Header'
import SideBar from '../SideBar/SideBar'
import ContainerStyles from './ContainerStyles';
import Users from '../Users/Users';
import TransactionsUsers from '../Users/TransactionsUsers';
import TripsUsers from '../Users/TripsUsers';
import AboutProgram from '../AboutProgram/AboutProgram.js';
import UserHelp from '../Help/Help.js';

import Home from '../Home/Home';

import { connect } from 'react-redux';
import { authenticationService } from '../../services';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'

import user from './user.png';
import about from './about.png';
import trip from './trip.png';

let strings = new LocalizedStrings(data);

const styles = ContainerStyles;

class MiniDrawer extends React.Component {
    state = {
        anchorEl: null,
        open: true,
    };

    handleDrawerOpen = () => { 
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    onLogout = () =>{
        this.props.onLogout();
    }

    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        var menuItems = [
            { title: strings.map, link: '/', icon: <img src={user} style={{width:'34px', height:'34px'}}/> },        
            { title: strings.trips, link: '/trips/', component: TripsUsers, icon: <img src={trip} style={{width:'34px', height:'34px'}}/> },      
            { title: strings.profile, link: '/user/', component: Users, icon: <img src={user} style={{width:'34px', height:'34px'}}/> },   
            { title: strings.score, link: '/transactions/', component: TransactionsUsers, icon: <img src={user} style={{width:'34px', height:'34px'}}/> },   
            { title: strings.abouteProgram, link: '/aboutProgram/', component: AboutProgram, icon: <img src={about} style={{width:'34px', height:'34px'}}/> },
            { title: strings.help, link: '/help/', component: UserHelp, icon: <img src={user} style={{width:'34px', height:'34px'}}/> },
        ];       
        const { anchorEl } = this.state;
        const { classes, theme } = this.props;

        return (
            <Router>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        className={classNames(classes.appBar, {
                            [classes.appBarShift]: this.state.open,
                        })}
                    >
                        <Toolbar disableGutters={!this.state.open}>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(classes.menuButton, {
                                    [classes.hide]: this.state.open,
                                })}
                            >
                                <Menu />
                            </IconButton>
                            <Header onLogout = {this.onLogout.bind(this)}/>
                        </Toolbar>
                    </AppBar>
                    <Drawer  
                        variant="permanent"
                        className={classNames(classes.drawer, {
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        })}
                        classes={{
                            paper: classNames({
                                [classes.drawerOpen]: this.state.open,
                                [classes.drawerClose]: !this.state.open,
                            }),
                        }}
                        open={this.state.open}
                    >
                        <div className={classes.toolbar}>
                            <IconButton onClick={this.handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                            </IconButton>
                        </div>
                        <Divider />
                        <SideBar menuItems={menuItems}/>
                        <Divider />
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <Route path="/" exact component={Home} />
                        {menuItems.map((menuItem, title) => {
                            return (
                                menuItem.dropdownItems ? (
                                    menuItem.dropdownItems.map(function (Item, title) {
                                        return (
                                            <Route key={title}  path={Item.link} component={Item.component} />
                                        )

                                    })

                                ) : (
                                        <Route key={title} path={menuItem.link} component={menuItem.component} />
                                    )
                            )
                        })}


                    </main>
                </div>
            </Router>
        );
    }
}

MiniDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {     
      language: state.language
    };
} 
  
  
  //connect позволяет подключить наше хранилище резервов к компоненту
  export default connect(mapStateToProps, null)(withStyles(styles, { withTheme: true })(MiniDrawer));
  //по сути создается контейнер для хранения состояния приложения
