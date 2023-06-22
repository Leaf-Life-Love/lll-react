import React, {useEffect, useState, useContext} from "react";
import {Html, Text} from "@react-three/drei";
import {MathUtils} from "three";
import {db} from "@/src/firebase/config";
import {collection, query, getDocs, addDoc, deleteDoc, doc, where, getDoc} from "firebase/firestore";
import AppContext from "@/src/context/AppContext";
import {useProgress} from "@react-three/drei";

export const DtR = (degrees) => {
    return MathUtils.degToRad(degrees);
};

export default function Plant(props) {
    const context = useContext(AppContext);
    const isAdmin = context.isAdmin;

    const [potId, setPotId] = useState();
    const [plantNames, setPlantNames] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [created, setCreated] = useState();
    const [growDays, setGrowDays] = useState();
    const [plantName, setPlantName] = useState();
    const [progress, setProgress] = useState(0);
    const [dataReady, setDataReady] = useState(false);
    const [dataReady2, setDataReady2] = useState(false);

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
        const Created = new Date();
        const plant = {Pot, Name, Created};

        if (Name === "") {
            setErrorMessage("Selecteer een plant");
            return;
        }

        await addDoc(collection(db, "Tower"), plant)
            .then(() => {
                setSuccessMessage("Plant succesvol toegevoegd");
                setTimeout(() => {
                    setSuccessMessage("");
                    closeDialog();
                }, 200);

            }).catch((error) => {
                setErrorMessage("Error bij plant toevoegen: ", error);
            });
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
            // console.log("Document(s) deleted successfully.");
        } else {
            // console.log("No");
        }
    };

    const getGrowData = async () => {
        const date = new Date();
        const createdDate = new Date(created);
        const GrowDays = growDays;

        if (potId !== undefined) {
            // console.log(potId)
            const tq = query(collection(db, "Tower"), where("Pot", "==", potId));
            const querySnapshot = await getDocs(tq);
            querySnapshot.forEach((doc) => {
                setPlantName(doc.data().Name)
                setCreated(doc.data().Created.toDate());
            });
            if (dataReady === false) {
                setDataReady(true);
            }
        }

        if (plantName !== undefined) {
            const pq = query(collection(db, "Plants"), where("Name", "==", plantName));
            const querySnapshot = await getDocs(pq);
            querySnapshot.forEach((doc) => {
                setGrowDays(doc.data().GrowDays);
            });
            if (dataReady2 === false) {
                setDataReady2(true);
            }
        }

        if (created !== undefined && growDays !== undefined) {
            const diffTime = Math.abs(date - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
            const progress = Math.round((diffDays / (GrowDays)) * 100);
            if (progress > 100) {
                setProgress(100)
            } else {
                setProgress(progress)
            }
        }
    };

    useEffect(() => {
        const id = parseInt(props.name.slice(4));
        setPotId(id);
        getPlantNames();
    }, [props.name]);

    useEffect(() => {
        getGrowData();
    }, [potId, dataReady, dataReady2]);
    return (
        <group {...props}>
            <Html>
                <div>
                    <dialog open={false} id={`plant-dialog-${props.name.slice(4)}`}>
                        <h4>Plant Toevoegen</h4>
                        <input type="hidden" id="pot" defaultValue={props.name.slice(4)}/>
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
                        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                        {successMessage && <p className="text-green-500">{successMessage}</p>}
                    </dialog>
                </div>
            </Html>
            <group rotation={[DtR(45), 0, 0]}>
                <mesh position={[0, 0.14, 0]} visible={props.isVisible}
                      onClick={props.isVisible && isAdmin ? deletePlant : null}
                >
                    <sphereGeometry args={[0.03, 32, 32]}/>
                    <meshStandardMaterial color="green"/>
                </mesh>
                <mesh position={[0, 0.15, 0]} visible={!props.isVisible && isAdmin}>
                    <Text
                        rotation={[DtR(-90), 0, 0]}
                        scale={0.1}
                        color="lightgrey"
                        position={[0, 0.01, 0.01]}
                        onClick={!props.isVisible && isAdmin ? addPlant : null}
                    >
                        +
                    </Text>
                </mesh>
                <Html
                    as="div"
                    position={[0, 0.15, -0.08]}
                    rotation={[DtR(-90), 0, 0]}
                    // visible={props.isVisible}
                    style={{display: props.isVisible ? "block" : "none"}}
                >
                    <div className="grow-container">
                        <div className="grow-value" style={{width: `${progress}%`}}/>
                    </div>
                </Html>

            </group>
        </group>
    );
}
