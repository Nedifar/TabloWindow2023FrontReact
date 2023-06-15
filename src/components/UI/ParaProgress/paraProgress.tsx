import { useEffect } from 'react';
import ContainerElementsWithShadow from '../ContainerElementsWithShadow/containerElementsWithShadow';
import './paraprogress.scss'

export default function ParaProgress({toEndParaTime, progressParaWidth}:ParaProgressProps) {
    useEffect(() => {
        document.querySelector<HTMLElement>('.toEndTimeDiv > .statusBar')!
        .setAttribute('style', 'width:' + progressParaWidth + '%');
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
                    {toEndParaTime}
                </div>
            )} />
        </div>
    );
}

type ParaProgressProps = {
    toEndParaTime: string,
    progressParaWidth: number
}