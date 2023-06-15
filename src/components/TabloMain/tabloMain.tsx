import './tablomain.scss'
import logo from '../../images/OKEI 1.png'
import BluePoster from '../../images/Blue Version.png'
import { useEffect, useLayoutEffect, useState } from 'react'
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
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
import { Update } from '../../lib/customTypes';

const address: string = (process.env.REACT_APP_API_LOCAL || (window.location.origin + '/infotabloserver'))

function TabloMain(): JSX.Element {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [greeting, setGreeting] = useState<string>("");
    const [update, setUpdate] = useState<Update>({
        timeNow: '',
        toEndPara: '',
        progressBarPara: 0,
        lv: null,
        grLineHeight: 0,
        colorLineHeight: 0,
        tbNumberPara: '',
        paraNow: ''
    });
    const [backgroundMedia, setbackgroundMedia] = useState<string>("");

    useEffect(() => {
        getBackgroundImage(setbackgroundMedia);
    }, [])

    useEffect(() => {

        const newConnection: HubConnection = new HubConnectionBuilder()
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
                .then(() => {
                    console.log('Connected!');
                    connection.on('SendDatPart', (message) => {
                        setGreeting(message);
                    })
                    connection.on("SendRequest", (update) => {
                        setUpdate(update);
                    })
                    connection.on("SendBackImageStable", (src) => {
                        setbackgroundMedia(address + '/' + src);
                    })
                })
                .catch(e => console.log('Coonection failed:', e));
        }
    }, [connection]);

    return (
        <div className='tabloMain'>
            <video className='backgroundVideo'
                poster={backgroundMedia.includes('.mp4')
                    ? BluePoster
                    : backgroundMedia}
                src={backgroundMedia}
                autoPlay
                loop
                muted />
            <div className='upGridContainer'>
                <div>
                    <img src={logo} alt='logo' className='logo' />
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
                <DateToDay />
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