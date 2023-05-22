import React from "react";

function LightBulb(props) {
    return (
        <mesh {...props}>
            <pointLight castshadows={true} intensity={1}/>
            <sphereGeometry args={[0.2, 30, 10]}/>
            <meshPhongMaterial emissive="white"/>
        </mesh>
    );
}
export default LightBulb;