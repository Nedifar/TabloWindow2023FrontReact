import React, { useEffect } from 'react';
import ContainerElementsWithShadow from '../ContainerElementsWithShadow/containerElementsWithShadow';
import './paraprogress.css'

export default function ParaProgress(props) {
    useEffect(() => {
        document.querySelector('.toEndTimeDiv > .statusBar').style = 'width:' + props.progressParaWidth + '%';
    });

    return (
        <div className='progressContainer futuraBookC defaultHeaderFontSize'>
            Осталось до конца:
            <ContainerElementsWithShadow render={() => (
                <div className='futuraDemiC'>
                    <div className="toEndTimeDiv">
                        <div className="statusBar">
                        </div>
                    </div>
                    {props.toEndParaTime}
                </div>
            )} />
        </div>
    );
}