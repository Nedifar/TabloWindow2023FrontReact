import ContainerElementsWithShadow from '../ContainerElementsWithShadow/containerElementsWithShadow';
import './statuspara.css'

export default function StatusPara(props) {
    const classList = props.className==undefined?'':props.className;

    return (
        <div className={'statusPara futuraBookC defaultHeaderFontSize ' + classList}>
            Сейчас идет:
            <ContainerElementsWithShadow className='futuraDemiC' render={() => (
                props.status
            )}>
            </ContainerElementsWithShadow>
        </div>
    );
}