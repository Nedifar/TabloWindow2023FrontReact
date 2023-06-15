import ContainerElementsWithShadow from '../ContainerElementsWithShadow/containerElementsWithShadow';
import './progressofday.scss'
import { Update, Para } from '../../../lib/customTypes';

export default function ProgressOfDay({ update }: ProgressOfDayProps) {

    const tdTableHeader = (list: Array<Para>): Array<JSX.Element> => {
        if (list)
            return list.map((item) => {
                return (
                    <td
                        key={item.toEndTimeInProcent}
                        style={{
                            fontSize: item.fontSize,
                            width: 100 / update.grLineHeight * item.totalTime + '%'
                        }}>
                        {item.outGraphicNewTablo}
                    </td>);
            })
        else {
            return [];
        }
    };

    const tdStripes = (list: Array<Para>): Array<JSX.Element> => {
        if (list)
            return list.map((item) => {
                return (
                    <td className='stripeContainer' key={item.toEndTimeInProcent}>
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
        else {
            return [];
        }
    };

    const tdTimings = (list: Array<Para>): Array<JSX.Element> => {
        if (list)
            return list.map((item) => {
                return (
                    <td key={item.toEndTimeInProcent}
                        style={{
                            textAlign: 'center',
                            width: 100 / update.grLineHeight * item.totalTime + '%'
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
        else {
            return [];
        }
    }

    return (
        <ContainerElementsWithShadow className='tableDayProgressParent futuraDemiC' render={() => (
            <table >
                <tbody>
                    <tr>
                        {tdTableHeader(update.lv!)}
                    </tr>
                    <tr className='smallTr'></tr>
                    <tr className='stripes'>
                        {tdStripes(update.lv!)}
                    </tr>
                    <tr className='smallTr'></tr>
                    <tr className='scale'>
                        <td colSpan={20}>
                            <div className='allLine'>
                                <div className='ulLineDivLine' style={{
                                    width: 100 / update.grLineHeight * update.colorLineHeight + '%'
                                }}></div>
                            </div>
                        </td>
                    </tr>
                    <tr id="smallTr"></tr>
                    <tr>
                        {tdTimings(update.lv!)}
                    </tr>
                </tbody>
            </table>
        )} />
    );
}

type ProgressOfDayProps = {
    update: Update
}