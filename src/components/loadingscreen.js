import React from "react";
import { Html, useProgress } from "@react-three/drei";

function LoadingScreen() {
    const { progress } = useProgress();

    return (
        <Html center>
            <div className={"loading-container"}>
                <div className={"loading-logo"}>
                    <img src="/logo2.png" alt="Logo" className={"rounded-logo"}/>
                </div>
                <div className={"progress-bar"}>
                    <div style={{ width: `${progress}%` }} className={"progress"} />
                </div>
                <div className={"loading-text"}>{`${Math.round(progress)}%`}</div>
            </div>
        </Html>
    );
}

export default LoadingScreen;
