import React, {useEffect, useState} from "react";
import {useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import Plant, {DtR} from "../plant";
import {db} from "@/src/firebase/config";
import {collection, query, onSnapshot, getDocs} from "firebase/firestore";
import {Image} from "@react-three/drei";
import spawnPoints from "@/src/JSOns/spawnPoints";

export default function Tower(props) {
    const model = useLoader(GLTFLoader, "/models/tower.glb");
    const [visibleStates, setVisibleStates] = useState([]);
    const [plantData, setPlantData] = useState([]);
    const [plantNames, setPlantNames] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, "Tower")), (querySnapshot) => {
            const visibleStates = spawnPoints.map((spawnPoint) =>
                hasPlant(querySnapshot, spawnPoint.name)
            );
            setVisibleStates(visibleStates);
            setPlantData(querySnapshot.docs.map((doc) => doc.data()));
        });
        getPlantNames();
        return () => {
            unsubscribe();
        };
    }, []);

    const hasPlant = (querySnapshot, PotName) => {
        const PotNr = parseInt(PotName.slice(4));
        return (
            !querySnapshot.empty && querySnapshot.docs.some((doc) => doc.data().Pot === PotNr)
        );
    };

    const getPlantNames = async () => {
        const q = query(collection(db, "Plants"));
        const querySnapshot = await getDocs(q);
        const newPlantNames = querySnapshot.docs.map((doc) => doc.data().Name);
        setPlantNames((prevPlantNames) => [...prevPlantNames, ...newPlantNames]);
    };


    return (
        <mesh {...props} castShadow={true} receiveShadow={true} scale={10}>
            <primitive object={model.scene} onClick={(e) => e.stopPropagation()}/>
            {spawnPoints.map((spawnPoint, index) => (
                <Plant
                    key={spawnPoint.name}
                    position={spawnPoint.position}
                    rotation={spawnPoint.rotation.map(DtR)}
                    name={spawnPoint.name}
                    isVisible={visibleStates[index]}
                    color={plantData[index]?.Color}
                    plantNames={plantNames}
                />
            ))}
            <Image
                url="/thomas.jpeg"
                rotation={[DtR(0), DtR(-90), DtR(0)]}
                scale={0.01}
                position={[0, -0.005, 0]}
            />
        </mesh>
    );
}
