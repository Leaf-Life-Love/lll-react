'use client'
import React, {Suspense, useEffect, useState} from "react";
import {getAuth, signInWithPopup, OAuthProvider, getRedirectResult,} from "firebase/auth";
import {Text, Loader} from "@react-three/drei";
import {Canvas} from '@react-three/fiber'
import JsonFind from 'json-find'
import {db} from "@/src/firebase/config";
import {collection, query, doc, getDoc, getDocs, where, limit, onSnapshot, orderBy} from "firebase/firestore";

import Floor from '@/src/components/Meshes/floor'
import LightBulb from "src/components/lightbulb";
import Controls from "@/src/components/controls/controls";
import Tower from "@/src/components/Meshes/tower";
import LoadingScreen from "src/components/loadingscreen";
import SensorChart from "@/src/components/charts/sensorChart";
import './globals.css'
import SensorData from "@/src/components/data/sensorData";
import loadingscreen from "src/components/loadingscreen";

export default function Home() {
    const auth = getAuth();
    const provider = new OAuthProvider('microsoft.com');
    let isAdmin = false;
    let fullRights = false;


    const [latestValues, setLatestValues] = useState([]);
    const [historyValues, setHistoryValues] = useState([]);
    const [historyDates, setHistoryDates] = useState([]);
    const [sensorInfo, setSensorInfo] = useState([]);
    const [dataKeys, setDataKeys] = useState([]);
    // const [minValue, setMinValue] = useState([]);
    // const [maxValue, setMaxValue] = useState([]);
    // const [sensorSymbol, setSensorSymbol] = useState([]);
    let loadingScreen = null;


    provider.setCustomParameters({
        prompt: 'consent',
        tenant: 'e8e5eb49-74bd-45b9-905a-1193cb5a9913',
    });
    provider.addScope('User.Read');

    const checkAdmin = async () => {
        const user = auth.currentUser;
        const getAdmin = await getDocs(query(collection(db, 'Admins'), where('Email', '==', user.email)))
        if (!getAdmin.empty) {
            isAdmin = true
        }
        if (getAdmin.docs[0].data().AllRights) {
            fullRights = true
        }
    }

    useEffect(() => {
        loadingScreen = <LoadingScreen/>;
    }, [])

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

    const getData = () => {
        const latest = onSnapshot(query(collection(db, "Sensors"), orderBy("date", "desc"), limit(1)), (doc) => {
            doc.forEach((doc) => {
                setLatestValues(doc.data("data").data);
                setDataKeys(Object.keys(doc.data().data));
            })
        });

        return () => {
            latest();
        };
    };

    const getHistory = async () => {
        const querySnapshot = await getDocs(query(collection(db, "Sensors"), orderBy("date", "desc"), limit(10)));

        const historyValues = [];
        const historyDates = [];

        querySnapshot.forEach((doc) => {
            historyValues.push(doc.data().data);
            historyDates.push(doc.data().date);
        });

        setHistoryValues(historyValues);
        setHistoryDates(historyDates);
    }

    const getSensorInfo = async () => {
        const SensorInfo = await getDocs(query(collection(db, 'SensorInfo')))

        let si = [];

        SensorInfo.docs.map((doc) => {
            si.push(doc.data());
        });
        setSensorInfo(si);
    }

    useEffect(() => {
        //if logged in, check if admin
        if (auth.currentUser) {
            checkAdmin()
        }
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
        getData()
        getSensorInfo()
        getHistory()
    }, [auth]);

    return (
        <main>
            <div className="data-container z-[200] flex overflow-auto flip2">
                {sensorInfo.map((v, i) => {
                    return <SensorData key={i} data={latestValues[v.name]} dataNames={v.name} min={v.min} max={v.max}
                                       symbol={v.symbol} colorLeft={v.colorLeft} colorMid={v.colorMid} colorRight={v.colorRight}/>
                })}
                <button className="flip-button" onClick={switchContainer}>&#8634;</button>
            </div>
            <div className="history-container hidden z-[100] flip">
                {sensorInfo.map((v, i) => {
                    return <SensorChart key={i} data={historyValues.map(value => value[v.name])} label={v.name}
                                        date={historyDates}/>
                })}

                <button className="flip-button" onClick={switchContainer}>&#8634;</button>
            </div>
            <div id="canvas-container" className="scene">
                <Canvas
                    shadows={true}
                    camera={{position: [0, 7, -15],}}
                    className="canvas"
                    onCreated={(state) => {
                        state.setEvents({filter: (intersections) => intersections.filter(i => i.object.visible)})
                    }}
                >
                    {/*<Perf position={"top-right"}/>*/}
                    <OrbitControls enableDamping={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI - Math.PI}/>
                    <Suspense fallback={loadingScreen}>
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