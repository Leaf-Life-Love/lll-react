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

    const [adminFormData, setAdminFormData] = useState({
        email: '',
        allRights: false,
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
                <div className="p-6">
                    {/* Plant Creation */}
                    <h2 className="text-xl font-bold mb-4">Create Plant</h2>
                    <form>
                        {/* Plant name */}
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">Plant Name</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                type="text"
                                placeholder="Enter plant name"
                                id="name"
                                required={true}
                            />
                        </div>
                        {/* Plant details */}
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">PH</label>
                            <input type={"number"} id={"minPh"} required={true}/>
                            <input type={"number"} id={"maxPh"} required={true}/>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">PPM</label>
                            <input type={"number"} id={"minPPM"} required={true}/>
                            <input type={"number"} id={"maxPPM"} required={true}/>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">EC</label>
                            <input type={"number"} id={"minEC"} required={true}/>
                            <input type={"number"} id={"maxEC"} required={true}/>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">Temp</label>
                            <input type={"number"} id={"minTemp"} required={true}/>
                            <input type={"number"} id={"maxTemp"} required={true}/>
                        </div>
                        {/* Submit button */}
                        <button
                            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                            type="submit"
                        >
                            Create Plant
                        </button>
                    </form>
                </div>
            )
        }
    }
    const showAdminForm = () => {
        if (allRights) {
            return (
                <div className="w-1/4 p-6">
                    {/* Add Admin */}
                    <h2 className="text-xl font-bold mb-4">Add Admin</h2>
                    {/*<form>*/}
                        {/* Admin name */}
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">All Rights</label>
                            <input type="checkbox" id="allRights" name="allRights" onChange={(e) => handleAdminInput(e)}/>
                        </div>
                        {/* Admin email */}
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">Admin Email</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                type="email"
                                placeholder="Enter admin email"
                                id="email"
                                name="email"
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

    const submitAdmin = () =>{
        if (adminFormData.email && adminFormData.email.includes("@") && adminFormData.email.includes(".")) {
            addDoc(collection(db, 'Admins'), {
                Email: adminFormData.email,
                AllRights: adminFormData.allRights
            })
        }
    }

    useEffect(() => {
        if (!auth.currentUser) {
            signInWithPopup(auth, provider)
        } else {
            checkAdmin();
        }
    });

    return (
        <div className="flex text-black justify-center">
            <div className="dashboard-items">
                {showPlantForm()}
                {showAdminForm()}
            </div>
            {/*<button className="rounded bg-slate-800 h-5 w-5">Go Back</button>*/}
        </div>
    )
}