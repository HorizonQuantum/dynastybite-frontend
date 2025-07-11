"use client"

import Nav from "@/app/components/nav/page";
import Image from "next/image";
import Location from "../../../../public/images/location.png";
import Cooking from "../../../../public/images/cooking.png";
import Delivery from "../../../../public/images/delivery.png";
import Whatsapp from "../../../../public/images/whatsapp.png";
import Gmail from "../../../../public/images/gmail.png";
import Address from "../../../../public/images/address.png";
import { useState, useEffect, useCallback } from "react";

export default function Order() {
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
    const [popupTimeLeft, setPopupTimeLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

    // Format waktu countdown
    const formatTime = (seconds) => {
        if (seconds <= 0) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Format mata uang
    const formatRupiah = (number) => new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    }).format(number);

    // Fungsi untuk menghapus order
    const deleteOrder = useCallback(async (orderId) => {
        try {
            const res = await fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order/${orderId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                },
            });

            if (res.ok) {
                setOrders(prev => prev.filter(o => o.id !== orderId));
                setOrderItems(prev => prev.filter(item => item.order_id !== orderId));
                return true;
            }
            return false;
        } catch (err) {
            console.error("Gagal menghapus pesanan:", err);
            return false;
        }
    }, []);

    // Countdown untuk order list
    useEffect(() => {
        if (!orders || orders.length === 0) return;

        const updateCountdowns = () => {
            const now = new Date().getTime();
            const newCountdowns = {};
            let needUpdate = false;

            orders.forEach(order => {
                const expire = new Date(order.expired_at).getTime();
                const distance = Math.floor((expire - now) / 1000);
                newCountdowns[order.id] = distance > 0 ? distance : 0;

                // Cek jika order kadaluarsa
                if (distance <= 0 && orderCountdowns[order.id] > 0) {
                    needUpdate = true;
                    deleteOrder(order.id).then(success => {
                        if (success) {
                            console.log(`Order ${order.id} expired and deleted`);
                        }
                    });
                }
            });

            setOrderCountdowns(prev => ({ ...prev, ...newCountdowns }));

            // Update popup jika sedang terbuka
            if (popupData && popupData.id in newCountdowns) {
                setPopupTimeLeft(newCountdowns[popupData.id]);
                setIsExpired(newCountdowns[popupData.id] <= 0);
            }
        };

        const interval = setInterval(updateCountdowns, 1000);
        return () => clearInterval(interval);
    }, [orders, deleteOrder, popupData, orderCountdowns]);

    // Countdown khusus untuk popup
    useEffect(() => {
        if (!popupData) return;

        const updatePopupCountdown = () => {
            const now = new Date().getTime();
            const expire = new Date(popupData.expired_at).getTime();
            const distance = Math.floor((expire - now) / 1000);

            setPopupTimeLeft(distance);
            setIsExpired(distance <= 0);

            if (distance <= 0) {
                deleteOrder(popupData.id).then(success => {
                    if (success) {
                        setShowPopup(false);
                        setPopupData(null);
                    }
                });
            }
        };

        // Jalankan segera pertama kali
        updatePopupCountdown();

        const interval = setInterval(updatePopupCountdown, 1000);
        return () => clearInterval(interval);
    }, [popupData, deleteOrder]);

    // Load data user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
        }
    }, []);

    // Set user data
    useEffect(() => {
        if (user) {
            setUserId(user.id || "");
            setCustomer(user.username || "");
        }
    }, [user]);

    // Load semua data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoints = [
                    'order', 'order_item', 'menu', 
                    'category', 'type_order', 
                    'payment_method', 'order_status'
                ];

                const responses = await Promise.all(
                    endpoints.map(endpoint => 
                        fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/${endpoint}`)
                            .then(res => res.json())
                    )
                );

                const [
                    ordersData, orderItemsData, menusData, 
                    categoriesData, typeOrdersData, 
                    paymentMethodsData, orderStatusData
                ] = responses;

                setOrders(ordersData);
                setOrderItems(orderItemsData);
                setMenus(menusData);
                setCategories(categoriesData);
                setTypeOrders(typeOrdersData);
                setPaymentMethods(paymentMethodsData);
                setOrderStatus(orderStatusData);

                // Inisialisasi countdown
                const initialCountdowns = {};
                const now = new Date().getTime();
                
                ordersData.forEach(order => {
                    const expire = new Date(order.expired_at).getTime();
                    const distance = Math.floor((expire - now) / 1000);
                    initialCountdowns[order.id] = distance > 0 ? distance : 0;
                });

                setOrderCountdowns(initialCountdowns);
            } catch (err) {
                console.error("Gagal memuat data:", err);
                alert("Terjadi kesalahan saat memuat data");
            }
        };

        fetchData();
    }, []);

    const login = true;

    return (
        <div className="bg-[#F8F0DF]">
            <Nav login={login} />
            {/* Header dengan status order */}
            <div className="grid grid-cols-[auto_1280px_auto]">
                <div></div>
                <div className="flex relative justify-center h-[144px] items-center">
                    <div className="h-[2px] w-[360px] bg-black absolute"></div>
                    <div className="flex absolute gap-[128px] top-[46px]">
                        <div className="flex flex-col items-center">
                            <Image src={Cooking} alt="Cooking" />
                            <label>Diproses</label>
                        </div>
                        <div className="flex flex-col items-center">
                            <Image src={Delivery} alt="Delivery" />
                            <label>Dikirim</label>
                        </div>
                        <div className="flex flex-col items-center">
                            <Image src={Location} alt="Location" />
                            <label>Sampai</label>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>

            {/* Daftar order */}
            <div className="grid grid-cols-[auto_1280px_auto] mb-[32px]">
                <div></div>
                <div className="flex flex-col">
                    {orders
                        .filter((order) => order.user_id === userId)
                        .map((order) => (
                            <div key={order.id}>
                                {orderStatus
                                    .filter((status) => status.id === order.status_id && [1, 2, 3, 4].includes(status.id))
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
                                                                                .filter((category) => category.id === menu.category_id)
                                                                                .map((category) => (
                                                                                    <div key={category.id} className="grid grid-cols-4 text-[14px] mb-[12px]">
                                                                                        <div>{menu.name}</div>
                                                                                        <div className="text-end">{category.name}</div>
                                                                                        <div className="text-end">{orderItem.quantity}</div>
                                                                                        <div className="text-end">{formatRupiah(orderItem.price)}</div>
                                                                                    </div>
                                                                                ))}
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        ))}
                                                    {typeOrders
                                                        .filter((typeOrder) => typeOrder.id === order.type_order_id)
                                                        .map((typeOrder, index) => (
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
                                                                <p className="text-[14px] font-semibold">
                                                                    {paymentMethod.name} - {formatRupiah(order.total_price)}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    <p className={`font-semibold ${orderCountdowns[order.id] > 0 ? 'text-red-700' : 'text-gray-500'}`}>
                                                        <strong>Sisa Waktu:</strong> {formatTime(orderCountdowns[order.id])}
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
                                                        const confirmation = confirm("Apakah anda yakin ingin membatalkan order ini?");
                                                        if (confirmation) {
                                                            e.preventDefault();
                                                            try {
                                                                const success = await deleteOrder(order.id);
                                                                if (success) {
                                                                    alert("Pesanan berhasil dibatalkan");
                                                                }
                                                            } catch (err) {
                                                                console.error("Gagal membatalkan pesanan:", err);
                                                            }
                                                        }
                                                    }}
                                                    className="bg-[#8E281C] w-full py-[12px] flex justify-center rounded-lg font-bold text-[20px] text-white"
                                                >
                                                    Batalkan
                                                </button>
                                            </div>
                                            <div></div>
                                        </div>
                                    ))}
                            </div>
                        ))}
                </div>
                <div></div>
            </div>

            {/* Footer kontak */}
            {orders.length > 0 && (
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
            )}

            {/* Popup pembayaran */}
            {showPopup && popupData && (
                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-lg bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 w-[500px] text-center shadow-xl">
                        <h2 className="text-xl font-bold mb-6">Informasi Pembayaran</h2>
                        <p className="text-sm mb-2">Silakan selesaikan pembayaran Anda sebelum waktu berakhir.</p>
                        <div className="text-left text-sm mb-6">
                            <p className="mb-[12px]">
                                <strong>Metode:</strong> {popupData.amount === popupData.total_price ? "Cash (Full)" : "DP 30%"}
                            </p>
                            <p className="mb-[12px]">
                                <strong>Jumlah:</strong> {formatRupiah(popupData.amount)}
                            </p>
                            <p className="mb-[12px]">
                                <strong>Kode Pembayaran:</strong> {popupData.payment_code}
                            </p>
                            <p className={`mb-[12px] font-semibold ${isExpired ? 'text-gray-500' : 'text-red-700'}`}>
                                <strong>Sisa Waktu:</strong> {isExpired ? "Kadaluarsa" : formatTime(popupTimeLeft)}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <button 
                                disabled={isExpired} 
                                className={`${isExpired ? 'bg-gray-400' : 'bg-[#A3B18A]'} text-white px-4 py-2 rounded mt-2`}
                            >
                                Bayar Sekarang
                            </button>
                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    setPopupData(null);
                                }}
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