import axios from "axios";
import React, { useRef, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";
import ContainerElementsWithShadow from "../components/UI/ContainerElementsWithShadow/containerElementsWithShadow";

const url = process.env.REACT_APP_API_LOCAL || window.location.origin + '/infotabloserver';

export default function getGreeting(method) {
    let promise = axios.get(url + '/TabloApi/DayPartHeader');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getUpdate(method) {
    let promise = axios.get(url + '/TabloApi/update');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getWeather(method) {
    let promise = axios.get(url + '/TabloApi/weather');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getWeekName(method) {
    let promise = axios.get(url + '/TabloApi/weekName');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getAdmin(method) {
    let promise = axios.get(url + '/TabloApi/admins');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getAnnouncments(method) {
    let promise = axios.get(url + '/TabloApi/announc');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getParasTableDate(location, update, prevDayWeeks, method) {
    if (update.grLineHeight !== undefined) {
        let floor = new URLSearchParams(location.search).get('floor');
        let corp = new URLSearchParams(location.search).get('corp');
        let promise = axios.post(url + '/api/lastdance/getFloorShedule', {
            floor: floor + corp,
            count: update.lvTime.lenght,
            paraNow: update.paraNow,
            'CHKR': update.lv
        });
        promise.then((response) => {
            // method(response.data);
            if (prevDayWeeks !== response.data) {
                method(getCabinetsInforamtions(response.data));
            }
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }
}

function getCabinetsInforamtions(list) {
    if (list !== undefined)
        return list.map((item) => {
            return <CabinetInforamtion key={item.cabinet} item={item} />
        })
    else {
        return [];
    }
};

function CabinetInforamtion(props) {
    return (
        <ContainerElementsWithShadow className='floorTableRow' render={() => (
            <React.Fragment>
                <RowColumnData data={props.item.cabinet} target='cabinet' className='cabinetColumn flexContainerCenterText futuraMediumC cabinetRowColumn' />
                <div className='flexContainerCenterText' style={{ width: '1%' }}>
                    <div className='stripeInRow' />
                </div>
                <RowColumnData data={props.item.group == "" ? "-" : props.item.group} target='group' className='groupColumn flexContainerCenterText futuraMediumC groupRowColumn' />
                <div className='flexContainerCenterText' style={{ width: '1%' }}>
                    <div className='stripeInRow' />
                </div>
                <div className='deciplineColumn flexContainerCenterText futuraBookC deciplineRowColumn'
                    dangerouslySetInnerHTML={{ __html: props.item.decipline?.trim() == "" ? "-" : props.item.decipline?.trim() }}>
                </div>
                <div className='flexContainerCenterText' style={{ width: '1%' }}>
                    <div className='stripeInRow' />
                </div>
                <RowColumnData data={props.item.teacherMobile?.trim()} target='teacher' className='teacherColumn flexContainerCenterText futuraBookC teacherRowColumn' />
            </React.Fragment>
        )} />
    );
};

function RowColumnData(props) {

    const [target, setTarget] = useState(null);
    const ref = useRef(null);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('');

    const handleClick = (event) => {
        if (props.data !== '-') {
            switch (props.target) {
                case 'cabinet':
                    getCabinet(props.data, setContent);
                    break;
                case 'teacher':
                    getTeacher(props.data, setContent);
                    break;
                case 'group':
                    getGroup(props.data, setContent);
                    break;
                default:
                    throw "error";
            }
            setTarget(event.target);
            setTimeout(() => {
                setShow(!show);
            }, 100);
        }
    };

    return (
        <div ref={ref} className={props.className}>
            <div onClick={handleClick} >{props.data}</div>

            <Overlay
                show={show}
                rootClose={true}
                onHide={() => setShow(false)}
                target={target}
                placement='auto'
                containerPadding={20}
            >
                <Popover id="popover-contained">
                    <Popover.Header as="h3"> {props.data}</Popover.Header>
                    <Popover.Body dangerouslySetInnerHTML={{ __html: content }}>

                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}

function getCabinet(cabinet, method) {
    let promise = axios.get(url + `/api/LastDance/getcabinetMobile?cabinet=${cabinet}&date=${new Date().getMonth() + 1}.${new Date().getDate()}.${new Date().getFullYear()}`);
    promise.then((response) => {
        let resultTest = '';
        response.data[new Date().getDay() - 1].dayWeekClasses.forEach(item => { //добавь метод на сервер когда сможешь
            let dot = ". ";
            if (item.number === null || item.number === "null"){
                item.number = "";
                dot = "";
            }
            resultTest += item.number + dot + item.decipline + "<br>" + item.teacherMobile + " " + item.group + "<br>";
            method(resultTest);
        });
    }).catch((error) => console.log(error));
}

function getGroup(group, method) {
    let promise = axios.get(url + `/api/LastDance/getgroupMobile?group=${group}&date=${new Date().getMonth() + 1}.${new Date().getDate()}.${new Date().getFullYear()}`);
    promise.then((response) => {
        let resultTest = '';
        response.data[new Date().getDay() - 1].dayWeekClasses.forEach(item => { //добавь метод на сервер когда сможешь
            let dot = ". ";
            if (item.number === null || item.number === "null"){
                item.number = "";
                dot = "";
            }
            resultTest += item.number + dot + item.decipline + "<br>" + item.teacherMobile + " " + (item.cabinet || "") + "<br>";
            method(resultTest);
        });
    }).catch((error) => console.log(error));
}

function getTeacher(teacher, method) {
    let promise = axios.get(url + `/api/LastDance/getteacherMobile?teacher=${teacher}&date=${new Date().getMonth() + 1}.${new Date().getDate()}.${new Date().getFullYear()}`);
    promise.then((response) => {
        let resultTest = '';
        response.data[new Date().getDay() - 1].dayWeekClasses.forEach(item => { //добавь метод на сервер когда сможешь
            let dot = ". ";
            if (item.number === null || item.number === "null"){
                item.number = "";
                dot = "";
            }
            resultTest += item.number + dot + item.decipline + "<br>" + item.group + " " + (item.cabinet || "") + "<br>";
            method(resultTest);
        });
    }).catch((error) => console.log(error));
}

export function getBackgroundImage(method){
    let promise = axios.get("http://localhost:5029" + `/tabloapi/getBackgroundMedia`);
    promise.then((response)=>{
        method(url +"/" +response.data);
    }).catch((error)=>{
        console.log(error);
    })
}