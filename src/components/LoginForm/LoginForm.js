import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '../Container/Container';
import { Paper, Button, TextField, Select, Input } from '@material-ui/core';
import ProjectStyles from '../Styles/ProjectStyles';
import { authenticationService } from '../../services';
import { connect } from 'react-redux';
import { changePassword } from '../../actions/user';
import { setLanguage } from '../../actions/language';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import MessageRecipient from '../../actions/messageRecipient';
import ReCAPTCHA from "react-google-recaptcha";
import LocalizedStrings from 'react-localization';
import data from '../../localization/data.json'
let strings = new LocalizedStrings(data);
const styles = ProjectStyles;

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            phone: '',
            err: '',
            lastCaptchaCheck: new Date(),
            signalRConnection: null
        };
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.logout = this.logout.bind(this);
        this.clearError = this.clearError.bind(this);
    }

    setLoggedIn(currentUser, phone) {
        if (currentUser) {
            this.setState({
                loggedIn: true, phone: phone, err: '',
                lastCaptchaCheck: new Date()
            });
        } else {
            switch (authenticationService.error) {
                case 'invalid password':
                    this.setState({
                        err: strings.passwordIncorrect,
                        lastCaptchaCheck: new Date()
                    });
                    break;
                case 'no user with this phone':
                    this.setState({
                        err: strings.phoneIncorrect,
                        lastCaptchaCheck: new Date()
                    });
                    break;
                case 'invalid captcha':
                    this.setState({
                        err: "Ошибка проверки CAPTCHA",
                        lastCaptchaCheck: new Date()
                    });
                    break;
                default:
                    break;
            }
        }
    }

    componentDidMount() {
        this.setLoggedIn(authenticationService.currentUserValue);
    }

    async login(phone, password, captchaToken) {
        if (this.props.useCaptcha) {
            if (captchaToken === null || captchaToken === '') {
                this.setState({ err: 'Подтвердите, что вы не робот.' });
                return;
            }
        }

        await authenticationService.login(phone, password, captchaToken);
        this.setLoggedIn(authenticationService.currentUserValue, phone);
    }

    logout() {
        authenticationService.logout();
        this.setState({ loggedIn: false, phone: '' });
    }

    async register(email, password, name, surName, phone, birtDate) {
        await authenticationService.register(email, password, name, surName, phone, birtDate);
        this.setLoggedIn(authenticationService.currentUserValue, phone);
    }

    clearError() {
        this.setState({ err: '' });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.loggedIn && !prevState.loggedIn) { // logged in
            console.log('User logged in');
            this.setState({ signalRConnection: new MessageRecipient() });
        }

        if (!this.state.loggedIn && prevState.loggedIn) { // logged out
            console.log('User logged out');
            if (this.state.signalRConnection)
                this.state.signalRConnection.close();
            this.setState({ signalRConnection: null });
        }
    }

    // testButton = () => {
    //     if (this.state.signalRConnection)
    //         this.state.signalRConnection.test('Hello');
    // }

    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        var page;
        if (this.state.loggedIn) {
            page = <Container onLogout={this.logout} />;
        } else {
            page = <Login useCaptcha={this.props.useCaptcha} lastCaptchaCheck={this.state.lastCaptchaCheck} onLogin={this.login} onRegister={this.register} error={this.state.err} clearError={this.clearError} />;
        }
        return (
            <div>
                {/* <Button style={{ zIndex: 10000 }} onClick={this.testButton}>Test button</Button> */}
                {page}
                <span className="centre">{this.state.err}</span>
            </div>
        );
    }
}

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRegister: false,
            text: strings.noAccount,
            isAccessRecovery: false,
            accessRecoverytext: strings.forgotPassword,
            language: localStorage.getItem('language') != undefined ? localStorage.getItem('language') : "en"
        };

        this.onRegisterClick = this.onRegisterClick.bind(this);
        this.onAccessRecoveryClick = this.onAccessRecoveryClick.bind(this);
    }
    onLogin = (phone, password, captchaToken) => {
        this.props.onLogin(phone, password, captchaToken);
    }
    onRegister = (email, password, name, surName, phone, birtDate) => {
        this.props.onRegister(email, password, name, surName, phone, birtDate);
    }
    onRegisterClick() {
        if (!this.state.isRegister) {
            this.setState({ isRegister: true });
            this.setState({ text: strings.alreadyHaveAccount });
        }
        else {
            this.setState({ isRegister: false });
            this.setState({ text: strings.noAccount });
        }
        this.props.clearError();
    }

    onAccessRecoveryClick() {
        if (!this.state.isAccessRecovery) {
            this.setState({ isAccessRecovery: true });
            this.setState({ accessRecoverytext: strings.back });
        }
        else {
            this.setState({ isAccessRecovery: false });
            this.setState({ accessRecoverytext: strings.forgotPassword });
        }
        this.props.clearError();
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
        this.props.onChangeLanguage(event.target.value);
        localStorage.setItem('language', event.target.value);
    };
    componentWillReceiveProps() {
        if (this.state.isRegister) {
            this.setState({ text: strings.alreadyHaveAccount });
        }
        else {
            this.setState({ text: strings.noAccount });
        }
        if (this.state.isAccessRecovery) {
            this.setState({ accessRecoverytext: strings.back });
        }
        else {
            this.setState({ accessRecoverytext: strings.forgotPassword });
        }
    }
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (
            <div className={classes.gradientContainer}>
                 <div className={classes.itemContainer}>
                 <Select
                            style={{ float: 'right',color:"#ffffff" }}
                            native
                            value={this.state.language}
                            onChange={this.handleChange('language')}
                            input={<Input id="age-native-simple" />}
                        >
                            <option value="ru">RU</option>
                            <option value="en">EN</option>
                        </Select>
                 </div>
                <div className={classes.ContainerLogo}>
                <h2 style={{color:"#ffffff", fontSize:"32px"}}>Chariot</h2>
                    <Paper className={classes.rootLogo}>
                        <div style={{textAlign:'center'}} className="card card-container">
                            <label style={{ color: 'red' }}>
                                {this.props.error}
                            </label>
                            <p id="profile-name" className="profile-name-card"></p>
                            {(!this.state.isRegister && !this.state.isAccessRecovery) ? (<LoginContent useCaptcha={this.props.useCaptcha} lastCaptchaCheck={this.props.lastCaptchaCheck} onLogin={this.onLogin.bind(this)} />)
                                : ((this.state.isRegister) ? <RegisterContent useCaptcha={this.props.useCaptcha} onRegister={this.onRegister.bind(this)} /> : <AccessRecovery useCaptcha={this.props.useCaptcha} onAccessRecoveryClick={this.onAccessRecoveryClick} />)}

                            {(!this.state.isRegister) ?
                                <Button style={{ textTransform: 'none'}} onClick={this.onAccessRecoveryClick} color='black'>{this.state.accessRecoverytext}</Button>
                                : null}
                            <br />
                            {(!this.state.isAccessRecovery) ?
                                <Button style={{ textTransform: 'none'}} onClick={this.onRegisterClick} color='black'>{this.state.text}</Button>
                                : null}

                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}

class LoginContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "", phone: "",
            captchaToken: null,
        };
        this.recaptchaRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.useCaptcha &&
            this.props.lastCaptchaCheck !== prevProps.lastCaptchaCheck) {
            console.log('ReCaptcha token reset')
            this.setState({ captchaToken: null });
            this.recaptchaRef.current.reset();
        }
    }

    recaptchaOnChange = (recaptchaToken) => {
        // Here you will get the final recaptchaToken!!!  
        console.log('ReCaptcha token: ' + recaptchaToken)
        this.setState({ captchaToken: recaptchaToken });
    }

    submitLoginForm(event) {
        event.preventDefault();
        this.props.onLogin(this.state.phone, this.state.password, this.state.captchaToken);
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (
            <form className={classes.login_form} onSubmit={this.submitLoginForm.bind(this)}>
                <span id="reauth-email" className="reauth-email"></span>
                <PhoneInput flags={flags} limitMaxLength={true} maxLength="20" onChange={value => this.setState({ phone: value })} name="phone" value={this.state.phone} placeholder={strings.phone} required />
                <input type="password" onChange={this.handleInputChange} name="password" id="inputPassword" className={classes.inputlogin} placeholder={strings.password} required />
                <div className={classes.clear}></div>
                {this.props.useCaptcha &&
                    <ReCAPTCHA
                        ref={this.recaptchaRef}
                        style={{ padding: '6px 0 7px',display: 'flex', justifyContent: 'center' }}
                        sitekey="6LfpPM8UAAAAAFqeK0-vsT4m_Cj7DmEyDTfsdNGR"
                        onChange={this.recaptchaOnChange}
                        hl={this.props.language}
                    />}
                <Button className={classes.gradientButton} type="submit">{strings.signIn}</Button>
            </form>
        );
    }
}

class RegisterContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            isConfirmationCode: false,
            email: "", password: "", name: "", surName: "", phone: "", birtDate: "", confirmPassword: "",
            captchaToken: null,
            showPassword: false,
            showConfirmPassword: false,
        };
    }

    recaptchaOnChange = (recaptchaToken) => {
        // Here you will get the final recaptchaToken!!!  
        console.log('ReCaptcha token: ' + recaptchaToken)
        this.setState({ captchaToken: recaptchaToken });
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    async submitRegisterForm(event) {
        event.preventDefault();
        // const re = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}/g;
        const re = /(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,}/g;
        if (this.state.phone == null || this.state.phone == "") {
            this.setState({ error: strings.phoneRequired })
            return;
        }
        if (this.state.password == null || this.state.password == "") {
            this.setState({ error: strings.passwordRequired })
            return;
        }
        if (!re.test(this.state.password)) {
            this.setState({ error: strings.passwordValidate })
            return;
        }
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ error: strings.passwordsNotMatch })
            return;
        }

        if (this.props.useCaptcha) {
            if (this.state.captchaToken === null || this.state.captchaToken === '') {
                this.setState({ error: strings.confirmRobot });
                return;
            }

            await authenticationService.ValidateCaptcha(this.state.captchaToken);

            if (authenticationService.recaptchaResponse !== null) {
                console.log('Recaptcha validation result ' + JSON.stringify(authenticationService.recaptchaResponse));
                if (authenticationService.recaptchaResponse.success !== 'true') {
                    this.setState({ error: strings.recaptchaValidation })
                    return;
                }
            } else {
                console.logalert('Recaptcha validation failed.');
                this.setState({ error: strings.recaptchaValidation })
                return;
            }
        }

        await authenticationService.CheckPhoneUniq(this.state.phone);
        if (authenticationService.errorPhoneUniq === "") {
            this.setState({ isConfirmationCode: true, error: "" });
            await authenticationService.generateConfirmationCode(this.state.phone);
        } else {
            this.setState({ isConfirmationCode: false });
            this.setState({ error: "Пользователь с таким телефоном уже зарегистрирован!" })
        }
    }

    handleClickShowPassword = () => {
        this.setState({
            showPassword: true
        });
    };

    handleMouseDownPassword = () => {
        this.setState({
            showPassword: false
        });
    };
    handleClickShowConfirmPassword = () => {
        this.setState({
            showConfirmPassword: true
        });
    };

    handleMouseDownConfirmPassword = () => {
        this.setState({
            showConfirmPassword: false
        });
    };

    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (
            <div>
                {
                    this.state.isConfirmationCode ?
                        <ConfirmationCodeForRegister onRegister={this.props.onRegister} registrationData={this.state} />
                        : null
                }
                {
                    !this.state.isConfirmationCode ?
                        <form className={classes.login_form} onSubmit={this.submitRegisterForm.bind(this)}>
                            <label style={{ color: 'red' }}>{this.state.error}</label>
                            <span id="reauth-email" className="reauth-email"></span>
                            <TextField label={strings.email} className={classes.textFieldRegister} inputProps={{ 'aria-label': 'Description', maxLength: 50 }} variant="outlined" name="email" onChange={this.handleInputChange} value={this.state.email} />
                            <div className={classes.clear}></div>
                            <TextField label={strings.nameUser} className={classes.textFieldRegister} inputProps={{ 'aria-label': 'Description', maxLength: 50 }} variant="outlined" name="name" onChange={this.handleInputChange} value={this.state.name} />
                            <div className={classes.clear}></div>
                            <TextField label={strings.surname} className={classes.textFieldRegister} inputProps={{ 'aria-label': 'Description', maxLength: 50 }} variant="outlined" name="surName" onChange={this.handleInputChange} value={this.state.surName} />
                            <div className={classes.clear}></div>
                            <TextField id="datetime-local" className={classes.textFieldRegister} label={strings.birthday} type="date" variant="outlined" name="birtDate" onChange={this.handleInputChange} value={this.state.birtDate}
                                InputLabelProps={{ shrink: true, }}
                            />
                            <div className={classes.clear}></div>
                            {/* <input maxLength="50" onChange={this.handleInputChange} name="phone" value={this.state.phone} id="inputPhone" className={classes.inputlogin} placeholder="Телефон" required autoFocus />
                            <div className={classes.clear}></div> */}
                            <PhoneInput className={classes.phoneField} flags={flags} limitMaxLength={true} maxLength="20" onChange={value => this.setState({ phone: value })} name="phone" value={this.state.phone} placeholder={strings.phone} required />
                            <div className={classes.clear}></div>
                            <TextField
                                label={strings.password}
                                className={classes.textFieldRegister}
                                inputProps={{
                                    maxLength: 15,
                                    minLength: 6,
                                }}
                                InputProps={{
                                    'aria-label': 'Description',
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                aria-label="toggle password visibility"
                                                onClick={this.handleClickShowPassword}
                                                onMouseDown={this.handleMouseDownPassword}
                                            >
                                                {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                name="password"
                                type={this.state.showPassword ? 'text' : 'password'}
                                onChange={this.handleInputChange}
                                value={this.state.password}
                            />
                            <div className={classes.clear}></div>
                            <TextField
                                label={strings.confirmPassword}
                                className={classes.textFieldRegister}
                                inputProps={{
                                    maxLength: 15,
                                    minLength: 6,
                                }}
                                InputProps={{
                                    'aria-label': 'Description',
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                aria-label="toggle password visibility"
                                                onClick={this.handleClickShowConfirmPassword}
                                                onMouseDown={this.handleMouseDownConfirmPassword}
                                            >
                                                {this.state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                name="confirmPassword"
                                type={this.state.showConfirmPassword ? 'text' : 'password'}
                                variant="outlined"
                                onChange={this.handleInputChange}
                                value={this.state.confirmPassword}
                            />
                            {this.props.useCaptcha &&
                                <ReCAPTCHA
                                    style={{ padding: '6px 0 7px', width:"100%" }}
                                    sitekey="6LfpPM8UAAAAAFqeK0-vsT4m_Cj7DmEyDTfsdNGR"
                                    onChange={this.recaptchaOnChange}
                                    hl={this.props.language}
                                />}
                            <Button className={classes.gradientButton} type="submit">{strings.register}</Button>
                        </form>
                        : null
                }
            </div>
        );
    }
}


class AccessRecovery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmationCode: false,
            phone: "",
            error: "",
            captchaToken: null
        };
        this.onAccessRecoveryClick = this.onAccessRecoveryClick.bind(this);
        this.recaptchaRef = React.createRef();
    }

    submitAccessRecoveryForm(event) {
        event.preventDefault();
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    async onAccessRecoveryClick() {
        if (this.props.useCaptcha) {
            if (this.state.captchaToken === null || this.state.captchaToken === '') {
                this.setState({ error: strings.confirmRobot });
                return;
            }
        }

        await authenticationService.generateConfirmationCodeForRestoringAccess(this.state.phone, this.state.captchaToken);

        if (this.props.useCaptcha) {
            console.log('ReCaptcha token reset')
            this.setState({ captchaToken: null });
            this.recaptchaRef.current.reset();
        }

        if (!this.state.isConfirmationCode &&
            authenticationService.phoneError === '' &&
            authenticationService.error === '') {
            this.setState({ isConfirmationCode: true, error: '' });
        } else if (authenticationService.phoneError !== '') {
            this.setState({ isConfirmationCode: false, error: strings.phoneNotExist });
        } else {
            this.setState({ isConfirmationCode: false, error: strings.recaptchaValidation });
        }
    }

    recaptchaOnChange = (recaptchaToken) => {
        // Here you will get the final recaptchaToken!!!  
        console.log('ReCaptcha token: ' + recaptchaToken)
        this.setState({ captchaToken: recaptchaToken });
    }

    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (
            <div>
                {
                    this.state.isConfirmationCode ?
                        <ConfirmationCode phone={this.state.phone} onAccessRecoveryClick={this.props.onAccessRecoveryClick} />
                        : null
                }
                {
                    !this.state.isConfirmationCode ?
                        <form className={classes.login_form} onSubmit={this.submitAccessRecoveryForm.bind(this)}>
                            <label style={{ color: 'red' }}>{this.state.error}</label>
                            <span id="reauth-email" className="reauth-email"></span>
                            {/* <input type="name" onChange={this.handleInputChange} name="phone" value={this.state.phone} id="inputEmail" className={classes.inputlogin} placeholder="Телефон" required autoFocus />
                            <div className={classes.clear}></div> */}
                            <PhoneInput flags={flags} limitMaxLength={true} maxLength="20" onChange={value => this.setState({ phone: value })} name="phone" value={this.state.phone} placeholder={strings.phone} required />
                            <div className={classes.clear}></div>
                            <br />
                            {this.props.useCaptcha &&
                                <ReCAPTCHA
                                    ref={this.recaptchaRef}
                                    sitekey="6LfpPM8UAAAAAFqeK0-vsT4m_Cj7DmEyDTfsdNGR"
                                    onChange={this.recaptchaOnChange}
                                />}
                            <Button onClick={this.onAccessRecoveryClick} className={classes.gradientButton} type="submit">{strings.getCode}</Button>
                        </form>
                        : null
                }
            </div>
        );
    }
}

class ConfirmationCodeForRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
        this.onConfirmationCodeClick = this.onConfirmationCodeClick.bind(this);
    }
    async onConfirmationCodeClick() {
        await authenticationService.verifyConfirmCode(this.refs.codeConfirm.value, this.props.registrationData.phone.value);
        if (authenticationService.isVerifyCode) {
            this.props.onRegister(this.props.registrationData.email, this.props.registrationData.password, this.props.registrationData.name, this.props.registrationData.surName, this.props.registrationData.phone, this.props.registrationData.birtDate);
        }
        else {
            this.setState({ error: strings.codeEnteredIncorrect });
        }
    }
    submitConfirmationCodeForm(event) {
        event.preventDefault();
    }
    handleInputChange = e => {
        const re = /^[0-9\b]+$/;
        if (!(e.target.value === '' || re.test(e.target.value))) {
            this.refs.codeConfirm.value = '';
        }
    };
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (
            <div>
                <form className={classes.login_form} onSubmit={this.submitConfirmationCodeForm.bind(this)}>
                    <label style={{ color: 'red' }}>{this.state.error}</label>
                    <span id="reauth-email" className="reauth-email"></span>
                    <input maxLength="6" onChange={this.handleInputChange} type="name" ref="codeConfirm" id="inputEmail" className={classes.inputlogin} placeholder={strings.confirmationCode} required autoFocus />
                    <div className={classes.clear}></div>
                    <Button onClick={this.onConfirmationCodeClick} className={classes.gradientButton} type="submit">OK</Button>
                </form>
            </div>
        );
    }
}

class ConfirmationCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isChengePassword: false,
            error: ""
        };
        this.onConfirmationCodeClick = this.onConfirmationCodeClick.bind(this);
    }
    async onConfirmationCodeClick() {
        await authenticationService.verifyConfirmCode(this.refs.codeConfirm.value, this.props.phone);
        if (!this.state.isChengePassword && authenticationService.isVerifyCode) {
            this.setState({ isChengePassword: true, error: "" });
        }
        else {
            this.setState({ isChengePassword: false, error: strings.codeEnteredIncorrect });
        }
    }
    submitConfirmationCodeForm(event) {
        event.preventDefault();
    }
    handleInputChange = e => {
        const re = /^[0-9\b]+$/;
        if (!(e.target.value === '' || re.test(e.target.value))) {
            this.refs.codeConfirm.value = '';
        }
    };
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (
            <div>
                {
                    this.state.isChengePassword ?
                        <ChengePassword onAccessRecoveryClick={this.props.onAccessRecoveryClick} />
                        : null
                }
                {
                    !this.state.isChengePassword ?
                        <form className={classes.login_form} onSubmit={this.submitConfirmationCodeForm.bind(this)}>
                            <label style={{ color: 'red' }}>{this.state.error}</label>
                            <span id="reauth-email" className="reauth-email"></span>
                            <input maxLength="6" onChange={this.handleInputChange} type="name" ref="codeConfirm" id="inputEmail" className={classes.inputlogin} placeholder={strings.confirmationCode} required autoFocus />
                            <div className={classes.clear}></div>
                            <Button onClick={this.onConfirmationCodeClick} className={classes.gradientButton} type="submit">OK</Button>
                        </form>
                        : null
                }
            </div>
        );
    }
}

class ChengePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            password: "", confirmPassword: "",
            showPassword: false,
            showConfirmPassword: false,
        };
        this.onChengePasswordClick = this.onChengePasswordClick.bind(this);
    }
    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    onChengePasswordClick() {
        const re = /(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,}/g;
        if (!re.test(this.state.password)) {
            this.setState({ error: strings.passwordValidate })
            return;
        }
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ error: strings.passwordsNotMatch })
        }
        else {
            this.setState({ error: "" })
            this.props.onChangePassword(authenticationService.codeUser, this.state.password);
            this.props.onAccessRecoveryClick();
        }
    }
    submitChengePasswordForm(event) {
        event.preventDefault();
    }
    handleClickShowPassword = () => {
        this.setState({
            showPassword: true
        });
    };
    handleMouseDownPassword = () => {
        this.setState({
            showPassword: false
        });
    };
    handleClickShowConfirmPassword = () => {
        this.setState({
            showConfirmPassword: true
        });
    };

    handleMouseDownConfirmPassword = () => {
        this.setState({
            showConfirmPassword: false
        });
    };
    render() {
        strings.setLanguage(this.props.language.length === 0 ? localStorage.getItem('language'): this.props.language)
        const { classes } = this.props;
        return (
            <form className={classes.login_form} onSubmit={this.submitChengePasswordForm.bind(this)}>
                <label style={{ color: 'red' }}>{this.state.error}</label>
                <span id="reauth-email" className="reauth-email"></span>
                <TextField
                    label={strings.newPassword}
                    className={classes.textFieldRegister}
                    inputProps={{
                        maxLength: 15,
                        minLength: 6,
                    }}
                    InputProps={{
                        'aria-label': 'Description',
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    aria-label="toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                    onMouseDown={this.handleMouseDownPassword}
                                >
                                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                    name="password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    onChange={this.handleInputChange}
                    value={this.state.password}
                />
                <div className={classes.clear}></div>
                <TextField
                    label={strings.confirmPassword}
                    className={classes.textFieldRegister}
                    inputProps={{
                        maxLength: 15,
                        minLength: 6,
                    }}
                    InputProps={{
                        'aria-label': 'Description',
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    edge="end"
                                    aria-label="toggle password visibility"
                                    onClick={this.handleClickShowConfirmPassword}
                                    onMouseDown={this.handleMouseDownConfirmPassword}
                                >
                                    {this.state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    name="confirmPassword"
                    type={this.state.showConfirmPassword ? 'text' : 'password'}
                    variant="outlined"
                    onChange={this.handleInputChange}
                    value={this.state.confirmPassword}
                />
                <Button onClick={this.onChengePasswordClick} className={classes.gradientButton} type="submit">{strings.save}</Button>
            </form>
        );
    }
}

LoginForm.propTypes = {
    classes: PropTypes.object.isRequired,
    useCaptcha: PropTypes.bool
};
function mapStateToProps(state) {
    return {
        language: state.language
    };
}
const mapDispatchToProps = dispatch => {
    return {
        onChangePassword: (idUser, newPassword) => { dispatch(changePassword({ idUser, newPassword })); },
        onChangeLanguage: language => { dispatch(setLanguage(language)); },
    };
};

Login = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
LoginContent = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginContent));
RegisterContent = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegisterContent));
AccessRecovery = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AccessRecovery));
ConfirmationCode = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ConfirmationCode));
ConfirmationCodeForRegister = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ConfirmationCodeForRegister));
ChengePassword = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ChengePassword));

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);

