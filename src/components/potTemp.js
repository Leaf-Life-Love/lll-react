import React, {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";

const TextComponent = ({text, position, rotation, color, size}) => {
    const textRef = useRef();

    useFrame(() => {
        if (textRef.current) {
            textRef.current.rotation.x = rotation.x;
            textRef.current.rotation.y = rotation.y;
            textRef.current.rotation.z = rotation.z;
        }
    });

    return (
        <mesh position={position} ref={textRef}>
            <textGeometry attach="geometry" args={[text, {
                font: 'helvetiker', size, height: 0.2
            }]}/>
            <meshBasicMaterial attach="material" color={color}/>
        </mesh>
    );
};

export default TextComponent;