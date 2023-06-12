import { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/src/firebase/config';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [FullRights, setFullRights] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const getAdmin = await getDocs(query(collection(db, 'Admins'), where('Email', '==', user.email)));
                if (!getAdmin.empty) {
                    setIsAdmin(true);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AppContext.Provider value={{ isAdmin, setIsAdmin }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
