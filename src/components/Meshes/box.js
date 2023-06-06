import React from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

function Box(props) {
    const texture = useLoader(TextureLoader, "/texture.jpg");
    return (
        <mesh {...props} receiveShadow={true} castshadow={true}>
            <boxGeometry/>
            <meshPhysicalMaterial map={texture} color="white"/>
        </mesh>
    )
}
export default Box;