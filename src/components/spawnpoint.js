import React from "react";
import {Cone} from "@react-three/drei";

function SpawnPoint(props) {
    return (
        <mesh {...props}>
            <Cone args={[0.05, .1, 32]}/>
        </mesh>
    )
}
export default SpawnPoint;