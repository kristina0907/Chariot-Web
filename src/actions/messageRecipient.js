import { hubUrl } from './url';
import { authenticationService } from '../services';
const signalR = require("@aspnet/signalr");

export default class MessageRecipient {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => {
                    const token = authenticationService &&
                        authenticationService.currentUserValue &&
                        authenticationService.currentUserValue.token ?
                        authenticationService.currentUserValue.token :
                        null;
                    return token;
                }
            })
            .build();
        this.connection.on("onMessageReceived", this.onMessageReceived);
        // this.connection.on('OnTest', this.onTest);
        this.connection.onclose(e => {
            if (this.connection) {
                console.log('SignalR onclose Reconnecting');
                this.connect();
            }
        });

        console.log('SignalR connect');
        this.connect();
    }

    // onTest = message => alert(message);

    onMessageReceived = (message, idUsers) => {
        if (authenticationService != null) {
            if (idUsers != "" && idUsers != null) {
                var usersArray = idUsers.split(",");
                var a = authenticationService.currentUserValue.id.toString();
                if (usersArray.indexOf(a) != -1)
                    alert(message);
                else
                    console.log('Received message for wrong users: ' + idUsers +
                        ' expected user: ' + a);
            }
        }
    };

    connect = async () => {
        this.connection.start().catch(err => {
            this.sleep(5000).then(() => {
                console.log("Reconnecting Socket");
                this.connect()
                //console.log(err)
            })
        });
    }

    sleep = async msec => {
        return new Promise(resolve => setTimeout(resolve, msec));
    }

    // test = message => {
    //     if (this.connection) {
    //         this.connection.invoke('Test', message);
    //     } else {
    //         console.log("SignalR test fail: no active connection");
    //     }
    // }

    close = () => {
        console.log('SignalR disconnect')
        if (this.connection) {
            this.connection.off("onMessageReceived", this.onMessageReceived);
            // this.connection.off('OnTest', this.onTest);
            this.connection.stop();
            this.connection = null;
        } else {
            console.log('SignalR connection stop failed: no connection');
        }
    };
}
