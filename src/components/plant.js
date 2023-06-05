import React from "react";
import {Cone, Sphere, Text} from "@react-three/drei";
import {MathUtils} from "three";

export const DtR = (degrees) => { // convert degrees to radians for three.js rotation
    return MathUtils.degToRad(degrees);
}

export default function Plant(props) {

    const addPlant = () => {
        console.log('add plant in pot: ' + parseInt(props.name.split('pot-')[1]));
    }

    return (
        <group {...props}>
            <group rotation={[DtR(45), 0, 0]}>
                <mesh position={[0, 0.14, 0]} visible={props.isVisible}>
                    <sphereGeometry args={[.03, 32, 32]}/>
                    <meshBasicMaterial color={props.color}/>
                </mesh>
                <mesh position={[0, 0.15, 0]} visible={!props.isVisible}>
                    <Text rotation={[DtR(-90),0,0]} scale={0.1} color="lightgrey" position={[0,0.01,0.01]} onClick={addPlant}>+</Text>
                </mesh>
            </group>
        </group>
    )
}