import './containerelementswithshadow.scss'

function ContainerElementsWithShadow({className, render, children}: ContainerElementsWithShadowProps){
    
    return(
        <div className={`containerElementsWithShadow ${className}`}>
            {render()}
        </div>
    );
}

export default ContainerElementsWithShadow;

type ContainerElementsWithShadowProps={
    className:string|undefined,
    render:any,
    children?:any
}