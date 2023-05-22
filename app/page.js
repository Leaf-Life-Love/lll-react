'use client'
import {Canvas} from '@react-three/fiber'
import Floor from 'src/components/floor'
import Box from "src/components/box";
import LightBulb from "src/components/lightbulb";
import Controls from "src/components/controls";
import Tower from "src/components/Tower";
// import TextComponent from "src/components/potTemp";
// import Draggable from "src/components/dragcontrols";
// import {Suspense} from "react";
import './globals.css'


export default function Home() {
    return (
        <main>
            <div id="canvas-container" className="scene">
                <Canvas
                    shadows={true}
                    camera={{position: [-6, 7, 7],}}
                    className="canvas"
                >
                    <gridHelper args={[20, 20]}/>
                    <axesHelper args={[50]}/>
                    <Controls/>
                    <ambientLight intensity={0.5} color={"white"}/>
                    <LightBulb position={[10, 15, 10]} />
                    <LightBulb position={[-10, 5, -10]}  />

                    {/*<LightBulb position={[-10, -3, 10]}/>*/}
                    {/*<LightBulb position={[10, -3, -10]}/>*/}
                    {/*<LightBulb position={[-10, -3, -10]}/>*/}
                    {/*<LightBulb position={[0, 15, 0]}/>*/}
                    <Floor position={[0, -4, 0]}/>
                    <Tower position={[0, 0, 0]}/>
                    {/*<TextComponent position={[0, 10, 0]} text={"hoi"} rotation={[0,0,0]} color={"red"} size={1}/>*/}
                    {/*<Draggable>*/}
                    {/*    <Suspense fallback={null}>*/}
                    {/*        <Box rotateX={3} rotateY={0.2}/>*/}
                    {/*    </Suspense>*/}
                    {/*</Draggable>*/}

                </Canvas>
            </div>
        </main>
    )
}