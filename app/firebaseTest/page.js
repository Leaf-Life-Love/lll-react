"use client";

import React, {useState, useEffect} from 'react';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/src/firebase/config";

function Page(props) {
    const [name, setName] = useState('');
    const [ph, setPh] = useState(7);

    const [plants, setPlants] = useState([]);

    const [message, setMessage] = useState('hidden');

    const save = async () => {
        await addDoc(collection(db, 'plants'), {
            name: name,
            ph: ph,
        }).then(() => {
            setMessage('block');
        });
    }

    const delet = (id) => {
        deleteDoc(doc(db, 'plants', id));
    }

    useEffect(() => {

        onSnapshot(query(collection(db, 'plants')), (querySnapshot) => {
            let temp = [];

            querySnapshot.forEach((doc) => {
                temp.push({
                    id: doc.id,
                    name: doc.data().name,
                    ph: doc.data().ph,
                });
            });

            setPlants(temp);
        });
    }, []);

    return (
        <div className={`text-black`}>
            <div className={`text-white`}>
                {plants.map((plant, i) => {
                    return <div onClick={() => {delet(plant.id)}} key={i}>{plant.name}</div>;
                })}
            </div>

            <div className={message}>Success!</div>

            <input type="text" onChange={(e) => { setName(e.target.value) }}/><br/>
            <input type="number" min="0" max="14" value={ph} onChange={(e) => { setPh(e.target.value); }}/><br/>
            <button className={`bg-black text-white px-4 py-3 border-2 border-white rounded-lg`} onClick={save}>Save</button>
        </div>
    );
}

export default Page;