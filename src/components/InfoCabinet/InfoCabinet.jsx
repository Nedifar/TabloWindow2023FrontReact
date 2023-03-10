import './infocabinet.css'
import logo from '../../images/OKEI 1.png'
import ContainerElementsWithShadow from '../UI/ContainerElementsWithShadow/containerElementsWithShadow';
import { useState } from 'react';
import { useEffect } from 'react';
import getGreeting, { getBackgroundImage, getParasCabinetForm, getUpdate } from '../../lib/requestsApi';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useLayoutEffect } from 'react';
import DateToDay from '../UI/DateToDay/DateToDay';
import StatusPara from '../UI/StatusPara/statusPara';
import Weather from '../UI/Weather/weather';
import { useLocation } from 'react-router-dom';
import { Fragment } from 'react';

const address = (process.env.REACT_APP_API_LOCAL || (window.location.origin + '/infotabloserver'))

export default function InfoCabinet(props) {
    const [connection, setConnection] = useState(null);
    const [greeting, setGreeting] = useState("");
    const [update, setUpdate] = useState({
        timeNow: ""
    });
    const location = useLocation();
    const [dayWeeks, setDayWeeks] = useState([]);
    const [lessonsInDay, setLessonsInDay] = useState(<div></div>);
    const [backgroundMedia, setbackgroundMedia] = useState("");
    const [status, setStatus] = useState('');

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

    useLayoutEffect(() => {
        getParasCabinetForm(location, update, dayWeeks, setDayWeeks, setStatus);
    }, [])

    useEffect(() => {
        let count = 9;
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');
                    connection.on('SendDatPart', (message) => {
                        setGreeting(message);
                    })
                    connection.on("SendRequest", (update) => {
                        count += 1;
                        if (count == 10) {
                            getParasCabinetForm(location, update, dayWeeks, setLessonsInDay, setStatus);
                            count = 0;
                        }
                        setUpdate(update);
                        console.log(count);
                    })
                    connection.on("SendBackImage", (src) => {
                        setbackgroundMedia(address + '/' + src);
                    })
                })
                .catch(e => console.log('Coonection failed:', e));
        }
    }, [connection]);


    return (
        <div className='infoCabinet'>
            <video className='backgroundVideo' poster={backgroundMedia} src={backgroundMedia} autoPlay loop muted />
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
            </div>
            <div className='dateParaWeatherContainer'>
                <div>
                    <DateToDay connectionHub={connection} />
                    <StatusPara className='parentWeekNamingExtension' status={update.tbNumberPara} connectionHub={connection} />
                </div>
                <Weather className='parentWeatherExtension' connectionHub={connection} />
            </div>
            <div className='lessonsContainer'>
                <ContainerElementsWithShadow className='futuraBookC groupRowColumn' render={() => (
                    <Fragment>
                            {new URLSearchParams(location.search).get('cabinet')}
                            <div className='flexContainerCenterText' style={{ width: '1%' }}>
                                <div className='stripeInRow' />
                            </div>
                            {status}

                    </Fragment>
                )} />
                {lessonsInDay}
            </div>
        </div>
    );
}