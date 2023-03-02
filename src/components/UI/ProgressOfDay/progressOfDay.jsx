import ContainerElementsWithShadow from '../ContainerElementsWithShadow/containerElementsWithShadow';
import './progressofday.css'

export default function ProgressOfDay(props) {

    const tdTableHeader = (list) => {
        if (list != null)
            return list.map((item) => {
                return (
                    <td style={{
                        fontSize: item.fontSize,
                        width: 100 / props.update.grLineHeight * item.totalTime + '%'
                    }}>
                        {item.outGraphicNewTablo}
                    </td>);
            })
    };

    const tdStripes = (list) => {
        if (list != null)
            return list.map((item) => {
                return (
                    <td className='stripeContainer'>
                        {item.typeInterval.name === 'Перемена' &&
                            <div className='pauseStripe'>

                            </div>
                        }
                        {item.typeInterval.name !== 'Перемена' &&
                            <div className='otherStripe'>
                                <div className='pauseStripe'>

                                </div>
                            </div>
                        }

                    </td>
                );
            })
    };

    const tdTimings = (list) => {
        if (list != null)
            return list.map((item) => {
                return (
                    <td style={{
                        textAlignItems: 'center',
                        width: 100 / props.update.grLineHeight * item.totalTime + '%'
                    }}>
                        {item.typeInterval.name === 'Перемена' &&
                            <div style={{
                                width: '3px',
                                display: 'flex',
                                justifyContent: 'center',
                                marginLeft: '50%'
                            }}>
                                <span>
                                    {item.totalTime}мин
                                </span>
                            </div>
                        }
                        {item.typeInterval.name !== 'Перемена' &&
                            <div>
                                {item.beginEnd}
                            </div>
                        }

                    </td>

                );
            })
    }

    return (
        <ContainerElementsWithShadow className='tableDayProgressParent futuraDemiC' render={() => (
            <table >
                <tr>
                    {tdTableHeader(props.update.lv)}
                </tr>
                <tr className='smallTr'></tr>
                <tr className='stripes'>
                    {tdStripes(props.update.lv)}
                </tr>
                <tr className='smallTr'></tr>
                <tr className='scale'>
                    <td colSpan='20'>
                        <div className='allLine'>
                            <div className='ulLineDivLine' style={{
                                width: 100 / props.update.grLineHeight * props.update.colorLineHeight + '%'
                            }}></div>
                        </div>
                    </td>
                </tr>
                <tr id="smallTr"></tr>
                <tr>
                    {tdTimings(props.update.lv)}
                </tr>
            </table>
        )} />
    );
}