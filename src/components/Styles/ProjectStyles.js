import Fon from '../Styles/desctop.png';
export default theme => ({ 
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      paddingTop:'15px'
    },
    table: {
      minWidth: 1020,
      padding:'15px',
    },
    tableWrapper: {
      overflowX: 'auto',
      padding: '0 24px',
    },
    appBar: {
      position: 'relative',
      background: 'linear-gradient(45deg, #0099ff  10%, #0099ff  50%)',
    },
    flex: {
      flex: 1,
      color:'#ffffff',
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginBottom: '10px',
      marginTop: '10px',
      width: 300
    },
    textFieldRegister: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginBottom: '10px',
      marginTop: '10px',      
      width: '80%'
    },  
    phoneField: {
      marginLeft: '55px',
      marginRight: '55px',
      marginBottom: '10px',
      marginTop: '10px',
      width: '70%'
    },   
    login_form:{
      padding:'23px 23px 23px 23px',
      textAlign:'center'

    },  
    tableCellStyle: {
      color:'#ff6600',
      fontWeight: 'bold'
    },
    labelStyle: {
      color:'#ff6600',
      fontWeight: 'bold'
    },    
    clear:{
      clear:'both'
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
      backgroundColor:'#fafafa',
      width: '80%',
      margin: 'auto',
      textAlign: 'center',
      boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
      marginTop: '24px',
      marginBottom: '24px',
      borderRadius: '4px',
    },
    content_form:{
      padding:'24px 100px 25px 90px',
      // "& div": {
      //   width:'100%',
      //   marginBottom: '15px',
      //   "& div": {
      //     width:'100%',
      //   }
      // }
    },  
      
    profile_form:{
      padding:'0 24px 25px 15px',
      "& div": {
        width:'47%',
        marginBottom: '15px',
        "& div": {
          width:'100%',
        }
      }
    },
    gradientButton:{
      background: 'linear-gradient(45deg, #ff6600 30%, #ff6600 90%)',
      color:'#fff',
      padding:'0 10px',
      borderRadius:'10px',
     height:'50px',
     minWidth:'150px',
     marginTop:'25px',
     marginRight:"25px"
    },
    comboForMap: {
      display: 'inline-block',
      width: 700,
      marginRight:'10px',    
      float: 'right'
    },
    controlPanel:{
      padding:'0 24px 25px 24px',
      textAlign: 'left',
    },
    container_block:{
      padding:"0 24px 25px 24px",
      "& .leaflet-container":{
        height:"550px",
      }
    },
    inputlogin:{
      width: '100%',
      border: '0',
      margin: '0',
      padding: '6px 0 7px',
      display: 'block',
      borderBottom:'1px solid #C5D2E0',
      marginBottom: '35px',
      fontSize:'16px',
      marginTop:'35px'
    },
    ContainerLogo:{
      // width:'30%',
      // margin:'auto',
      // textAlign:'center',
      display: 'flex',
      justifyContent: 'center',
      marginRight:'10%',
      flexWrap: 'wrap',
    },
    rootLogo:{
      padding:'10px 35px 35px',
      width: '85%',
      marginTop: theme.spacing.unit * 3,
      borderRadius:'10px'
    },
    gradientContainer:{
      //background: 'linear-gradient(45deg, #4d63d5 30%, #ff7c5c 90%)',
      //background: 'linear-gradient(45deg, #0099ff  10%, #0099ff  50%)',
      backgroundImage: 'url('+Fon+')',
      backgroundSize:'cover',
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      display: 'flex',
      position: 'fixed',
    },
    itemContainer:{
      position: 'absolute',
      top: '15px',
      right: '30px',
      display: 'inline-block',
    },
    containerMap:{
      width: '100vw',
      height: '100vh',
      position:'relative',
      overflow:'hidden',
    },
    controlButtonMap:{
      padding:'10px 0px 10px',
    },
    activeButton:{
      background: 'linear-gradient(45deg, #0099ff 30%, #0099ff 90%)',
      color: '#fff',
      marginRight: '10px',
    },
    infoBlockMap:{
      margin:'25px 0',
    },

    labelAsterisk: {
      color: "red"
    },
    cssLabel: {
      color: "orange"
    },
    cssRequired: {
      "&:before": {
        borderBottom: "2px solid orange"
      }
    },
  });