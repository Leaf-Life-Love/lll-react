'use client'
import React, {useEffect, useRef} from "react";
import {getAuth, signInWithPopup, signInWithRedirect, OAuthProvider, getRedirectResult} from "firebase/auth";
import {Html} from "@react-three/drei";
import {Canvas} from '@react-three/fiber'
import Floor from 'src/components/floor'
import Box from "src/components/box";
import LightBulb from "src/components/lightbulb";
import Controls from "src/components/controls";
import Tower from "@/src/components/tower";
// import TextComponent from "src/components/potTemp";
import './globals.css'
import {doc} from "firebase/firestore";

export default function Home() {
    const auth = getAuth();
    const loginButtonRef = useRef(null);

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

    useEffect(() => {
        if (auth.currentUser != null && loginButtonRef.current) {
            loginButtonRef.current.style.display = "none";
        }

        //check if browser supports webgl
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
                    camera={{position: [-6, 7, 7],}}
                    className="canvas"
                >
                    <Html
                        as={"div"}
                    >
                        <button onClick={() => {
                            signInWithPopup(auth, provider)
                        }} id="login" ref={loginButtonRef}>Login
                        </button>
                    </Html>
                    <gridHelper args={[20, 20]}/>
                    <axesHelper args={[50]}/>
                    <Controls/>
                    <ambientLight intensity={0.5} color={"white"}/>
                    <LightBulb position={[10, 15, 10]}/>
                    <LightBulb position={[-10, 5, -10]}/>
                    <Floor position={[0, -4, 0]}/>
                    <Tower position={[0, 0, 0]}/>
                </Canvas>
            </div>
        </main>
    )
}