import React, {useState, useEffect} from "react";
import {collection, doc, onSnapshot, query, Timestamp, orderBy, limit, getDocs, where} from "firebase/firestore";
import {db} from "@/src/firebase/config";

function SensorData({data, dataNames, min, max, symbol}) {
    const [dataValues, setDataValues] = useState(data);
    const [dataKeys, setDataKeys] = useState(dataNames);
    const [minValue, setMinValue] = useState(min);
    const [maxValue, setMaxValue] = useState(max);
    const [sensorSymbol, setSensorSymbol] = useState(symbol);

    const dataDeg = (currentValue, minValue, maxValue) =>{
        const minDeg = -82;
        const maxDeg = 82;
        const Deg = (currentValue - minValue) * (maxDeg - minDeg) / (maxValue - minValue) + minDeg;

        if (Deg > maxDeg || currentValue > maxValue) {
            return maxDeg;
        }
        if (Deg < minDeg || currentValue < minValue) {
            return minDeg;
        }
        return Deg;
    }

    return (
        <div className="temp-container">
            <div className="text-black absolute">{dataKeys}</div>
            <div className="outer-circle" style={{backgroundImage: "linear-gradient(to right, rgb(96, 165, 250), rgb(168, 85, 247), rgb(239, 68, 68)"}}>
                <div className="temp-value" style={{ transform: `rotate(${dataDeg(dataValues, minValue, maxValue)}deg)`}}>
                    <div className="temp-circle"></div>
                </div>
                <div className="inner-circle">{dataValues + " " + sensorSymbol}</div>
            </div>
        </div>

    )
}

export default SensorData;