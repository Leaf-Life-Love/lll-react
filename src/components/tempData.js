import React, {useState, useEffect} from "react";

function TempData() {
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

    useEffect(() => {
        setTempValue(10)
    }, [])

    return (
        <div className="temp-container">
            <div className="outer-circle">
                <div className="temp-value" style={{ transform: `rotate(${tempDeg()}deg)`}}>
                    <div className="temp-circle"></div>
                </div>
                <div className="inner-circle">{tempValue}&#8451;</div>
            </div>
        </div>
    )
}

export default TempData;