import React from "react";

function Floor(props) {
    return (
        <mesh {...props} receiveShadow={true}>
            <boxGeometry args={[20, 1, 20]}/>
            <meshPhysicalMaterial color="green"/>
        </mesh>
    );
}

export default Floor;