import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function Tower(props){
    const model = useLoader(GLTFLoader, "/models/tower.glb")
    return (
        <primitive object={model.scene} scale={10} />
    )
}
export default Tower;