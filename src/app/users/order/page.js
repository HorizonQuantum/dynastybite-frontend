"use client"

// di file .jsx
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import Nav from "@/app/components/nav/page";
import Image from "next/image";
import Location from "../../../../public/images/location.png";
import Cooking from "../../../../public/images/cooking.png";
import Delivery from "../../../../public/images/delivery.png";
import Whatsapp from "../../../../public/images/whatsapp.png";
import Gmail from "../../../../public/images/gmail.png";
import Address from "../../../../public/images/address.png";
import { useState, useEffect } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Order(){
    const [user, setUser] = useState(null);
    const [customer, setCustomer] = useState("");
    const [userId, setUserId] = useState("");
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [typeOrders, setTypeOrders] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);

    const [orderCountdowns, setOrderCountdowns] = useState({});

    const [popupData, setPopupData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);
    
useEffect(() => {
  if (!orders || orders.length === 0) return;

  orders.forEach(order => {
    console.log("Original expired_at string:", order.expired_at);
  });
}, [orders]);

    useEffect(() => {
  if (!orders || orders.length === 0) return;

  const now = new Date();
  console.log("Waktu lokal browser:", now.toString());
  console.log("Waktu UTC browser:", now.toISOString());
  
  orders.forEach(order => {
    const now = dayjs().tz("Asia/Jakarta");
    const expire = dayjs.tz(order.expired_at, "Asia/Jakarta");
    const distance = expire.diff(now, "second");

    console.log("NOW      :", now.format());
    console.log("EXPIRED  :", expire.format());
    console.log("DISTANCE :", distance);


  });
}, [orders]);
 
    useEffect(() => {
    if (!orders || orders.length === 0) return;

    const updateCountdowns = () => {
        const now = dayjs().tz("Asia/Jakarta"); // pastikan waktu lokal sesuai server
        const newCountdowns = {};

        orders.forEach((order) => {
        const expire = dayjs(order.expired_at); // ini sudah dalam +07:00
        const distance = expire.diff(now, "second");

        newCountdowns[order.id] = distance > 0 ? distance : 0;
        });

        setOrderCountdowns(newCountdowns);

        orders.forEach((order) => {
        const distance = newCountdowns[order.id];
        if (distance <= 0) {
            console.log("Countdown selesai, hapus order id:", order.id);
            setTimeLeft(0);
            setIsExpired(true);

            fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order/${order.id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
            })
            .then((res) => {
                if (res.ok) {
                alert("Waktu pembayaran telah habis, pesanan dibatalkan.");
                setPopupData(null);
                setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));
                setOrderItems((prevItems) => prevItems.filter((item) => item.order_id !== order.id));
                } else {
                console.warn("Pesanan tidak berhasil dihapus otomatis");
                }
            })
            .catch((err) => {
                console.error("Gagal menghapus pesanan otomatis:", err);
            });
        }
        });
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
    }, [orders]);

    useEffect(() => {
      if (!popupData) {
        console.log("popupData kosong, tidak menghitung countdown");
        return;
      }

      console.log("Mulai countdown dari:", popupData.expired_at);

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expireTime = new Date(popupData.expired_at).getTime();
        const distance = Math.floor((expireTime - now) / 1000);

        console.log("Distance:", distance);

        if (distance <= 0) {
          console.log("Countdown selesai, waktu habis");
          clearInterval(interval);
          setTimeLeft(0);
          setIsExpired(true);

          fetch(`https://dynastybite-backend-production-7527.up.railway.app/order/${popupData.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
            },
          })
            .then((res) => {
              if (res.ok) {
                alert("Waktu pembayaran telah habis, pesanan dibatalkan.");
                setPopupData(null);
                setOrders((prevOrders) => prevOrders.filter((o) => o.id !== popupData.id));
                setOrderItems((prevItems) => prevItems.filter((item) => item.order_id !== popupData.id));
              } else {
                console.warn("Pesanan tidak berhasil dihapus otomatis");
              }
            })
            .catch((err) => {
              console.error("Gagal menghapus pesanan otomatis:", err);
            });
        } else {
          setTimeLeft(distance);
          setIsExpired(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [popupData]);

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

    useEffect(() => {
        if(user){
             setUserId(user.id || "");
             setCustomer(user.username || "");
        }
    }, [user])

    useEffect(() => {
        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order`)
        .then((res)=>res.json())
        .then((data)=>setOrders(data))
        .catch((err)=> {
            console.error("Gagal memuat pesanan:", err);
            alert(err);
        })

        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order_item`)
        .then((res)=>res.json())
        .then((data)=>setOrderItems(data))
        .catch((err)=> {
            console.error("Gagal memuat pesanan:", err);
            alert(err);
        })

        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/menu`)
        .then((res)=>res.json())
        .then((data)=>setMenus(data))
        .catch((err)=> {
            console.error("Gagal memuat pesanan:", err);
            alert(err);
        })

        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/category`)
        .then((res)=>res.json())
        .then((data)=>setCategories(data))
        .catch((err)=> {
            console.error("Gagal memuat pesanan:", err);
            alert(err);
        })

        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/type_order`)
        .then((res)=>res.json())
        .then((data)=>setTypeOrders(data))
        .catch((err)=> {
            console.error("Gagal memuat pesanan:", err);
            alert(err);
        })

        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/payment_method`)
        .then((res)=>res.json())
        .then((data)=>setPaymentMethods(data))
        .catch((err)=> {
            console.error("Gagal memuat pesanan:", err);
            alert(err);
        })

        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order_status`)
        .then((res)=>res.json())
        .then((data)=>setOrderStatus(data))
        .catch((err)=> {
            console.error("Gagal memuat pesanan:", err);
            alert(err);
        })
    }, []);


    const login = true;
    return(
        <div className="bg-[#F8F0DF]">
            <Nav login={login}/>
            <div className="grid grid-cols-[auto_1280px_auto]">
                <div></div>
                <div className="flex relative justify-center h-[144px] items-center">
                    <div className="h-[2px] w-[360px] bg-black absolute"></div>
                    <div className="flex absolute gap-[128px] top-[46px]">
                        <div>
                            <Image src={Cooking} alt="Cooking"/>
                            <label>Diproses</label>
                        </div>
                        <div>
                            <Image src={Delivery} alt="Delivery"/>
                            <label>Dikirim</label>
                        </div>
                        <div>
                            <Image src={Location} alt="Location"/>
                            <label>Sampai</label>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
            <div className="grid grid-cols-[auto_1280px_auto] mb-[32px]">
                <div></div>
                <div className="flex flex-col">
                    {orders
                    .filter((order) => order.user_id === userId)
                    .map((order) => (
                    <div key={order.id}>
                        {orderStatus
                        .filter((status) => status.id === order.status_id && [1,2,3,4].includes(status.id))
                        .map((status) => (
                        <div key={status.id} className="bg-white grid grid-cols-[auto_650px_auto] py-[32px] rounded-lg mb-[32px]">
                            <div></div>
                            <div>
                                    <div>
                                        <h1 className="font-bold text-[24px] text-center mb-[64px]">Pesanan Saya</h1>
                                        <h2 className="font-bold">Atas nama :</h2>
                                        <p className="mb-[32px]">{customer}</p>
                                        <h2 className="font-bold">Daftar Produk yang Dipesan :</h2>
                                        {orderItems
                                        .filter((orderItem) => orderItem.order_id === order.id)
                                        .map((orderItem, index) => (
                                            <div key={index}>
                                                {menus
                                                .filter((menu) => menu.id === orderItem.menu_id)
                                                .map((menu, index) => (
                                                    <div key={index}>
                                                        {categories
                                                        .filter((category)=> category.id === menu.category_id)
                                                        .map((category) => (
                                                        <div key={category.id} className="grid grid-cols-4 text-[14px] mb-[12px]">
                                                            <div>{menu.name}</div>
                                                            <div className="text-end">{category.name}</div>
                                                            <div className="text-end">{orderItem.quantity}</div>
                                                            <div className="text-end">{orderItem.price}</div>
                                                        </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    {typeOrders
                                    .filter((typeOrders) => typeOrders.id === order.type_order_id)
                                    .map((typeOrder, index)=> (
                                        <div key={index}>
                                            <h3 className="font-bold text-[16px] mt-[32px]">Jenis Pesanan</h3>
                                            <h3 className="text-[16px] mb-[32px]">{typeOrder.name}</h3>
                                        </div>
                                    ))}
                                        <div className="mb-[32px]">
                                            <h3 className="font-bold text-[16px] mb-[6px]">Tanggal Pengiriman</h3>
                                            <p className="text-[14px] font-semibold">{order.delivery_date}</p>
                                        </div>
                                        <div className="mb-[32px]">
                                            <h3 className="font-bold text-[16px] mb-[6px]">Alamat Pengiriman</h3>
                                            <p className="text-[14px] font-semibold">{order.address}</p>
                                        </div>
                                        {paymentMethods
                                        .filter((paymentMethod) => paymentMethod.id === order.payment_method_id)
                                        .map((paymentMethod) => (
                                        <div key={paymentMethod.id} className="mb-[32px]">
                                            <h3 className="font-bold text-[16px] mb-[6px]">Jenis Pembayaran</h3>
                                            <p className="text-[14px] font-semibold">{paymentMethod.name} - {formatRupiah(order.total_price)}</p>
                                        </div>
                                        ))}
                                        <p className="text-red-700 font-semibold">
                                            <strong>Sisa Waktu:</strong>{" "}
                                            {orderCountdowns[order.id] > 0
                                                ? `${String(Math.floor(orderCountdowns[order.id] / 60)).padStart(2, '0')}:${String(orderCountdowns[order.id] % 60).padStart(2, '0')}`
                                                : "Kadaluarsa"}
                                        </p>
                                    </div>
                                <button
                                    onClick={() => {
                                        setPopupData({
                                        id: order.id,
                                        payment_code: order.payment_code,
                                        expired_at: order.expired_at,
                                        amount: order.payment_method_id === 1 ? order.total_price : order.total_price * 0.3,
                                        });
                                        setShowPopup(true);
                                    }}
                                    className="bg-[#A3B18A] w-full py-[12px] flex justify-center rounded-lg font-bold text-[20px] text-white mb-[12px]"
                                    >
                                    Lihat Pembayaran
                                </button>
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
                                            setOrderItems((prevItems) => prevItems.filter((item) => item.order_id !== order.id));
                                        } else {
                                            alert("Gagal menghapus: " + data.message);
                                        }
                                        } catch (err) {
                                        console.error("Gagal menghapus user:", err);
                                        }
                                        }
                                    }}
                                    className="bg-[#8E281C] w-full py-[12px] flex justify-center rounded-lg font-bold text-[20px] text-white"
                                >Batalkan</button>
                            </div>
                        </div>
                        ))}
                        <div></div>
                    </div>
                    ))}
                </div>
                <div></div>
            </div>
            {orders.length > 0 && (
                <div className="grid grid-cols-[auto_1280px_auto] bg-[#8E281C] text-white font-bold text-[12px] py-[32px]">
                    <div></div>
                    <div className="grid grid-rows-3 gap-[24px]">
                    <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Whatsapp} alt="Whatsapp" width={24}/>
                        <p>085524976693</p>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Gmail} alt="Gmail"/>
                        <p>dynastybite03@gmail.com</p>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
                        <Image src={Address} alt="Address"/>
                        <p>3517 W. Gray St. Utica, Pennsylvania 57867</p>
                    </div>
                    </div>
                    <div></div>
                </div>
            )}
                {showPopup && popupData && (
                    <div className="fixed top-0 left-0 w-full h-full backdrop-blur-lg bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 w-[500px] text-center shadow-xl">
                        <h2 className="text-xl font-bold mb-6">Informasi Pembayaran</h2>
                        <p className="text-sm mb-2">Silakan selesaikan pembayaran Anda sebelum waktu berakhir.</p>
                        <div className="text-left text-sm mb-6">
                        <p className="mb-[12px]"><strong>Metode:</strong> {paymentMethods == 1 ? "Cash (Full)" : "DP 30%"}</p>
                        <p className="mb-[12px]"><strong>Jumlah:</strong> {formatRupiah(popupData.amount)}</p>
                        <p className="mb-[12px]"><strong>Kode Pembayaran:</strong> {popupData.payment_code}</p>
                        <p className="mb-[12px] text-red-700 font-semibold">
                            <strong>Sisa Waktu:</strong>{" "}
                            {!isExpired
                                ? `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`
                                : "Kadaluarsa"}
                        </p>
                        </div>
                        <div className="flex flex-col">
                        <button disabled={timeLeft === "Waktu habis"} className="bg-[#A3B18A] text-white px-4 py-2 rounded hover:bg-red-600 mt-2">Bayar Sekarang</button>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="bg-[#DB5611] text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
                        >
                            Tutup
                        </button>
                        </div>
                    </div>
                    </div>
                )}
        </div>
    );
}