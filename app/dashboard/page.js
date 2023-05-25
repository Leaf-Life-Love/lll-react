"use client"
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {getAuth, signInWithPopup, OAuthProvider, getRedirectResult,} from "firebase/auth";
import {db} from "@/src/firebase/config";
import {collection, query, doc, getDoc, getDocs, where} from "firebase/firestore";


export default function Page() {
    const auth = getAuth();
    const router = useRouter();
    const provider = new OAuthProvider('microsoft.com');
    let isAdmin = false;
    let fullRights = false;

    provider.setCustomParameters({
        prompt: 'consent',
        tenant: 'e8e5eb49-74bd-45b9-905a-1193cb5a9913',
    });
    provider.addScope('User.Read');

    getRedirectResult(auth)
        .then((result) => {
            // User is signed in.
            // IdP data available in result.additionalUserInfo.profile.
            // Get the OAuth access token and ID Token
            const credential = OAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
        })
        .catch((error) => {
            console.log(error)
        });

    const checkAdmin = async () => {
        const user = auth.currentUser;
        const getAdmin = await getDocs(query(collection(db, 'Admins'), where('Email', '==', user.email)))
        console.log(getAdmin.empty)
        if (getAdmin.empty) {
            router.push('/')
        } else {
            isAdmin = true
            //TODO: werkt niet
        }

        if (getAdmin.docs[0].data().AllRights) {
            fullRights = true
        }
    }
    const showPlantForm = () => {
        if (isAdmin){
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
                            />
                        </div>
                        {/* Plant details */}
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">Plant Details</label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                rows="4"
                                placeholder="Enter plant details"
                            ></textarea>
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
        if (fullRights){
            return (
                <div className="w-1/4 p-6">
                    {/* Add Admin */}
                    <h2 className="text-xl font-bold mb-4">Add Admin</h2>
                    <form>
                        {/* Admin name */}
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">All Rights</label>
                            <input type="checkbox"/>
                        </div>
                        {/* Admin email */}
                        <div className="mb-4">
                            <label className="block mb-1 font-semibold">Admin Email</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                type="email"
                                placeholder="Enter admin email"
                            />
                        </div>
                        {/* Submit button */}
                        <button
                            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                            type="submit"
                        >
                            Add Admin
                        </button>
                    </form>
                </div>
                )
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
        </div>
    )
}