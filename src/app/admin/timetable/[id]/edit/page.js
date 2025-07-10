"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar/page";
import Image from "next/image";


export default function(){
    return(
        <div className="flex">
            <div className="grid fixed top-0 h-screen">
                <Sidebar/>
            </div>
            <div>
                <EditTimetable/>
            </div>
        </div>
    );
}

function EditTimetable(){
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        day_order: '',
        day_delivery:'',
    });

    useEffect(() => {
        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/timetable/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
            setForm(data)
            setLoading(false)
        })
        .catch((err) => console.error("Gagal memuat jadwal:", err))
    }, [params.id]);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const submitHendler = async (e) => {
        e.preventDefault();

        await fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/timetable/${params.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
                Accept : "application/json",
            },
            body: JSON.stringify(form),
        })
        .then(() => router.push("/admin/timetable"))
        .catch((err) => console.error("Data gagal diubah:", err))
    }

    if (loading) return <p>Loading...</p>

    return(
        <div className="flex-1 overflow-y-auto">
            <nav className="grid grid-cols-2 fixed left-[280px] top-0 right-0 bg-[#E9B75A] h-[75px] z-10">
                <div className="flex h-full items-center">
                    <form className="flex">
                        <div className="relative ml-[32px]">
                            <Image src={`/images/search.png`} alt="Search" width={24} height={24} className="absolute left-[12px] top-[12px]"/>
                            <input placeholder="Searc" className="py-[12px] pl-[48px] pr-[12px] w-[380px] focus:outline-none bg-white rounded-lg"/>
                        </div>
                        <button type="submit" className="px-[24px] py-[12px] bg-[#8E281C] rounded-lg ml-[12px] font-bold text-white">Cari</button>
                    </form>
                </div>
                <div className="flex h-full items-center justify-end mr-[32px]">
                    <h2 className="font-bold text-white mr-[12px]">Fadhilah Arumsari</h2>
                    <Image src={`/images/photo-admin.png`} alt="Photo" width={55} height={55}/>
                </div>
            </nav>
            <div className="grid grid-cols-1 absolute left-[280px] top-[75px] right-0 h-auto">
                <div className="flex justify-center py-[12px]">
                    <form 
                        className="flex flex-col w-[50%] p-[12px] rounded-lg" 
                        onSubmit={submitHendler}
                    >
                        <h1 className="font-bold text-[24px] text-center mt-[24px] mb-[64px]">Form Ubah Data Jadwal</h1>
                        <label className="font-bold">Hari Pemesanan :</label>
                        <input 
                            className="py-[12px] pl-[24px] pr-[12px] focus:outline-none bg-white rounded-lg mb-[32px]"
                            placeholder="Hari Pengiriman" 
                            name="day_order"
                            type="text"
                            value={form.day_order}
                            onChange={handleChange}
                        />
                        <label className="font-bold">Hari Pengiriman :</label>
                        <input 
                            className="py-[12px] pl-[24px] pr-[12px] focus:outline-none bg-white rounded-lg mb-[32px]"
                            placeholder="Hari Pengiriman" 
                            name="day_delivery"
                            type="text"
                            value={form.day_delivery}
                            onChange={handleChange}
                        />
                        <button 
                        type="submit" 
                        className="px-[24px] py-[12px] bg-[#8E281C] rounded-lg font-bold text-white"
                        >
                            Ubah Data
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}