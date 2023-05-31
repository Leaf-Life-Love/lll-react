import React, {useState, useEffect} from "react";
import {collection, doc, onSnapshot, query, Timestamp, orderBy, limit} from "firebase/firestore";
import {db} from "@/src/firebase/config";

function SensorData({data}) {
    const [dataValues, setDataValues] = useState(data);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(30);

    const dataDeg = (currentValue, minValue, maxValue) =>{
        const minDeg = -90;
        const maxDeg = 90;
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
            <div className="outer-circle">
                <div className="temp-value" style={{ transform: `rotate(${dataDeg(dataValues, minValue, maxValue)}deg)`}}>
                    <div className="temp-circle"></div>
                </div>
                <div className="inner-circle">{dataValues}&#8451;</div>
            </div>
        </div>

    )
}

export default SensorData;