import React, { useEffect, useLayoutEffect, useState } from "react";
import { getWeather } from "../../../lib/requestsApi";
import ContainerElementsWithShadow from "../ContainerElementsWithShadow/containerElementsWithShadow";
import weatherImage from "../../../images/ri_temp-cold-line.png"
import './weather.css'

export default function Weather(props) {

    const [weather, setWeather] = useState('');
    const classList = props.className==undefined?'':props.className;
    useLayoutEffect(() => {
        getWeather(setWeather);
    }, []);

    useEffect(() => {
        if (props.connectionHub != null)
            props.connectionHub.on('SendWeather', (updateWeather) => {
                setWeather(updateWeather);
            })
    }, [props.connectionHub]);

    return (
        <div className={"weatherParent"+ ' ' + classList}>
            <ContainerElementsWithShadow className="weather" render={() => (
                <div className="futuraBookC">
                    <img src={weatherImage} />
                    {weather}
                </div>

            )} />
        </div>
    );
}