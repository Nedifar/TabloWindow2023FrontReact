import axios from "axios";
import React, { useRef, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";
import ContainerElementsWithShadow from "../components/UI/ContainerElementsWithShadow/containerElementsWithShadow";
import { Para, Update } from "./customTypes";

const url = process.env.REACT_APP_API_LOCAL || window.location.origin + '/infotabloserver';

export default function getGreeting(method: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (arg0: any): void; }) {
    let promise : Promise<any> = axios.get(url + '/TabloApi/DayPartHeader');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getUpdate(method: { (value: React.SetStateAction<Update>): void; (value: React.SetStateAction<Update>): void; (value: React.SetStateAction<Update>): void; (arg0: any): void; }) {
    let promise : Promise<any> = axios.get(url + '/TabloApi/update');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getWeather(method: { (value: React.SetStateAction<string>): void; (arg0: any): void; }) {
    let promise : Promise<any> = axios.get(url + '/TabloApi/weather');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getWeekName(method: { (value: React.SetStateAction<string>): void; (arg0: any): void; }) {
    let promise : Promise<any> = axios.get(url + '/TabloApi/weekName');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getAdmin(method: { (value: React.SetStateAction<string>): void; (arg0: any): void; }) {
    let promise : Promise<any> = axios.get(url + '/TabloApi/admins');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getAnnouncments(method: { (value: React.SetStateAction<{ dateAdded: string; header: string; name: string; }[]>): void; (arg0: any): void; }) {
    let promise : Promise<any> = axios.get(url + '/TabloApi/announc');
    promise.then((response) => {
        method(response.data);
    }).catch((error) => {
        console.log(error);
    })
}

export function getParasTableDate(location : Location, update : Update, prevDayWeeks : any[], method: { (value: React.SetStateAction<JSX.Element>): void; (arg0: any): void; }) {
    if (update.grLineHeight !== undefined) {
        let floor : string = new URLSearchParams(location.search).get('floor')!;
        let corp : string = new URLSearchParams(location.search).get('corp')!;
        let promise : Promise<any> = axios.post(url + '/api/lastdance/getFloorShedule', {
            floor: floor + corp,
            paraNow: update.paraNow,
            'CHKR': update.lv
        });
        promise.then((response) => {
            if (prevDayWeeks !== response.data) {
                method(getCabinetsInforamtions(response.data, update));
            }
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }
}

function getCabinetsInforamtions(list : any[], update: Update) {
    if (list !== undefined)
        return list.map((item) => {
            return <CabinetInforamtion key={item.cabinet} update={update} item={item} />
        })
    else {
        return [];
    }
};

function getLessonsInforamtions(list: any[], update : Update, setStatus: (arg0: any) => void ) {
    if (list !== undefined) {
        setStatus(list.find(p => p.number === update.paraNow)
            ?.pp);
            if (update.lv?.find(p => p.typeInterval.name === "ЧКР") !== undefined)
            {
                let item : {Day: string, number: string|undefined, pp:string|undefined, decipline:string|undefined} = { Day : "ЧКР", pp : undefined, decipline : undefined, number:undefined };
                var usl : Para[] = update.lv.filter(p => p.typeInterval.name === "ЧКР" || p.typeInterval.name === "Пара");
                for (let i = 0; i < usl.length; i++)
                {
                    if (usl[i].typeInterval.name === "ЧКР")
                    {
                        if (i === 0)
                        {
                            item.pp = "Сейчас идёт ЧКР";
                            item.decipline = 'ЧКР'
                            item.number = ' '
                        }
                        else
                        {
                            item.pp = list[i - 1].pp;
                            list[i - 1].pp = "Сейчас будет ЧКР\n" + list[i - 1].pp;
                        }
                        list.splice(i, 0, item);
                        break;
                    }
                }
            }
        let ss : JSX.Element[] = list.map((item) => {
            return <LessonInformation key={item.number} item={item} />
        })
        return ss;
    }
    else {
        return [];
    }
};

export function getParasCabinetForm(location:any, update:Update, prevDayWeeks:any[], method:React.Dispatch<React.SetStateAction<JSX.Element[]>>, setStatus: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (arg0: any): void; }) {
    if (update.grLineHeight !== undefined) {
        let cabinet : string = new URLSearchParams(location.search).get('cabinet')!;
        let promise : Promise<any> = axios.get(url + '/api/lastdance/GetCabinentsWithDetail?cabinet=' + cabinet);
        promise.then((response) => {
            if (prevDayWeeks !== response.data) {
                method(getLessonsInforamtions(response.data, update, setStatus));
            }
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }
}

function CabinetInforamtion({item, update}:{
    item:any,
    update:Update,
    [propName: string] : any
}) {
    return (
        <ContainerElementsWithShadow className='floorTableRow' render={() => (
            <React.Fragment>
                <RowColumnData data={item.cabinet} iTarget='cabinet' className='cabinetColumn flexContainerCenterText futuraMediumC cabinetRowColumn' />
                <div className='flexContainerCenterText parentStripeInRow'>
                    <div className='stripeInRow' />
                </div>
                <div className="infContainer">
                    <div className="mainInfCaninet">
                        <div>
                            <RowColumnData data={item.group === "" ? "-" : item.group} iTarget='group' className='groupColumn flexContainerCenterText futuraMediumC groupRowColumn' />
                            <div className='flexContainerCenterText parentStripeInRow'>
                                <div className='stripeInRow' />
                            </div>
                            <div className='deciplineColumn flexContainerCenterText futuraBookC deciplineRowColumn'
                                dangerouslySetInnerHTML={{ __html: item.decipline?.trim() === "" ? "-" : item.decipline?.trim() }}>
                            </div>
                            <div className='flexContainerCenterText parentStripeInRow'>
                                <div className='stripeInRow' />
                            </div>
                            <RowColumnData data={item.teacherMobile?.trim()} iTarget='teacher' className='teacherColumn flexContainerCenterText futuraBookC teacherRowColumn' />
                        </div>
                    </div>
                    <div className="statusInfCaninet futuraMediumC">{item.pp??update.tbNumberPara}</div>
                </div>
            </React.Fragment>
        )} />
    );
};

function LessonInformation({item}:{item:any}) {
    return (
        <ContainerElementsWithShadow className='floorTableRow' render={() => (
            <React.Fragment>
                <div className="flexContainerCenterText futuraMediumC numberCell">
                    {item.number === "" ? "-" : item.number}
                </div>
                <div className='flexContainerCenterText parentStripeInRow'>
                    <div className='stripeInRow' />
                </div>
                <div className="flexContainerCenterText groupCell futuraMediumC">
                    {item.group === "" ? "-" : item.group}
                </div>
                <div className='flexContainerCenterText parentStripeInRow'>
                    <div className='stripeInRow' />
                </div>
                <div className="flexContainerCenterText deciplineCell futuraMediumC"
                    dangerouslySetInnerHTML={{
                        __html: item.decipline?.trim() === "" ? "-" : item.decipline?.trim()
                    }}>
                </div>
                <div className='flexContainerCenterText parentStripeInRow'>
                    <div className='stripeInRow' />
                </div>
                <div className="flexContainerCenterText teacherCell futuraMediumC">
                    {item.teacherMobile?.trim()}
                </div>
            </React.Fragment>
        )} />
    );
}

function RowColumnData({data, iTarget, className}: {data:string, iTarget: string, className:string}) {

    const [target, setTarget] = useState<HTMLElement|null>();
    const ref = useRef(null);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState('');

    const handleClick = (event : React.MouseEvent<HTMLElement>):void => {
        if (data !== '-') {
            switch (iTarget) {
                case 'cabinet':
                    getCabinet(data, setContent);
                    break;
                case 'teacher':
                    getTeacher(data, setContent);
                    break;
                case 'group':
                    getGroup(data, setContent);
                    break;
                default:
                    throw new Error('');
            }
            setTarget(event.target as HTMLElement);
            setTimeout(() => {
                setShow(!show);
            }, 100);
        }
    };

    return (
        <div ref={ref} className={className}>
            <div onClick={handleClick} >{data}</div>

            <Overlay
                show={show}
                rootClose={true}
                onHide={() => setShow(false)}
                target={target!}
                placement='auto'
                containerPadding={20}
            >
                <Popover id="popover-contained">
                    <Popover.Header as="h3"> {data}</Popover.Header>
                    <Popover.Body dangerouslySetInnerHTML={{ __html: content }}>

                    </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}

function getCabinet(cabinet: string, method: { (value: React.SetStateAction<string>): void; (arg0: string): void; }) {
    let promise = axios.get(url + `/api/LastDance/getcabinetMobile?cabinet=${cabinet}&date=${new Date().getMonth() + 1}.${new Date().getDate()}.${new Date().getFullYear()}`);
    promise.then((response) => {
        let resultTest = '';
        response.data[new Date().getDay() - 1].dayWeekClasses.forEach((item: { number: string | null; decipline: string; teacherMobile: string; group: string; }) => { //добавь метод на сервер когда сможешь
            let dot = ". ";
            if (item.number === null || item.number === "null") {
                item.number = "";
                dot = "";
            }
            resultTest += item.number + dot + item.decipline + "<br>" + item.teacherMobile + " " + item.group + "<br>";
            method(resultTest);
        });
    }).catch((error) => console.log(error));
}

function getGroup(group: string, method: { (value: React.SetStateAction<string>): void; (arg0: string): void; }) {
    let promise = axios.get(url + `/api/LastDance/getgroupMobile?group=${group}&date=${new Date().getMonth() + 1}.${new Date().getDate()}.${new Date().getFullYear()}`);
    promise.then((response) => {
        let resultTest = '';
        response.data[new Date().getDay() - 1].dayWeekClasses.forEach((item: { number: string | null; decipline: string; teacherMobile: string; cabinet: any; }) => { //добавь метод на сервер когда сможешь
            let dot = ". ";
            if (item.number === null || item.number === "null") {
                item.number = "";
                dot = "";
            }
            resultTest += item.number + dot + item.decipline + "<br>" + item.teacherMobile + " " + (item.cabinet || "") + "<br>";
            method(resultTest);
        });
    }).catch((error) => console.log(error));
}

function getTeacher(teacher: string, method: { (value: React.SetStateAction<string>): void; (arg0: string): void; }) {
    let promise = axios.get(url + `/api/LastDance/getteacherMobile?teacher=${teacher}&date=${new Date().getMonth() + 1}.${new Date().getDate()}.${new Date().getFullYear()}`);
    promise.then((response) => {
        let resultTest = '';
        response.data[new Date().getDay() - 1].dayWeekClasses.forEach((item: { number: string | null; decipline: string; group: string; cabinet: any; }) => { //добавь метод на сервер когда сможешь
            let dot = ". ";
            if (item.number === null || item.number === "null") {
                item.number = "";
                dot = "";
            }
            resultTest += item.number + dot + item.decipline + "<br>" + item.group + " " + (item.cabinet || "") + "<br>";
            method(resultTest);
        });
    }).catch((error) => console.log(error));
}

export function getBackgroundImage(method: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (arg0: string): void; }) {
    let promise = axios.get(url + `/tabloapi/getBackgroundMediaStable`);
    promise.then((response) => {
        method(url + "/" + response.data);
    }).catch((error) => {
        console.log(error);
    })
}