import ContainerElementsWithShadow from '../ContainerElementsWithShadow/containerElementsWithShadow';
import './statuspara.scss'

export default function StatusPara({ className, status }: StatusParaProps) {
    const classList = className === undefined ? '' : className;

    return (
        <div className={'statusPara futuraBookC defaultHeaderFontSize ' + classList}>
            Сейчас идет:
            <ContainerElementsWithShadow className='futuraDemiC' render={() => (
                status
            )}>
            </ContainerElementsWithShadow>
        </div>
    );
}

type StatusParaProps = {
    className?: string | undefined,
    status: string
}