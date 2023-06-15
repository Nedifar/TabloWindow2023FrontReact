import './infocabinet.scss'
import logo from '../../images/OKEI 1.png'
import ContainerElementsWithShadow from '../UI/ContainerElementsWithShadow/containerElementsWithShadow';
import { useState } from 'react';
import { useEffect } from 'react';
import getGreeting, { getBackgroundImage, getParasCabinetForm, getUpdate } from '../../lib/requestsApi';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useLayoutEffect } from 'react';
import DateToDay from '../UI/DateToDay/DateToDay';
import StatusPara from '../UI/StatusPara/statusPara';
import Weather from '../UI/Weather/weather';
import {  useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import BluePoster from '../../images/Blue Version.png';
import { Update } from '../../lib/customTypes';

const address = (process.env.REACT_APP_API_LOCAL || (window.location.origin + '/infotabloserver'))

export default function InfoCabinet() {
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
    const location = useLocation();
    const [dayWeeks, setDayWeeks] = useState<Array<JSX.Element>>([]);
    const [lessonsInDay, setLessonsInDay] = useState<Array<JSX.Element>>([]);
    const [backgroundMedia, setbackgroundMedia] = useState<string>("");
    const [status, setStatus] = useState<string>('');

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        if (count === 10) {
                            getParasCabinetForm(location, update, dayWeeks, setLessonsInDay, setStatus);
                            count = 0;
                        }
                        setUpdate(update);
                        console.log(count);
                    })
                    connection.on("SendBackImageStable", (src) => {
                        setbackgroundMedia(address + '/' + src);
                    })
                })
                .catch(e => console.log('Coonection failed:', e));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connection]);


    return (
        <div className='infoCabinet'>
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
            </div>
            <div className='dateParaWeatherContainer'>
                <div>
                    <DateToDay />
                    <StatusPara className='parentWeekNamingExtension' status={update.tbNumberPara} />
                </div>
                <Weather className='parentWeatherExtension' connectionHub={connection} />
            </div>
            <div className='lessonsContainer'>
                <ContainerElementsWithShadow className='futuraBookC' render={() => (
                    <Fragment>
                        {new URLSearchParams(location.search).get('cabinet')}
                        <div className='flexContainerCenterText parentStripeInRow'>
                            <div className='stripeInRow' />
                        </div>
                        <div>
                            {status === '' ? update.tbNumberPara : status}
                        </div>
                    </Fragment>
                )} />
                <ContainerElementsWithShadow className='futuraBookC' render={() => (
                    <Fragment>
                        <div className='numberColumn flexContainerCenterText'>
                            №
                        </div>
                        <div className='flexContainerCenterText parentStripeInRow'>
                            <div className='stripeInRow' style={{ backgroundColor: 'transparent' }} />
                        </div>
                        <div className='groupColumn flexContainerCenterText'>
                            Группа
                        </div>
                        <div className='flexContainerCenterText parentStripeInRow'>
                            <div className='stripeInRow' style={{ backgroundColor: 'transparent' }} />
                        </div>
                        <div className='deciplineColumn flexContainerCenterText'>
                            Дисциплина
                        </div>
                        <div className='flexContainerCenterText parentStripeInRow'>
                            <div className='stripeInRow' style={{ backgroundColor: 'transparent' }} />
                        </div>
                        <div className='teacherColumn flexContainerCenterText'>
                            Преподаватель
                        </div>
                    </Fragment>
                )} />
                {lessonsInDay}
            </div>
        </div>
    );
}