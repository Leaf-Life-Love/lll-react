import React from "react";
import {useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export default function PlantModel(props) {
const model = useLoader(GLTFLoader, "/models/groot.glb");
    return (
        <mesh {...props} castShadow={true} receiveShadow={true} scale={5}>
            <primitive object={model.scene} onClick={(e) => e.stopPropagation()}/>
        </mesh>
    );
}