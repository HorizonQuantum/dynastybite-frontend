"use client";

import Image from "next/image";
import Logo from "../../../../public/images/logo.png";
import Statistic from "../../../../public/images/statistic_admin.png";
import History from "../../../../public/images/history_admin.png";
import Manage from "../../../../public/images/manage_admin.png";
import Form from "../../../../public/images/form_admin.png";
import Material from "../../../../public/images/material_admin.png";
import Customer from "../../../../public/images/customer_admin.png";
import Logout from "../../../../public/images/logout_admin.png";
import Link from "next/link";

export default function Sidebar(){
    return(
        <div className="grid grid-rows-[auto_1fr_auto] h-[100vh] w-[280px] text-white bg-[#8E281C]">
            <div className="p-[32px] flex flex-col items-center">
                <Image src={Logo} alt="Logo"/>
                <h1 className="font-bold text-[20px]">Dynasty Bite</h1>
            </div>
            <div className="px-[32px]">
                <ul>
                    <Link href={`/admin/dashboard`}>
                        <li className="flex gap-[12px] items-center p-[10px] rounded-lg mb-[12px]">
                            <Image src={Statistic} alt="Statistic"/>
                            <p className="font-semibold text-[14px]">Dashboard</p>
                        </li>
                    </Link>
                    <Link href={`/admin/material`}>
                        <li className="flex gap-[12px] items-center p-[10px] rounded-lg mb-[12px]">
                            <Image src={Material} alt="Material"/>
                            <p className="font-semibold text-[14px]">Menu Produk</p>
                        </li>
                    </Link>
                    <Link href={`/admin/form`}>
                        <li className="flex gap-[12px] items-center p-[10px] rounded-lg mb-[12px]">
                            <Image src={Form} alt="Form"/>
                            <p className="font-semibold text-[14px]">Form Pesanan</p>
                        </li>
                    </Link>
                    <Link href={`/admin/history`}>
                        <li className="flex gap-[12px] items-center p-[10px] rounded-lg mb-[12px]">
                            <Image src={History} alt="History"/>
                            <p className="font-semibold text-[14px]">History Pesanan</p>
                        </li>
                    </Link>
                    <Link href={`/admin/timetable`}>
                        <li className="flex gap-[12px] items-center p-[10px] rounded-lg mb-[12px]">
                            <Image src={Manage} alt="Manage"/>
                            <p className="font-semibold text-[14px]">Kelola Jadwal</p>
                        </li>
                    </Link>
                    <Link href={`/admin/customer`}>
                        <li className="flex gap-[12px] items-center p-[10px] rounded-lg mb-[12px]">
                            <Image src={Customer} alt="Customer"/>
                            <p className="font-semibold text-[14px]">Data Pelanggan</p>
                        </li>
                    </Link>
                </ul>
            </div>
            <div className="p-[32px]">
                <ul>
                    <Link href={`#`}>
                        <li className="flex gap-[12px] items-center p-[10px] rounded-lg mb-[12px]">
                            <Image src={Logout} alt="Logout"/>
                            <p className="font-semibold text-[14px]">Logout</p>
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
}