"use client";

import Button from "@/app/components/button/page";
import Nav from "@/app/components/nav/page";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewPassword() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserId(parsed.id || "");
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.new_password !== form.confirm_password) {
            alert("Konfirmasi password tidak cocok!");
            return;
        }

        try {
            const response = await fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/user/${userId}/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    old_password: form.old_password,
                    new_password: form.new_password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal mengganti password");
            }

            alert("Password berhasil diubah");
            router.push("/users/settings");
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan: " + error.message);
        }
    };

    return (
        <div>
            <Nav login={true} />
            <div className="grid grid-cols-[auto_1280px_auto] bg-[#F8F0DF]">
                <div></div>
                <div>
                    <div className="bg-white my-[32px] rounded-lg">
                        <div className="grid grid-cols-[auto_650px_auto]">
                            <div></div>
                            <div className="pb-[64px] pt-[32px]">
                                <h1 className="font-bold text-[24px] text-center mb-[64px]">Ubah Password</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col mb-[24px]">
                                        <label className="font-bold text-[16px] mb-[12px]">Password Lama</label>
                                        <input
                                            type="password"
                                            name="old_password"
                                            placeholder="Masukkan password lama"
                                            className="focus:outline-none px-[12px] py-[12px] bg-[#EAEAEA] text-[12px] rounded-[8px]"
                                            value={form.old_password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col mb-[24px]">
                                        <label className="font-bold text-[16px] mb-[12px]">Password Baru</label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            placeholder="Masukkan password baru"
                                            className="focus:outline-none px-[12px] py-[12px] bg-[#EAEAEA] text-[12px] rounded-[8px]"
                                            value={form.new_password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex flex-col mb-[24px]">
                                        <label className="font-bold text-[16px] mb-[12px]">Konfirmasi Password Baru</label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            placeholder="Ulangi password baru"
                                            className="focus:outline-none px-[12px] py-[12px] bg-[#EAEAEA] text-[12px] rounded-[8px]"
                                            value={form.confirm_password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <Button color={"#E9B75A"}>Simpan Password Baru</Button>
                                </form>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0">
                <div className="grid grid-cols-[auto_1280px_auto] bg-[#8E281C] text-white font-bold text-[12px] py-[32px]">
                    <div></div>
                    <div className="grid grid-rows-3 gap-[24px]">
                        <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                            <Image src={`/images/whatsapp.png`} alt="Whatsapp" width={24} height={24} />
                            <p>085524976693</p>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                            <Image src={`/images/gmail.png`} alt="Gmail" width={24} height={24}/>
                            <p>dynastybite03@gmail.com</p>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                            <Image src={`/images/address.png`} alt="Address" width={24} height={24}/>
                            <p>3517 W. Gray St. Utica, Pennsylvania 57867</p>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}
