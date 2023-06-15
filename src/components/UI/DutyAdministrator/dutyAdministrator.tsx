import { useEffect, useLayoutEffect, useState } from 'react';
import { getAdmin } from '../../../lib/requestsApi';
import ContainerElementsWithShadow from '../ContainerElementsWithShadow/containerElementsWithShadow';
import './dutyadministrator.scss'
import { HubConnection } from '@microsoft/signalr';

export default function DutyAdministrator({ connectionHub }: DutyAdministratorProps) :  JSX.Element {

    const [adminName, setAdminName] = useState<string>("");

    useLayoutEffect(() => {
        getAdmin(setAdminName);
    }, []);

    useEffect(() => {
        if (connectionHub != null)
            connectionHub.on('SendAdmin', (updateAdmin) => {
                setAdminName(updateAdmin);
            })
    }, [connectionHub]);

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

type DutyAdministratorProps = {
    connectionHub: HubConnection | null
}