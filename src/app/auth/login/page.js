"use client"

import Image from "next/image";
import auth from "../../../../public/images/auth.png";
import Button from "../../components/button/page";
import Link from "next/link";
import { useRouter, } from "next/navigation";
import { useState } from "react";

export default function Auth(){
    return(
        <>
            <div className="flex h-screen justify-center items-center" style={{backgroundColor:"#F8F0DF"}}>
                <div className="w-[1200px] h-[600px] rounded-lg grid grid-cols-[auto_1fr]" style={{backgroundColor:"#F8F0DF", boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}>
                    <div className="py-[12px] pl-[12px]">
                        <Image src={auth} alt="auth" />
                    </div>
                    <div>
                        <Login/>
                    </div>
                </div>
            </div>
        </>
    );
}


function Login(){
    const color = "#1976D2"
    const router = useRouter();

    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
        const response = await fetch("http://dynastybite.test/api/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            },
            body: JSON.stringify({ identifier, password })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Login gagal")
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        const userRole = data.user.role;
        console.log("Login berhasil:", data)
        if ( userRole === "admin"){
            router.push("/admin/dashboard")
        }else{
            router.push("/users/dashboard")
        }
        // Simpan token di localStorage/session atau redirect ke halaman dashboard

        } catch (err) {
            console.error("Error saat login:", err.message)
        }
    }

    return(
        <div className="relative top-[116px] left-[124px]">
            <div className="w-[400px]">
                <div className=" text-center font-bold text-[28px] mb-[64px]" style={{color:"#343A40"}}>
                    <h1>Welcome</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="font-bold text-[12px]" style={{color:"#343A40"}}>
                        <div className="mb-[17px]">
                            <label className="">Email/No. HP</label><br/>
                            <input 
                                name="identifier"
                                className="mt-[12px] py-[13px] px-[18px] w-full rounded-lg focus:outline-none" 
                                type="text" 
                                placeholder="Masukkan Email atau No. HP" 
                                style={{backgroundColor:"#F8F0DF", boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>
                        <div className="mb-[17px]">
                            <label>Password</label><br/>
                            <input 
                                name="password" 
                                className="mt-[12px] py-[13px] px-[18px] w-full rounded-lg focus:outline-none" 
                                type="password" 
                                placeholder="****" 
                                style={{backgroundColor:"#F8F0DF", boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button color={color}>Login</Button>
                    <div className="flex justify-between font-bold text-[12px] mt-[12px]" style={{color:"#343A40"}}>
                        <Link href={'./forget'}>Forget password?</Link>
                        <Link href={'./register'}>Don't have account yet?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}