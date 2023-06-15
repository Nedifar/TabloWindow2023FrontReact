import "./datetoday.scss"
import ContainerElementsWithShadow from "../ContainerElementsWithShadow/containerElementsWithShadow";

function DateToDay() : JSX.Element {

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