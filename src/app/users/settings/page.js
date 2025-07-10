"use client";

import Button from "@/app/components/button/page";
import Nav from "@/app/components/nav/page";
import Whatsapp from "../../../../public/images/whatsapp.png";
import Gmail from "../../../../public/images/gmail.png";
import Address from "../../../../public/images/address.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Settings() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [form, setForm] = useState({
        username: '',
        number_phone: '',
        address: '',
    });

    // Ambil user dari localStorage dan set userId
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserId(parsed.id || "");
        }
    }, []);

    // Ambil data user dari server dan set ke form
    useEffect(() => {
        if (!userId) return;
        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/user/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    username: data.username || '',
                    number_phone: data.number_phone || '',
                    address: data.address || ''
                });
            })
            .catch((err) => {
                console.error("Gagal mengambil data user:", err);
            });
    }, [userId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/user/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("Update gagal");

            // Ambil data terbaru dari server
            const updatedUser = await fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/user/${userId}`).then(res => res.json());

            // Update localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert("Data berhasil diperbarui!");
            router.push("./settings");
        } catch (err) {
            console.error("Data gagal diubah:", err);
        }
    };

    const login = true;

    return (
        <div>
            <Nav login={login} />
            <div className="grid grid-cols-[auto_1280px_auto] bg-[#F8F0DF]">
                <div></div>
                <div>
                    <div className="bg-white my-[32px] rounded-lg">
                        <div className="grid grid-cols-[auto_650px_auto]">
                            <div></div>
                            <div className="pb-[64px] pt-[32px]">
                                <h1 className="font-bold text-[24px] text-center mb-[64px]">Pengaturan</h1>
                                <form onSubmit={submitHandler}>
                                    <div className="flex flex-col mb-[24px]">
                                        <label className="font-bold text-[16px] mb-[12px]">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Ubah Username"
                                            className="focus:outline-none px-[12px] py-[12px] bg-[#EAEAEA] text-[12px] rounded-[8px]"
                                            value={form.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col mb-[24px]">
                                        <label className="font-bold text-[16px] mb-[12px]">Password</label>
                                        <Link href={`./settings/newPassword`}>
                                            <p className="flex items-center justify-center h-[38px] w-[224px] pl-[12px] font-bold text-[14px] text-white rounded-md bg-amber-600">
                                                Ubah Password
                                            </p>
                                        </Link>
                                    </div>
                                    <div className="flex flex-col mb-[24px]">
                                        <label className="font-bold text-[16px] mb-[12px]">Nomor Telepon</label>
                                        <input
                                            type="text"
                                            name="number_phone"
                                            placeholder="0855-2497-6693"
                                            className="focus:outline-none px-[12px] py-[12px] bg-[#EAEAEA] text-[12px] rounded-[8px]"
                                            value={form.number_phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col mb-[24px]">
                                        <label className="font-bold text-[16px] mb-[12px]">Alamat</label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Ubah Alamat"
                                            className="focus:outline-none px-[12px] py-[12px] bg-[#EAEAEA] text-[12px] rounded-[8px]"
                                            value={form.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <Button color={"#E9B75A"}>Ubah Data</Button>
                                </form>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-[auto_1280px_auto] bg-[#8E281C] text-white font-bold text-[12px] py-[32px]">
                <div></div>
                <div className="grid grid-rows-3 gap-[24px]">
                    <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Whatsapp} alt="Whatsapp" width={24} />
                        <p>085524976693</p>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Gmail} alt="Gmail" />
                        <p>dynastybite03@gmail.com</p>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Address} alt="Address" />
                        <p>3517 W. Gray St. Utica, Pennsylvania 57867</p>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
}
