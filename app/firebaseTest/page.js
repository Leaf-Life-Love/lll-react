'use client'
import addData from 'src/firebase/firestore/addData'
import getData from 'src/firebase/firestore/getData'
import { useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import firebase_app from "src/firebase/config";
import Image from 'next/image'

export default function Home() {
    const handleForm = async () => {
        const data = {
            name: Math.random().toString(36).substring(7),
            house: Math.random().toString(36).substring(7),
        }
        const { result, error } = await addData('users', data.name, data)
        console.log(result)

        if (error) {
            return console.log(error)
        }
    }

    let data;
    const [users, setUsers] = useState([])
    let temp = []
    const db = getFirestore(firebase_app)
    const getUsers = async () => {
        // const { result, error } = await getData('users')
        //
        // if (error) {
        //     return console.log(error)
        // }
        // data = result.data()
        // console.log(data)
        // temp.push(
        //     <div key={Math.random()}>
        //         <div>
        //             <p>{data.name}</p>
        //             <p>{data.house}</p>
        //         </div>
        //     </div>
        // )
        // console.log(temp)
        // setUsers(temp)
        const q = query(collection(db, 'users'));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            temp.push(
                <div key={Math.random()}>
                    <div>
                        <p>{doc.data().name}</p>
                        <p>{doc.data().house}</p>
                    </div>
                </div>
            )
        });
        setUsers(temp)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>hello</div>
            <img src="next.svg" alt="hero" />
            <button onClick={handleForm}>Add data</button>
            <button onClick={getUsers}>Get data</button>
            <div>
                {users}
            </div>
        </main>
    )
}
