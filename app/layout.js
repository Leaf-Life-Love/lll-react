'use client'
import './globals.css'
import {Inter} from 'next/font/google'
import {AuthContextProvider} from "src/context/AuthContext";
const inter = Inter({subsets: ['latin']})
export default function RootLayout({children}) {



    return (
        <html lang="en">
        <title>Leaf Life Love</title>
        <body className={inter.className}>
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
        </body>
        </html>
    )
}