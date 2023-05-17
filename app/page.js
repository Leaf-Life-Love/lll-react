'use client'
import {Canvas} from '@react-three/fiber'
import Floor from 'src/components/floor'
import Box from "src/components/box";
import LightBulb from "src/components/lightbulb";
import OrbitControls from "src/components/controls";
import Tower from "src/components/Tower";
import Draggable from "src/components/dragcontrols";
import {Suspense} from "react";
import './globals.css'

export default function Home() {
    return (
        <main>
            <div>hello</div>
            <div id="canvas-container" className="scene">
                <Canvas
                    shadows={true}
                    camera={{position: [-6, 7, 7],}}
                    className="canvas"
                >
                    <ambientLight intensity={0.5} color={"white"}/>
                    <LightBulb position={[0, 15, 0]}/>
                    <Floor position={[0, -1, 0]}/>
                    <Tower position={[0, 0, 0]}/>
                    {/*<Draggable>*/}
                    {/*    <Suspense fallback={null}>*/}
                    {/*        <Box rotateX={3} rotateY={0.2}/>*/}
                    {/*    </Suspense>*/}
                    {/*</Draggable>*/}
                    <OrbitControls/>
                </Canvas>
            </div>
        </main>
    )
}