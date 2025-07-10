"use client"

import Sidebar from "@/app/components/sidebar/page";
import Image from "next/image";
import Search from "../../../../public/images/search.png";
import Photo from "../../../../public/images/photo-admin.png";
import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";
import Edit from "../../../../public/images/image_edit.png";
import Delete from "../../../../public/images/image_delete.png";

export default function(){
    return(
        <div className="flex">
            <div className="grid sticky top-0 h-screen">
                <Sidebar/>
            </div>
            <Manage/>
        </div>
    );
}

function Manage(){
    let number = 1;
    const [timetables, setTimetables] = useState([]);

    useEffect(() => {
        fetch("http://dynastybite.test/api/timetable")
        .then((res) => res.json())
        .then((data) => setTimetables(data))
        .catch((err) => console.error("Gagal memuat jadwal:", err))
    }, []);

    return(
        <div className="flex-1 overflow-y-auto">
            <nav className="grid grid-cols-1 fixed left-[280px] top-0 right-0 bg-[#E9B75A] h-[75px] z-10">
                <div className="flex h-full items-center">
                </div>
                <div className="flex h-full items-center justify-end mr-[32px]">
                    <h2 className="font-bold text-white mr-[12px]">Fadhilah Arumsari</h2>
                    <Image src={Photo} alt="Photo"/>
                </div>
            </nav>
            <div className="relative left-0 top-[75px] right-0">
                <div className="grid mx-[32px] p-[12px] bg-[#F8F0DF] my-[24px]" style={{boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}>
                    <h1 className="font-bold text-[24px] mb-[12px]">Kelola Jadwal</h1>
                    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-[6px] text-[24px] font-bold text-white">
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px] rounded-tl-lg">
                          <h1>Periode</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Waktu Order</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Waktu Pengiriman</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px] rounded-tr-lg w-[160px]">
                          <h1>Aksi</h1>
                        </div>
                        {timetables.map((timetable) => (
                          <React.Fragment key={timetable.id}>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[16px] font-semibold text-black">{number++}</div>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[16px] font-semibold text-black">{timetable.day_order}</div>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[16px] font-semibold text-black">{timetable.day_delivery}</div>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[16px] font-semibold text-black">
                                <div className="flex w-full px-[12px] h-auto justify-center">
                                    <Link href={`/admin/timetable/${timetable.id}/edit`} className="bg-[#DB5611] py-[6px] flex justify-center rounded-lg w-[55px]">
                                        <Image src={Edit} alt="cart" />
                                    </Link>
                                </div>
                            </div>
                          </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}