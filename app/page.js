'use client'
import React, {Suspense, useEffect, useState} from "react";
import {getAuth, signInWithPopup, OAuthProvider, getRedirectResult} from "firebase/auth";
import {Text, Loader} from "@react-three/drei";
import {Canvas} from '@react-three/fiber'
import Floor from 'src/components/floor'
import LightBulb from "src/components/lightbulb";
import Controls from "src/components/controls";
import Tower from "src/components/tower";
import LoadingScreen from "src/components/loadingscreen";
import DataChart from "@/src/components/charts/dataChart";
import './globals.css'
import SensorData from "@/src/components/data/sensorData";
import {collection, limit, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "@/src/firebase/config";

export default function Home() {
    const auth = getAuth();
    const provider = new OAuthProvider('microsoft.com');

    const [dataValues, setDataValues] = useState([]);

    useEffect(() => {
        const getData = () => {
            const unsub = onSnapshot(query(collection(db, "Sensors"), orderBy("date", "desc"), limit(1)), (doc) => {
                doc.forEach((key) => {
                    setDataValues(key.data("data").data);
                })
            });

            return () => {
                unsub();
            };

        };
        getData();
    }, []);
console.log(dataValues)
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

    const switchContainer = () => {
        const dataContainer = document.querySelector('.data-container')
        const historyContainer = document.querySelector('.history-container')

        dataContainer.classList.toggle('flip')
        dataContainer.classList.toggle('flip2')
        historyContainer.classList.toggle('flip')
        historyContainer.classList.toggle('flip2')

        setTimeout(() => {
            dataContainer.classList.toggle('hidden')
            historyContainer.classList.toggle('hidden')
        }, 500);

        dataContainer.addEventListener("animationend", function() {
            dataContainer.classList.toggle('z-[100]')
            dataContainer.classList.toggle('z-[200]')
            dataContainer.classList.toggle('flex')
        });

        historyContainer.addEventListener("animationend", function() {
            historyContainer.classList.toggle('z-[100]')
            historyContainer.classList.toggle('z-[200]')
            historyContainer.classList.toggle('flex')
        });
    }

    useEffect(() => {
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
            <div className="data-container z-[200] flex overflow-auto flip2">
                {Object.keys(dataValues).map((k) => {
                    return <SensorData key={k} data={dataValues[k]}/>
                })}
                <button className="flip-button" onClick={switchContainer}>&#8634;</button>
            </div>
            <div className="history-container hidden z-[100] flip">
                <DataChart/>
                <button className="flip-button" onClick={switchContainer}>&#8634;</button>
            </div>
            <div id="canvas-container" className="scene">
                <Canvas
                    shadows={true}
                    camera={{position: [15, 7, 0],}}
                    className="canvas"
                >
                    <Suspense fallback={<LoadingScreen/>}>
                        <Text position={[8.7, -4, 10.01]} onClick={handelLoginButton}>Login</Text>
                        {/*<gridHelper args={[20, 20]}/>*/}
                        {/*<axesHelper args={[50]}/>*/}
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