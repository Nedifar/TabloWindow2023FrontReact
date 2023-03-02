import React from "react";
import './background.css'
import LeftBackgroundShape from '../../../images/LeftBackgroundShape.png'
import RightBackgroundShape from '../../../images/RightBackgroundShape.png'

function Background() {
    return (
        <div className="backgroundParent">
            <img className="rightBackgroundShape" src={RightBackgroundShape} />
            <img className="leftBackgroundShape" src={LeftBackgroundShape} />
        </div>
    );
}

export default Background;