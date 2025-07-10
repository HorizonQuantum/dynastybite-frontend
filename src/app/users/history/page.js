"use client"

import Nav from "@/app/components/nav/page";
import Download from "../../../../public/images/download.png";
import Deleted from "../../../../public/images/delete.png";
import Image from "next/image";
import Whatsapp from "../../../../public/images/whatsapp.png";
import Gmail from "../../../../public/images/gmail.png";
import Address from "../../../../public/images/address.png";
import { useState, useEffect } from "react";

export default function History(){
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState("");
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);

    const formattedDate = (createdAt) => {
       return new Date(createdAt).toISOString().slice(0, 10)
    };

    const formatRupiah = (number) => new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser){
        const parsed = JSON.parse(storedUser);
        console.log("User dari localStorage:", parsed);
        setUser(parsed);
      }
    }, []);

    useEffect(() =>{
        if(user){
             setUserId(user.id || "");
        }
    })

    useEffect(() => {
        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order`)
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => {
            console.error("Gagal memuat data:", err);
            alert(err);
        });

        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order_status`)
        .then((res) => res.json())
        .then((data) => setOrderStatus(data))
        .catch((err) => {
            console.error("Gagal memuat data:", err);
            alert(err);
        });
    }, [])


    const login = true;

    return(
        <div>
            <Nav login={login}/>
            <div className="grid grid-cols-[auto_1280px_auto] bg-[#F8F0DF]">
                <div></div>
                <div className="my-[32px]">
                    <div className="grid bg-white rounded-lg">
                        <table>
                            <thead className="bg-[#E9B75A] h-[48px] rounded-lg">
                                <tr>
                                    <th className="text-[18px]">Tanggal Pemesanan</th>
                                    <th className="text-[18px]">Tanggal Diterima</th>
                                    <th className="text-[18px]">Nominal</th>
                                    <th className="text-[18px]">Status</th>
                                    <th className="text-[18px]">Aksi</th>
                                </tr>
                            </thead>
                            {orders
                            .filter((order)=> order.user_id === userId)
                            .map(order => (
                                <tbody key={order.id}>
                                    {orderStatus
                                    .filter((status) => status.id === order.status_id && status.id === 5)
                                    .map((status) => (
                                    <tr key={status.id} className="h-[42px]">
                                        <td className="text-center text-[14px]">{formattedDate(order.created_at)}</td>
                                        <td className="text-center text-[14px]">{order.delivery_date}</td>
                                        <td className="text-center text-[14px]">{formatRupiah(order.total_price)}</td>
                                        <td className="text-center text-[14px]">{status.name}</td>
                                        <td className="flex justify-center h-full items-center">
                                            <Image src={Download} alt="Download"/>
                                            <div className="h-[32px] w-[2px] bg-black mx-[8px]"></div>
                                            <button
                                                type="button" 
                                                onClick={async (e) => {
                                                    const confirmation = confirm("Apakah anda yakin ingin membatalkan order ini?")

                                                    if(confirmation){
                                                    e.preventDefault();
                                                    try {
                                                    const res = await fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order/${order.id}`, {
                                                        method: "DELETE",
                                                    });
                                                    const data = await res.json();
                                                    if (res.ok) {
                                                        alert(data.message);
                                                        setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));
                                                    } else {
                                                        alert("Gagal menghapus: " + data.message);
                                                    }
                                                    } catch (err) {
                                                    console.error("Gagal menghapus pesanan:", err);
                                                    }
                                                    }
                                                }}
                                            >
                                                <Image src={Deleted} alt="Deleted"/>
                                            </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
                <div></div>
            </div>
            <div className="grid grid-cols-[auto_1280px_auto] bg-[#8E281C] text-white font-bold text-[12px] py-[32px] absolute w-full bottom-0">
                <div></div>
                    <div className="grid grid-rows-3 gap-[24px]">
                      <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Whatsapp} alt="Whatsapp" width={24}/>
                        <p>085524976693</p>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Gmail} alt="Gamil"/>
                        <p>dynastybite03@gmail.com</p>
                      </div>
                      <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Address} alt="Address"/>
                        <p>3517 W. Gray St. Utica, Pennsylvania 57867</p>
                      </div>
                    </div>
                <div></div>
            </div>
        </div>
    );
}