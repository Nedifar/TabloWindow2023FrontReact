import { useEffect, useLayoutEffect, useState } from 'react';
import { getAdmin } from '../../../lib/requestsApi';
import ContainerElementsWithShadow from '../ContainerElementsWithShadow/containerElementsWithShadow';
import './dutyadministrator.css'

export default function DutyAdministrator(props) {

    const [adminName, setAdminName] = useState("");

    useLayoutEffect(() => {
        getAdmin(setAdminName);
    }, []);

    useEffect(() => {
        if (props.connectionHub != null)
            props.connectionHub.on('SendAdmin', (updateAdmin) => {
                setAdminName(updateAdmin);
            })
    }, [props.connectionHub]);

    return (
        <div className="parentDutyAdministrator">
            <div>
                <p className="defaultHeaderFontSize futuraBookC">
                    Дежурный администратор:
                </p>
            </div>
            <ContainerElementsWithShadow className="futuraBookC dutyAdministrator" render={() => (
                <span>{adminName}</span>
            )}>
            </ContainerElementsWithShadow>
        </div>
    );
}