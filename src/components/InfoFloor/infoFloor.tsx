import './infofloor.scss'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Weather from '../UI/Weather/weather';
import DateToDay from '../UI/DateToDay/DateToDay';
import ContainerElementsWithShadow from '../UI/ContainerElementsWithShadow/containerElementsWithShadow';
import logo from '../../images/OKEI 1.png'
import getGreeting, { getBackgroundImage, getParasTableDate, getUpdate } from '../../lib/requestsApi';
import StatusPara from '../UI/StatusPara/statusPara';
import { useLocation } from 'react-router-dom';
import '../../styles/bootstrap.min.css';
import BluePoster from '../../images/Blue Version.png';
import { Update } from '../../lib/customTypes';

const address = (process.env.REACT_APP_API_LOCAL || (window.location.origin + '/infotabloserver'))
const getParasTableDateLocal = getParasTableDate;

export default function InfoFloor() {
    const [connection, setConnection] = useState<HubConnection|null>(null);
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
    const [dayWeeks, setDayWeeks] = useState<Array<JSX.Element>>([]);
    const location = useLocation();
    const [cabinet, setCabinets] = useState<JSX.Element>(<div></div>);
    const [backgroundMedia, setbackgroundMedia] = useState<string>("");

    useEffect(() => {
        getBackgroundImage(setbackgroundMedia);
    }, [])

    useEffect(() => {

        const newConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl(address.includes('https') ? 'https://infotab.oksei.ru/infotabloserver/GoodHubGbl' : address + '/GoodHubGbl', {
                transport: HttpTransportType.LongPolling
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useLayoutEffect(() => {
        getGreeting(setGreeting);
    }, [])

    function onLoadHeightSettings() {
        try {
            let container : NodeListOf<HTMLElement> = document.querySelectorAll('.infContainer');
            container.forEach(elem => {
                elem.style.height = elem.children[0]?.clientHeight + 'px';
                elem.children[1].setAttribute('style', `height = ${elem.children[0]?.clientHeight} + 'px'`);
                (elem.children[1] as HTMLElement).style.transform = `rotateX(-90deg) translateZ(-${elem.children[0].clientHeight / 2}px)`;
                (elem.children[0] as HTMLElement).style.transform = `translateZ(${elem.children[0].clientHeight / 2}px)`;
            });
        } catch { }
    }

    useEffect(() => {
        setInterval(() => {
            try {
                let container = document.querySelectorAll('.infContainer');
                let timing = 0;
                container.forEach(elem => {
                    setTimeout(()=>{
                        elem.classList.add('classHoverCabinetInfo')
                    }, timing+=80)
                    
                    setTimeout(() => {
                        elem.classList.remove('classHoverCabinetInfo');
                    }, 5000-timing);
                });

            } catch { }
        }, 10000);

        window.onresize = () => {
            onLoadHeightSettings();
        };
    }, []);

    useEffect(() => {
        setTimeout(() => onLoadHeightSettings(), 100);
    }, [cabinet])

    useLayoutEffect(() => {
        getUpdate(setUpdate);
    }, [])

    useLayoutEffect(() => {
        getParasTableDateLocal(location, update, setDayWeeks);
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
                            getParasTableDate(location, update, dayWeeks, setCabinets);
                            
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
        <div className='infoFloor'>
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
                    <DateToDay/>
                    <StatusPara className='parentWeekNamingExtension' status={update.tbNumberPara} />
                </div>
                <Weather className='parentWeatherExtension' connectionHub={connection} />
            </div>
            <div className='tableSheduleOfFlloor'>
                <ContainerElementsWithShadow className='futuraBookC' render={() => (
                    <React.Fragment>
                        <div className='cabinetColumn flexContainerCenterText'>
                            Кабинет
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
                    </React.Fragment>
                )} />
                {cabinet}
            </div>
        </div>
    );
}