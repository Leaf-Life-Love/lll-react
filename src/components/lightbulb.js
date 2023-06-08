import React from "react";

function LightBulb(props) {
    return (
        <pointLight castShadow={true} {...props}/>
    );
}

export default LightBulb;