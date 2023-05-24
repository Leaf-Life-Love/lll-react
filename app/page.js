'use client'
import React, {Suspense, useEffect, useState} from "react";
import {getAuth, signInWithPopup, OAuthProvider, getRedirectResult} from "firebase/auth";
import {Html, Text, Loader} from "@react-three/drei";
import {Canvas} from '@react-three/fiber'
import Floor from 'src/components/floor'
import LightBulb from "src/components/lightbulb";
import Controls from "src/components/controls";
import Tower from "src/components/tower";
import LoadingScreen from "src/components/loadingscreen";
import './globals.css'


export default function Home() {
    const auth = getAuth();
    const provider = new OAuthProvider('microsoft.com');
    const [tempValue, setTempValue] = useState(30);

    const tempDeg = () =>{
        const minTemp = 0;
        const maxTemp = 30;
        const minDeg = -90;
        const maxDeg = 90;
        const Deg = (tempValue - minTemp) * (maxDeg - minDeg) / (maxTemp - minTemp) + minDeg;

        if (Deg > maxDeg || tempValue > maxTemp) {
            return maxDeg;
        }
        if (Deg < minDeg || tempValue < minTemp) {
            return minDeg;
        }
        return Deg;
    }

    provider.setCustomParameters({
        prompt: 'consent',
        tenant: 'e8e5eb49-74bd-45b9-905a-1193cb5a9913',
    });
    provider.addScope('User.Read');

    getRedirectResult(auth)
        .then((result) => {
            // User is signed in.
            // IdP data available in result.additionalUserInfo.profile.
            // Get the OAuth access token and ID Token
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
        })
        .catch((error) => {
            console.log(error)
        });

    const handelLoginButton = () => {
        signInWithPopup(auth, provider)
    }

    useEffect(() => {
        setTempValue(10)

        //checks if browser supports webgl
        if (!window.WebGLRenderingContext) {
            // the browser doesn't even know what WebGL is
            alert("WebGL is not supported. If you need help, go to: https://get.webgl.org/troubleshooting")
        } else {
            const canvas = document.createElement("canvas");
            const webgl = canvas.getContext("webgl");
            if (!webgl) {
                // browser supports WebGL but initialization failed.
                alert("WebGL is supported, but disabled :-(. If you need help, go to: https://get.webgl.org/troubleshooting")
            }
        }
    }, [auth]);

    return (
        <main>
            <div className="data-container">
                {/*TODO: ph, ppm, humidity, ec, alles laten passen*/}
                <div className="temp-container">
                    <div className="outer-circle">
                        <div className="temp-value" style={{ transform: `rotate(${tempDeg()}deg)`}}>
                            <div className="temp-circle"></div>
                        </div>
                        <div className="inner-circle">{tempValue}&#8451;</div>
                    </div>
                    <div className="bottom-border"></div>
                </div>
            </div>
            <div id="canvas-container" className="scene">
                <Canvas
                    shadows={true}
                    camera={{position: [15, 7, 0],}}
                    className="canvas"
                >
                    <Suspense fallback={<LoadingScreen/>}>
                        <Text position={[8.7, -4, 10.01]} onClick={handelLoginButton}>Login</Text>
                        <gridHelper args={[20, 20]}/>
                        <axesHelper args={[50]}/>
                        <Controls/>
                        <ambientLight intensity={0.2} color={"white"}/>
                        <LightBulb position={[10, 15, 10]}/>
                        <LightBulb position={[-10, 5, -10]}/>
                        <Tower position={[0, 0, 0]}/>
                        <Floor position={[0, -4, 0]}/>
                    </Suspense>
                </Canvas>
                <Loader/>
            </div>
        </main>
    )
}