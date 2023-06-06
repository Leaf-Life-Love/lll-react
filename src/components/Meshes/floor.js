import React from "react";

function Floor(props) {
    return (
        <mesh {...props} receiveShadow={true} onClick={(e)=>e.stopPropagation()}>
            <boxGeometry args={[20, 1, 20]}/>
            <meshPhysicalMaterial color="lightgray"/>
        </mesh>
    );
}

export default Floor;