"use client"
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getAuth, signInWithPopup, OAuthProvider, getRedirectResult,} from "firebase/auth";
import {db} from "@/src/firebase/config";
import {collection, query, doc, getDoc, getDocs, where, addDoc} from "firebase/firestore";

export default function Page() {
    const auth = getAuth();
    const router = useRouter();
    const provider = new OAuthProvider('microsoft.com');
    const [isAdmin, setIsAdmin] = useState(false);
    const [allRights, setAllRights] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [adminErrorMessage, setAdminErrorMessage] = useState("");
    const [adminSuccesMessage, setAdminSuccessMessage] = useState("");


    const [adminFormData, setAdminFormData] = useState({
        email: '',
        allRights: false,
    });

    const [plantFormData, setPlantFormData] = useState({
        name: '',
        minPH: '',
        maxPH: '',
        minPPM: '',
        maxPPM: '',
        minEC: '',
        maxEC: '',
        minTemp: '',
        maxTemp: '',
    });

    useEffect(() => {
        if (!auth.currentUser) {
            signInWithPopup(auth, provider)
        } else {
            checkAdmin();
        }
    });

    provider.setCustomParameters({
        prompt: 'consent',
        tenant: 'e8e5eb49-74bd-45b9-905a-1193cb5a9913',
    });
    provider.addScope('User.Read');

    const checkAdmin = async () => {
        const user = auth.currentUser;
        const getAdmin = await getDocs(query(collection(db, 'Admins'), where('Email', '==', user.email)))
        if (getAdmin.empty) {
            router.push('/')
        } else {
            setIsAdmin(true)
        }

        if (getAdmin.docs[0].data().AllRights) {
            setAllRights(true)
        }
    }

    const showPlantForm = () => {
        if (isAdmin) {
            return (
                <div className="plant-form flex flex-col items-center">
                    {/* Plant Creation */}
                    <h2 className="text-xl font-bold mb-4 text-center">Create Plant</h2>
                    {/* Plant name */}
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-center">Plant Name</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="Enter plant name"
                            id="name"
                            required={true}
                            value={plantFormData.name}
                            onChange={(e) => handlePlantInput(e)}
                        />
                    </div>
                    {/*Plant details*/}
                    <div className="form-input-container">
                        <label className="block mb-1 font-semibold text-center">PH</label>
                        <input
                            type={"number"} id={"minPH"} placeholder={"Min"}
                            required={true} className={"form-input mb-2"}
                            onChange={(e) => handlePlantInput(e)}
                            value={plantFormData.minPH}
                        />
                        <input
                            type={"number"} id={"maxPH"} placeholder={"Max"}
                            required={true} className={"form-input"}
                            onChange={(e) => handlePlantInput(e)}
                            value={plantFormData.maxPH}
                        />
                    </div>
                    <div className="form-input-container">
                        <label className="block mb-1 font-semibold text-center">PPM</label>
                        <input
                            type={"number"} id={"minPPM"} placeholder={"Min"}
                            required={true} className={"form-input mb-2"}
                            onChange={(e) => handlePlantInput(e)}
                            value={plantFormData.minPPM}
                        />
                        <input
                            type={"number"} id={"maxPPM"} placeholder={"Max"}
                            required={true} className={"form-input"}
                            onChange={(e) => handlePlantInput(e)}
                            value={plantFormData.maxPPM}
                        />
                    </div>
                    <div className="form-input-container">
                        <label className="block mb-1 font-semibold text-center">EC</label>
                        <input
                            type={"number"} id={"minEC"} placeholder={"Min"}
                            required={true} className={"form-input mb-2"}
                            onChange={(e) => handlePlantInput(e)}
                            value={plantFormData.minEC}
                        />
                        <input
                            type={"number"} id={"maxEC"} placeholder={"Max"}
                            required={true} className={"form-input"}
                            onChange={(e) => handlePlantInput(e)}
                            value={plantFormData.maxEC}
                        />
                    </div>
                    <div className="form-input-container">
                        <label className="block mb-1 font-semibold text-center">Temp</label>
                        <input
                            type={"number"} id={"minTemp"} placeholder={"Min"}
                            required={true} className={"form-input mb-2"}
                            onChange={(e) => handlePlantInput(e)}
                            value={plantFormData.minTemp}
                        />
                        <input
                            type={"number"} id={"maxTemp"} placeholder={"Max"}
                            required={true} className={"form-input"}
                            onChange={(e) => handlePlantInput(e)}
                            value={plantFormData.maxTemp}
                        />
                    </div>
                    {/* Submit button */}
                    <button
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                        type="button"
                        onClick={submitPlant}
                    >
                        Create Plant
                    </button>
                    {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500">{successMessage}</p>}
                </div>
            )
        }
    }

    const handlePlantInput = () => {
        const name = document.getElementById("name").value
        const minPH = document.getElementById("minPH").value
        const maxPH = document.getElementById("maxPH").value

        const minPPM = document.getElementById("minPPM").value
        const maxPPM = document.getElementById("maxPPM").value

        const minEC = document.getElementById("minEC").value
        const maxEC = document.getElementById("maxEC").value

        const minTemp = document.getElementById("minTemp").value
        const maxTemp = document.getElementById("maxTemp").value

        setPlantFormData({
            name: name,
            minPH: minPH,
            maxPH: maxPH,
            minPPM: minPPM,
            maxPPM: maxPPM,
            minEC: minEC,
            maxEC: maxEC,
            minTemp: minTemp,
            maxTemp: maxTemp,
        })
    }

    const submitPlant = async (e) => {

        // Check if all fields are filled
        if (
            plantFormData.name === "" ||
            plantFormData.minPH === "" ||
            plantFormData.maxPH === "" ||
            plantFormData.minPPM === "" ||
            plantFormData.maxPPM === "" ||
            plantFormData.minEC === "" ||
            plantFormData.maxEC === "" ||
            plantFormData.minTemp === "" ||
            plantFormData.maxTemp === ""
        ) {
            setErrorMessage("Please fill all fields");
            return;
        }

        // Check if all fields are numbers
        if (
            isNaN(plantFormData.minPH) ||
            isNaN(plantFormData.maxPH) ||
            isNaN(plantFormData.minPPM) ||
            isNaN(plantFormData.maxPPM) ||
            isNaN(plantFormData.minEC) ||
            isNaN(plantFormData.maxEC) ||
            isNaN(plantFormData.minTemp) ||
            isNaN(plantFormData.maxTemp)
        ) {
            setErrorMessage("Please fill all fields with a number");
            return;
        }

        // Check if all fields are positive numbers
        if (
            plantFormData.minPH < 0 ||
            plantFormData.maxPH < 0 ||
            plantFormData.minPPM < 0 ||
            plantFormData.maxPPM < 0 ||
            plantFormData.minEC < 0 ||
            plantFormData.maxEC < 0 ||
            plantFormData.minTemp < 0 ||
            plantFormData.maxTemp < 0
        ) {
            setErrorMessage("Please fill all fields with a positive number");
            return;
        }

        // Check if all fields are in the correct range
        if (
            plantFormData.minPH > plantFormData.maxPH ||
            plantFormData.minPPM > plantFormData.maxPPM ||
            plantFormData.minEC > plantFormData.maxEC ||
            plantFormData.minTemp > plantFormData.maxTemp
        ) {
            setErrorMessage("Please fill all fields with the correct range");
            return;
        }

        // Check if plant name already exists
        const plantRef = await getDocs(
            query(collection(db, "Plants"), where("Name", "==", plantFormData.name))
        );
        if (!plantRef.empty) {
            setErrorMessage("Plant name already exists");
            return;
        }

        // Add plant to firestore
        await addDoc(collection(db, 'Plants'), {
            Name: plantFormData.name,
            MinPH: plantFormData.minPH,
            MaxPH: plantFormData.maxPH,
            MinPPM: plantFormData.minPPM,
            MaxPPM: plantFormData.maxPPM,
            MinEC: plantFormData.minEC,
            MaxEC: plantFormData.maxEC,
            MinTemp: plantFormData.minTemp,
            MaxTemp: plantFormData.maxTemp,
        })
            .then(() => {
                // Plant added successfully
                setTimeout(() => {
                    setSuccessMessage("");
                }, 3000); // Clear the success message after 3 seconds
                setSuccessMessage("Plant added successfully");

                setErrorMessage(""); // Clear error message

                // Clear form inputs
                setPlantFormData({
                    name: '',
                    minPH: '',
                    maxPH: '',
                    minPPM: '',
                    maxPPM: '',
                    minEC: '',
                    maxEC: '',
                    minTemp: '',
                    maxTemp: '',
                });
            })
            .catch((error) => {
                // Plant addition failed
                setSuccessMessage(""); // Clear success message
                setErrorMessage(error.message);
            });

        //todo CLEAR ERROR MESSAGE

        if (errorMessage !== "") {
            setTimeout(() => {
                setErrorMessage("");
            }, 5000); // Clear the error message after 5 seconds
        }
    }

    const showAdminForm = () => {
        if (allRights) {
            return (
                <div className={"admin-form"}>
                    {/* Add Admin */}
                    <h2 className="text-xl font-bold mb-4">Add Admin</h2>
                    {/*<form>*/}
                    {/* Admin name */}
                    <div className="mb-4 flex flex-col items-center">
                        <label className="block mb-1 font-semibold">All Rights</label>
                        <input type="checkbox" id="allRights" onChange={(e) => handleAdminInput(e)}/>
                    </div>
                    {/* Admin email */}
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold text-center">Admin Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="Enter admin email"
                            id="email"
                            required={true}
                            onChange={(e) => handleAdminInput(e)}
                        />
                    </div>
                    {/* Submit button */}
                    <button
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                        type={"submit"}
                        onClick={submitAdmin}
                    >
                        Add Admin
                    </button>
                    {adminErrorMessage && <p className="text-red-500 mt-2">{adminErrorMessage}</p>}
                    {adminSuccesMessage && <p className="text-green-500">{adminSuccesMessage}</p>}
                    {/*</form>*/}
                </div>
            )
        }
    }

    const handleAdminInput = () => {
        const email = document.getElementById("email").value
        const allRights = document.getElementById("allRights").checked

        setAdminFormData({
            email: email,
            allRights: allRights,
        })
    }

    const submitAdmin = async () => {
        const emailPattern = new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

        if (!adminFormData.email) {
            setAdminErrorMessage("Please fill all fields");
            setAdminSuccessMessage("")
        } else if (!emailPattern.test(adminFormData.email)) {
            setAdminErrorMessage("Please enter a valid email");
            setAdminSuccessMessage("")
        }

        if (adminFormData.email && emailPattern.test(adminFormData.email)) {
            await addDoc(collection(db, 'Admins'), {
                Email: adminFormData.email,
                AllRights: adminFormData.allRights
            }).then(() => {
                setTimeout(() => {
                    setAdminSuccessMessage("");
                }, 3000); // Clear the success message after 3 seconds
                setAdminSuccessMessage("Admin added successfully")
                setAdminErrorMessage("")

                //todo CLEAR FORM

                adminFormData.email = ""
                adminFormData.allRights = false
            }).catch((error) => {
                setAdminErrorMessage(error.message)
            })
        }
    }

    return (
        <div className="flex text-black justify-center">
            <div className="dashboard-items">
                {showPlantForm()}
                {showAdminForm()}
            </div>
            <a className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 absolute bottom-5 left-4" href={"/"}>Go Back</a>
        </div>
    )
}