'use client'
import './globals.css'
import {Inter} from 'next/font/google'
import {AuthContextProvider} from "src/context/AuthContext";
import {AppContextProvider} from "@/src/context/AppContext";
import { useState, createContext} from "react";

const inter = Inter({subsets: ['latin']})
export default function RootLayout({children}) {
    return (
        <html lang="en">
        <title>Leaf Life Love</title>
        <body className={inter.className}>
        <AppContextProvider>
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
        </AppContextProvider>
        </body>
        </html>
    )
}