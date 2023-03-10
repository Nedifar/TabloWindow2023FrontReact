import './infofloor.css'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Weather from '../UI/Weather/weather';
import DateToDay from '../UI/DateToDay/DateToDay';
import ContainerElementsWithShadow from '../UI/ContainerElementsWithShadow/containerElementsWithShadow';
import logo from '../../images/OKEI 1.png'
import getGreeting, { getBackgroundImage, getParasTableDate, getUpdate } from '../../lib/requestsApi';
import StatusPara from '../UI/StatusPara/statusPara';
import { useLocation } from 'react-router-dom';
import '../../styles/bootstrap.min.css';

const address = (process.env.REACT_APP_API_LOCAL || (window.location.origin + '/infotabloserver'))

export default function InfoFloor() {
    const [connection, setConnection] = useState(null);
    const [greeting, setGreeting] = useState("");
    const [update, setUpdate] = useState({
        timeNow: ""
    });
    const [dayWeeks, setDayWeeks] = useState([]);
    const location = useLocation();
    const [cabinet, setCabinets] = useState(<div></div>);
    const [backgroundMedia, setbackgroundMedia] = useState("");

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

    useLayoutEffect(() => {
        getUpdate(setUpdate);
    }, [])

    useLayoutEffect(() => {
        getParasTableDate(location, update, setDayWeeks);
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
                            getParasTableDate(location, update, dayWeeks, setCabinets);
                            count = 0;
                        }
                        setUpdate(update);
                        console.log(count);
                    })
                    connection.on("SendBackImage", (src) => {
                        setbackgroundMedia(address+'/'+src);
                    })
                })
                .catch(e => console.log('Coonection failed:', e));
        }
    }, [connection]);

    return (
        <div className='infoFloor'>
            <video className='backgroundVideo' src={backgroundMedia} poster={backgroundMedia} autoPlay loop muted />
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
            <div className='tableSheduleOfFlloor'>
                <ContainerElementsWithShadow className='futuraBookC' render={() => (
                    <React.Fragment>
                        <div className='cabinetColumn flexContainerCenterText'>
                            Кабинет
                        </div>
                        <div className='flexContainerCenterText' style={{ width: '1%' }}>
                            <div className='stripeInRow' style={{ backgroundColor: 'transparent' }} />
                        </div>
                        <div className='groupColumn flexContainerCenterText'>
                            Группа
                        </div>
                        <div className='flexContainerCenterText' style={{ width: '1%' }}>
                            <div className='stripeInRow' style={{ backgroundColor: 'transparent' }} />
                        </div>
                        <div className='deciplineColumn flexContainerCenterText'>
                            Дисциплина
                        </div>
                        <div className='flexContainerCenterText' style={{ width: '1%' }}>
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

// function popoverOpenClick(target, item, method) {
//     getCabinet(item, method);
// };

// function RowCabinetColumn(props) {

//     return (
//         <OverlayTrigger trigger='click' placement='right' overlay={props.cabinets}>
//             <button onClick={popoverOpenClick('cabinet', props.item.cabinet, props.method)} >
//                 {props.cabinet}
//             </button>
//         </OverlayTrigger>);
// }

// const Memor = React.memo(RowCabinetColumn, (prevProps, nextProps)=>{
//     return true;
// })