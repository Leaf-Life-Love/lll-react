'use client'
import React, {Suspense, useEffect, useState} from "react";
import {getAuth, signInWithPopup, OAuthProvider, getRedirectResult,} from "firebase/auth";
import {Text, Loader} from "@react-three/drei";
import {Canvas} from '@react-three/fiber'
import JsonFind from 'json-find'
import {db} from "@/src/firebase/config";
import {collection, query, doc, getDoc, getDocs, where} from "firebase/firestore";


import Floor from 'src/components/floor'
import LightBulb from "src/components/lightbulb";
import Controls from "src/components/controls";
import Tower from "src/components/tower";
import LoadingScreen from "src/components/loadingscreen";
import TempChart from "src/components/tempChart";
import TempData from "src/components/tempData";
import './globals.css'

export default function Home() {
    const auth = getAuth();
    const provider = new OAuthProvider('microsoft.com');
    let isAdmin = false;
    let fullRights = false;

    const [EnvTemp, setEnvTemp] = useState(30);
    const [WaterTemp, setWaterTemp] = useState(30);
    const [Humidity, setHumidity] = useState(30);
    const [UVLight, setUVLight] = useState(30);
    const [CO2, setCO2] = useState(30);
    const [EC, setEC] = useState(30);
    const [PH, setPH] = useState(30);
    const [ORP, setORP] = useState(30);

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

    const checkAdmin = async () => {
        const user = auth.currentUser;
        const getAdmin = await getDocs(query(collection(db, 'Admins'), where('Email', '==', user.email)))
        if (!getAdmin.empty) {
            isAdmin = true
        }
        if (getAdmin.docs[0].data().AllRights) {
            fullRights = true
            console.log('full rights')
        }
    }

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

        dataContainer.addEventListener("animationend", function () {
            dataContainer.classList.toggle('z-[100]')
            dataContainer.classList.toggle('z-[200]')
            dataContainer.classList.toggle('flex')
        });

        historyContainer.addEventListener("animationend", function () {
            historyContainer.classList.toggle('z-[100]')
            historyContainer.classList.toggle('z-[200]')
            historyContainer.classList.toggle('flex')
        });
    }

    useEffect(() => {
        checkAdmin()
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
                {/*TODO: ph, ppm, humidity, ec, alles laten passen*/}
                <TempData/>
                <TempData/>
                <TempData/>
                <TempData/>
                <TempData/>
                <TempData/>
                <TempData/>
                <TempData/>
                <TempData/>
                <button className="flip-button" onClick={switchContainer}>&#8634;</button>
            </div>
            <div className="history-container hidden z-[100] flip">
                <TempChart/>
                <TempChart/>
                <TempChart/>
                <TempChart/>
                <TempChart/>
                <TempChart/>
                <TempChart/>
                <TempChart/>
                <TempChart/>
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