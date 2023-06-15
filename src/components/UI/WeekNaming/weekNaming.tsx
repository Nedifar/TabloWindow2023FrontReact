import { useEffect, useLayoutEffect, useState } from "react";
import { getWeekName } from "../../../lib/requestsApi";
import ContainerElementsWithShadow from "../ContainerElementsWithShadow/containerElementsWithShadow";
import "./weeknaming.scss"
import { HubConnection } from "@microsoft/signalr";

function WeekNaming({ className, connectionHub }: WeekNamingProps): JSX.Element {
    const [weekName, setWeekName] = useState("");
    const classList = className === undefined ? '' : className;

    useLayoutEffect(() => {
        getWeekName(setWeekName);
    }, []);

    useEffect(() => {
        if (connectionHub != null)
            connectionHub.on('SendWeekName', (updateWeek) => {
                setWeekName(updateWeek);
            })
    }, [connectionHub]);

    return (
        <div className={`parentWeekNaming ${classList}`}>
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

type WeekNamingProps = {
    className?: string | undefined,
    connectionHub: HubConnection | null,
}

export default WeekNaming;