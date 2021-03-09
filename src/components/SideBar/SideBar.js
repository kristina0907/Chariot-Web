import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ListSubheader, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';




const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 2,
  },
});

class NestedList extends React.Component {
  state = {
    open: false,
  };

  handleClick = (e) => {
    this.setState({ [e]: !this.state[e] });
  };

  render() {
    const { classes } = this.props;

    return (
      <List>
        {this.props.menuItems.map((menuItem, index) => {
          return (
            <React.Fragment>
              <Link style={{textDecoration:"none"}} to={menuItem.link}>
                <ListItem button key={index} onClick={menuItem.dropdownItems ? this.handleClick.bind(this,menuItem.title) : ''}>
                  <ListItemIcon style={{color:'#ffffff'}}> {menuItem.icon} </ListItemIcon>
                  <ListItemText style={{color:'#ffffff'}} primary={menuItem.title} ><Link  to={menuItem.link} /></ListItemText>
                  {menuItem.dropdownItems ? (this.state.open ? <ExpandLess /> : <ExpandMore />) : ""}
                </ListItem>
              </Link>
              {menuItem.dropdownItems ? (
                <Collapse in={this.state[menuItem.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menuItem.dropdownItems.map(function (menuItem, index) {
                      return (
                        <Link to={menuItem.link}>
                          <ListItem button key={index} className={classes.nested}>
                            <ListItemIcon style={{color:'#ffffff'}}> {menuItem.icon} </ListItemIcon>
                            <ListItemText style={{color:'#ffffff'}} primary={menuItem.title} ><Link to={menuItem.link} /></ListItemText>
                          </ListItem>
                        </Link>
                      );
                    })}
                  </List>
                </Collapse>
              ) : ''}
            </React.Fragment>
          );
        })}

      </List>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NestedList);
