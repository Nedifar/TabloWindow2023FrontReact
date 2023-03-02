import React, { useEffect, useState } from "react";
import "./datetoday.css"
import ContainerElementsWithShadow from "../ContainerElementsWithShadow/containerElementsWithShadow";

function DateToDay(props) {
    const [date, setDate] = useState("");

    //Здесь может возникунть ошибка из-за которой не будет сменяться время

    return (
        <div>
            <p className="defaultHeaderFontSize futuraBookC">Число:</p>
            <ContainerElementsWithShadow className="dateToDay futuraDemiC" render={() => (
                <span>{new Date().toLocaleString('ru', {
                    day: 'numeric',
                    month: 'long'
                })}</span>
            )}>
            </ContainerElementsWithShadow>
        </div>
    );
}

export default DateToDay