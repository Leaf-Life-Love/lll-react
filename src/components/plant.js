import React, { useEffect, useState } from "react";
import { Html, Text } from "@react-three/drei";
import { MathUtils } from "three";
import { db } from "@/src/firebase/config";
import { collection, query, getDocs, addDoc, deleteDoc, doc, where } from "firebase/firestore";

export const DtR = (degrees) => {
    return MathUtils.degToRad(degrees);
};

export default function Plant(props) {
    const [potId, setPotId] = useState();
    const [plantNames, setPlantNames] = useState([]);

    const addPlant = () => {
        const dialog = document.querySelector(`#plant-dialog-${props.name.slice(4)}`);
        dialog.showModal();
    };

    const closeDialog = () => {
        const dialog = document.querySelector(`#plant-dialog-${props.name.slice(4)}`);
        dialog.close();
    };

    const getPlantNames = async () => {
        const q = query(collection(db, "Plants"));
        const querySnapshot = await getDocs(q);
        const names = [];
        querySnapshot.forEach((doc) => {
            names.push(doc.data().Name);
        });
        setPlantNames(names);
    };

    const addPlantToPot = async (plantName) => {
        const Pot = potId;
        const Name = document.querySelector(`#plant-name-${props.name.slice(4)}`).value;
        const plant = { Pot, Name };
        await addDoc(collection(db, "Tower"), plant);
    }

    const deletePlant = async () => {
        const text = "Weet je zeker dat je deze plant wilt verwijderen?";
        if (confirm(text) === true) {
            const querySnapshot = await getDocs(
                query(collection(db, "Tower"), where("Pot", "==", potId))
            );
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });
            console.log("Document(s) deleted successfully.");
        } else {
            console.log("No");
        }
    };



    useEffect(() => {
        const id = parseInt(props.name.slice(4));
        setPotId(id);
        getPlantNames();
    }, [props.name]);

    return (
        <group {...props}>
            <Html>
                <div>
                    <dialog open={false} id={`plant-dialog-${props.name.slice(4)}`}>
                        <h4>Plant Toevoegen</h4>
                        <input type="hidden" id="pot" defaultValue={props.name.slice(4)} />
                        <label htmlFor="plant-name">Plant naam</label>
                        <select name="plant-name" id={`plant-name-${props.name.slice(4)}`} defaultValue="">
                            <option value="" disabled>
                                Selecteer een plant
                            </option>
                            {plantNames.map((plantName) => {
                                return (
                                    <option value={plantName} key={plantName}>
                                        {plantName}
                                    </option>
                                );
                            })}
                        </select>
                        <button onClick={closeDialog}>X</button>
                        <button onClick={addPlantToPot}>Voeg toe</button>
                    </dialog>
                </div>
            </Html>
            <group rotation={[DtR(45), 0, 0]}>
                <mesh position={[0, 0.14, 0]} visible={props.isVisible} onClick={props.isVisible ? deletePlant : null}>
                    <sphereGeometry args={[0.03, 32, 32]}/>
                    <meshStandardMaterial color="green" />
                </mesh>
                <mesh position={[0, 0.15, 0]} visible={!props.isVisible}>
                    <Text
                        rotation={[DtR(-90), 0, 0]}
                        scale={0.1}
                        color="lightgrey"
                        position={[0, 0.01, 0.01]}
                        onClick={!props.isVisible ? addPlant : null}
                    >
                        +
                    </Text>
                </mesh>
            </group>
        </group>
    );
}
