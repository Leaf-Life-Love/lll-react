import React from "react";
import {useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import SpawnPoint from "../spawnpoint";
import {MathUtils} from "three";

function Tower(props) {
    const DtR = (degrees) => { // convert degrees to radians for three.js rotation
        return MathUtils.degToRad(degrees);
    }
    const model = useLoader(GLTFLoader, "/models/tower.glb")
    return (
        <mesh {...props} castShadow={true} receiveShadow={true} scale={10}>
            <primitive object={model.scene}/>
            {/*<SpawnPoint position={[0, .22, .1]} rotation={[DtR(45),0,0]}/>*/}
            {/*<SpawnPoint position={[-0.08, .22, -.047]} rotation={[DtR(0),DtR(-30),DtR(45)]}/>*/}
            {/*<SpawnPoint position={[0, .22, .1]} rotation={[DtR(45),0,0]}/>*/}
        </mesh>
    )
}

export default Tower;