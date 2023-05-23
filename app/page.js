'use client'
import React, {Suspense, useEffect, useRef} from "react";
import {getAuth, signInWithPopup, signInWithRedirect, OAuthProvider, getRedirectResult} from "firebase/auth";
import {Html, Text, Text3D, Center, Loader} from "@react-three/drei";
import {Canvas} from '@react-three/fiber'
import Floor from 'src/components/floor'
import LightBulb from "src/components/lightbulb";
import Controls from "src/components/controls";
import Tower from "src/components/tower";
import LoadingScreen from "src/components/loadingscreen";
import './globals.css'


export default function Home() {
    const auth = getAuth();
    // const loginButtonRef = useRef(null);

    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({
        // Optional "tenant" parameter in case you are using an Azure AD tenant.
        // eg. '8eaef023-2b34-4da1-9baa-8bc8c9d6a490' or 'contoso.onmicrosoft.com'
        // or "common" for tenant-independent tokens.
        // The default value is "common".
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
            <div id="canvas-container" className="scene">
                <Canvas
                    shadows={true}
                    colorManagement
                    camera={{position: [15, 7, 0],}}
                    className="canvas"
                >
                    <Suspense fallback={<LoadingScreen/>}>
                        {/*<Html>*/}
                        {/*    <button onClick={() => {*/}
                        {/*        signInWithPopup(auth, provider)*/}
                        {/*    }} id="login" ref={loginButtonRef}>Login*/}
                        {/*    </button>*/}
                        {/*</Html>*/}
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