import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import ProjectStyles from '../Styles/ProjectStyles';
import FormHead from "../Tables/FormHead";
import { connect } from 'react-redux';
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'
let strings = new LocalizedStrings(data);
const styles = ProjectStyles;

class AboutProgram extends React.Component {
    state = {        
    };
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <FormHead title={strings.abouteProgram} isSearch={false}/>
                <div className={classes.container_block}>
                    <p>CHARIOT</p>
                    <p>1.0</p>
                    <p>Terms of use</p>
                </div>
            </Paper>
        );
    }
}
AboutProgram.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {     
      language: state.language
    };
}  
  
//connect позволяет подключить наше хранилище резервов к компоненту
export default connect(mapStateToProps, null)(withStyles(styles)(AboutProgram));
//по сути создается контейнер для хранения состояния приложения