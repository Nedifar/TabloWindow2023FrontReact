import './tablomain.css'
import logo from '../../images/OKEI 1.png'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import DateToDay from '../UI/DateToDay/DateToDay';
import ContainerElementsWithShadow from '../UI/ContainerElementsWithShadow/containerElementsWithShadow';
import getGreeting, { getBackgroundImage, getUpdate } from '../../lib/requestsApi';
import Weather from '../UI/Weather/weather';
import WeekNaming from '../UI/WeekNaming/weekNaming';
import DutyAdministrator from '../UI/DutyAdministrator/dutyAdministrator';
import Announcments from '../UI/Announcments/announcments';
import StatusPara from '../UI/StatusPara/statusPara';
import ParaProgress from '../UI/ParaProgress/paraProgress';
import ProgressOfDay from '../UI/ProgressOfDay/progressOfDay';

const address = (process.env.REACT_APP_API_LOCAL || (window.location.origin + '/infotabloserver'))

function TabloMain() {
    const [connection, setConnection] = useState(null);
    const [greeting, setGreeting] = useState("");
    const [update, setUpdate] = useState({
        timeNow: ""
    });
    const [backgroundMedia, setbackgroundMedia] = useState("");

    useEffect(() => {
        getBackgroundImage(setbackgroundMedia);
    }, [])

    useEffect(() => {

        const newConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl(address.includes('https') ? 'https://infotab.oksei.ru/infotabloserver/GoodHubGbl' : address + '/GoodHubGbl', {
                transport: HttpTransportType.LongPolling,
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useLayoutEffect(() => {
        getGreeting(setGreeting);
    }, [])

    useLayoutEffect(() => {
        getUpdate(setUpdate);
    }, [])

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
                    connection.on('SendDatPart', (message) => {
                        setGreeting(message);
                    })
                    connection.on("SendRequest", (update) => {
                        setUpdate(update);
                    })
                    connection.on("SendBackImage", (src) => {
                        setbackgroundMedia(src);
                    })
                })
                .catch(e => console.log('Coonection failed:', e));
        }
    }, [connection]);

    return (
        <div className='tabloMain'>
            <video className='backgroundVideo' poster={backgroundMedia} src={backgroundMedia} autoPlay loop muted />
            {/* <Background /> */}
            <div className='upGridContainer'>
                <div>
                    <img src={logo} className='logo' />
                    <div className='greetings futuraDemiC'>
                        {greeting}
                    </div>
                </div>
                <div>
                    <div>
                        <ContainerElementsWithShadow className="clockStyle futuraDemiC" render={() => (
                            update.timeNow[0]
                        )} />
                        <ContainerElementsWithShadow className="clockStyle futuraDemiC" render={() => (
                            update.timeNow[1]
                        )} />
                        <div className='timerCirclesContainer'>
                            <ContainerElementsWithShadow className="clockStyle" render={() => { }} />
                            <ContainerElementsWithShadow className="clockStyle" render={() => { }} />
                        </div>
                        <ContainerElementsWithShadow className="clockStyle futuraDemiC" render={() => (
                            update.timeNow[3]
                        )} />
                        <ContainerElementsWithShadow className="clockStyle futuraDemiC" render={() => (
                            update.timeNow[4]
                        )} />
                    </div>
                </div>
                <DateToDay connectionHub={connection} />
                <Weather connectionHub={connection} />
            </div>
            <div className='weekAndDutyAdminContainer'>
                <WeekNaming connectionHub={connection} />
                <DutyAdministrator connectionHub={connection} />
            </div>
            <Announcments connectionHub={connection} />
            <div className='paraInformation'>
                <StatusPara status={update.tbNumberPara} />
                <ParaProgress progressParaWidth={update.progressBarPara} toEndParaTime={update.toEndPara} />
            </div>
            <div className='dayProgressContainer'>
                <ProgressOfDay update={update} />
            </div>
        </div>
    );
}

export default TabloMain;