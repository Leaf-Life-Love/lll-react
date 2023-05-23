import React from "react";
import {useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function Tower(props) {
    const model = useLoader(GLTFLoader, "/models/tower.glb")
    return (
        <mesh {...props} castShadow={true} receiveShadow={true} scale={10}>
            <primitive object={model.scene}/>
        </mesh>
    )
}

export default Tower;