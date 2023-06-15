import { useEffect, useLayoutEffect, useState } from "react";
import { getWeather } from "../../../lib/requestsApi";
import ContainerElementsWithShadow from "../ContainerElementsWithShadow/containerElementsWithShadow";
import weatherImage from "../../../images/ri_temp-cold-line.png"
import './weather.scss'
import { HubConnection } from "@microsoft/signalr";

export default function Weather({ className, connectionHub }: WeatherProps) {

    const [weather, setWeather] = useState('');
    const classList = className === undefined ? '' : className;

    useLayoutEffect(() => {
        getWeather(setWeather);
    }, []);

    useEffect(() => {
        if (connectionHub != null)
            connectionHub.on('SendWeather', (updateWeather) => {
                setWeather(updateWeather);
            })
    }, [connectionHub]);

    return (
        <div className={`weatherParent ${classList}`}>
            <ContainerElementsWithShadow className="weather" render={() => (
                <div className="futuraBookC">
                    <img alt="non" src={weatherImage} />
                    {weather}
                </div>
            )} />
        </div>
    );
}

type WeatherProps = {
    className?: string | undefined,
    connectionHub: HubConnection | null
}