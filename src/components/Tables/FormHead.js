import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {  Toolbar, Typography, InputBase} from '@material-ui/core';
import {  Search } from '@material-ui/icons';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { connect } from 'react-redux';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'
let strings = new LocalizedStrings(data);

const toolbarStyles = theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
      color:'#ffffff'
    }, 
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: '#0099ff',
      '&:hover': {
        backgroundColor: '#0099ff',
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit,
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color:"#ffffff",
      zIndex: 1,
    },
    inputRoot: {
      color: '#ffffff',
      width: '100%',
      backgroundColor:'#0099ff',
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
    tolbar: {
      backgroundColor: '#0099ff',
      margin:'25px',
      borderRadius:'10px'
    },
    controlPanel: {
      justifyContent: 'start'
    },
    input:{
      
    }
  });

class FormHead extends React.Component {
    state = {
        checkedG: true
    };
    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleInputChange = e => {
      this.setState({
          [e.target.name]: e.target.value,
      });
      if(this.props.onSearch != undefined)
            this.props.onSearch(this.props.id === undefined ? undefined : this.props.id, e.target.value)
    };
    
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes, numSelected } = this.props;

        return (
            <Toolbar
            className={classNames(classes.root, classes.tolbar, {
              [classes.highlight]: numSelected > 0,
            })}
          >
            <div className={classes.title}>
              {numSelected > 0 ? (
                <Typography color="inherit" variant="subtitle1">
                  {this.props.title}: {numSelected} {strings.recordSelected}
                </Typography>
              ) : (
                  <Typography variant="h6" id="tableTitle">
                    {this.props.title}
                </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            {this.props.isSearch === true ?
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <Search />
              </div>
              <InputBase
                value={this.state.filterText}
                name="filterText"
                onChange={this.handleInputChange}
                placeholder={strings.search}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            :null
            }
          </Toolbar>
        );
    }
}

FormHead.propTypes = {
    classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {     
    language: state.language
  };
} 

//connect позволяет подключить наше хранилище резервов к компоненту
export default connect(mapStateToProps, null)(withStyles(toolbarStyles)(FormHead));
//по сути создается контейнер для хранения состояния приложения
