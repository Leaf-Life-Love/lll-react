import React, {useEffect, useState, useContext} from "react";
import {Html, Text} from "@react-three/drei";
import {MathUtils} from "three";
import {db} from "@/src/firebase/config";
import {collection, query, getDocs, addDoc, deleteDoc, doc, where, getDoc, onSnapshot} from "firebase/firestore";
import AppContext from "@/src/context/AppContext";
import {useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// import PlantModel from "@/src/components/Meshes/plant-model";

export const DtR = (degrees) => {
    return MathUtils.degToRad(degrees);
};

export default function Plant(props) {
    const context = useContext(AppContext);
    const isAdmin = context.isAdmin;

    const model = useLoader(GLTFLoader, "/models/groot.glb");

    const [potId, setPotId] = useState();
    const [plantNames, setPlantNames] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [growDays, setGrowDays] = useState();
    const [plantData, setPlantData] = useState();
    const [created, setCreated] = useState();
    const [plantName, setPlantName] = useState();
    const [progress, setProgress] = useState(0);
    const [dataReady, setDataReady] = useState(false);
    const [dataReady2, setDataReady2] = useState(false);

    const addPlant = () => {
        const dialog = document.querySelector(`#plant-dialog-${props.name.slice(4)}`);
        dialog.classList.add("flex");
        dialog.showModal();
    };

    const closeDialog = () => {
        const dialog = document.querySelector(`#plant-dialog-${props.name.slice(4)}`);
        dialog.classList.remove("flex");
        dialog.close();
    };

    const getPlantNames = async () => {
        const q = query(collection(db, "Plants"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const names = [];
            querySnapshot.forEach((doc) => {
                names.push(doc.data().Name);
            });
            setPlantNames(names);
        });
        return unsubscribe;
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
                closeDialog();
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
            await querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
                closeInfo();
            })
        }
    };

    const plantInfo = () => {
        if (plantData) {
            const dialog = document.querySelector(`#plant-info-${props.name.slice(4)}`);
            dialog.classList.add("flex");
            dialog.showModal();
        }
    }

    const closeInfo = () => {
        const dialog = document.querySelector(`#plant-info-${props.name.slice(4)}`);
        dialog.classList.remove("flex");
        dialog.close();
    }

    const getGrowData = () => {
        const date = new Date();
        const createdDate = new Date(created);

        let unsubscribe1;
        let unsubscribe2;

        if (potId) {
            const tq = query(collection(db, "Tower"), where("Pot", "==", potId));
            unsubscribe1 = onSnapshot(tq, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setPlantName(doc.data().Name);
                    setCreated(doc.data().Created.toDate());
                });

                if (dataReady === false) {
                    setDataReady(true);
                }
            });
        }

        if (plantName) {
            const pq = query(collection(db, "Plants"), where("Name", "==", plantName));
            unsubscribe2 = onSnapshot(pq, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setPlantData(doc.data());
                });

                if (dataReady2 === false) {
                    setDataReady2(true);
                }
            });
        }

        if (created && plantData) {
            let GrowDays = plantData.GrowDays;
            const diffTime = Math.abs(date - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
            const progress = Math.round((diffDays / GrowDays) * 100);
            const daysLeft = GrowDays - diffDays;
            setGrowDays(daysLeft)
            if (progress > 100) {
                setProgress(100);
            } else {
                setProgress(progress);
            }
        }

        // Return a function that unsubscribes both listeners
        return () => {
            if (unsubscribe1) {
                unsubscribe1();
            }
            if (unsubscribe2) {
                unsubscribe2();
            }
        };
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
                    <dialog open={false} id={`plant-dialog-${props.name.slice(4)}`} className="add-modal">
                        <h4 className="add-title">Plant Toevoegen</h4>
                        <input type="hidden" id="pot" defaultValue={props.name.slice(4)}/>
                        <div className="add-select-container">
                            <select name="plant-name" id={`plant-name-${props.name.slice(4)}`} defaultValue=""
                                    className="add-name-select">
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
                        </div>
                        <button onClick={addPlantToPot} className="add-button">Voeg toe</button>
                        <button onClick={closeDialog} className="add-close">Toevoegen Sluiten</button>
                        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                        {successMessage && <p className="text-green-500">{successMessage}</p>}
                    </dialog>
                </div>
                {plantData && (
                    <div>
                        <dialog open={false} id={`plant-info-${props.name.slice(4)}`} className="plant-info-modal">
                            <h4 className="info-title">Plant Info</h4>
                            <p className="info-item">Naam: {plantName}</p>
                            <p className="info-item">Toegevoegd op: {created.toLocaleString().slice(0, 10)}</p>
                            <p className="info-item">Zit in vakje: {potId}</p>
                            <p className="info-item">PH min/max: {plantData.MinPH}/{plantData.MaxPH}</p>
                            <p className="info-item">EC min/max: {plantData.MinEC}/{plantData.MaxEC}</p>
                            <p className="info-item">PPM min/max: {plantData.MinPPM}/{plantData.MaxPPM}</p>
                            <p className="info-item">Temp min/max: {plantData.MinTemp}/{plantData.MaxTemp}</p>
                            <p className="info-item">Volgroeit Over: {growDays} dagen</p>
                            <div className="grow-container">
                                <div className="grow-value" style={{width: `${progress}%`}}/>
                            </div>
                            <button onClick={deletePlant} className="delete-button">Verwijder</button>
                            <button onClick={closeInfo} className="info-close">Info Sluiten</button>
                        </dialog>
                    </div>
                )}
            </Html>
            <group rotation={[DtR(45), 0, 0]}>
                <mesh position={[0, 0.14, 0]} visible={props.isVisible}
                      onClick={props.isVisible && isAdmin ? plantInfo : null}
                >
                    <sphereGeometry args={[0.03, 32, 32]}/>
                    <meshStandardMaterial color="green"/>
                    {/*<PlantModel/>*/}
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
                <mesh
                    position={[0, 0.22, 0]} visible={props.isVisible}
                >
                    {progress && progress >= 100 ?
                        (
                            <Text
                                rotation={[DtR(-45), 0, 0]}
                                scale={0.05}
                                color="green"
                            >
                                Deze plant is volgroeid!
                            </Text>
                        ) : null
                    }
                </mesh>
            </group>
        </group>
    );
}
