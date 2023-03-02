import { useEffect, useLayoutEffect, useState } from "react";
import { getWeekName } from "../../../lib/requestsApi";
import ContainerElementsWithShadow from "../ContainerElementsWithShadow/containerElementsWithShadow";
import "./weeknaming.css"

function WeekNaming(props) {
    const [weekName, setWeekName] = useState("");
    const classList = props.className==undefined?'':props.className;

    useLayoutEffect(() => {
        getWeekName(setWeekName);
    }, []);

    useEffect(() => {
        if (props.connectionHub != null)
            props.connectionHub.on('SendWeekName', (updateWeek) => {
                setWeekName(updateWeek);
            })
    }, [props.connectionHub]);

    return (
        <div className={"parentWeekNaming" + ' ' + classList}>
            <p className="defaultHeaderFontSize futuraBookC">
                Неделя:
            </p>
            <ContainerElementsWithShadow className="futuraDemiC weekNaming" render={() => (
                <span>{weekName}</span>
            )}>
            </ContainerElementsWithShadow>
        </div>
    );
}

export default WeekNaming;