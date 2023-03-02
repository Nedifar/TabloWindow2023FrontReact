import './containerelementswithshadow.css'
import React from 'react'

function ContainerElementsWithShadow(props){
    
    return(
        
        <div className={"containerElementsWithShadow" + " " + props.className}>
            {props.render()}
        </div>
    );
}

export default ContainerElementsWithShadow;