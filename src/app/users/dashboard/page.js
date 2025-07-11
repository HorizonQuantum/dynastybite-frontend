"use client"

import Nav from "@/app/components/nav/page";
import Promo from "@/app/components/banner/page";
import Address from "../../../../public/images/address.png";
import Gmail from "../../../../public/images/gmail.png";
import Whatsapp from "../../../../public/images/whatsapp.png";
import Image from "next/image";
import Plus from "../../../../public/images/button_plus.png";
import Minus from "../../../../public/images/button_minus.png";
import Box from "../../../../public/images/box.png";
import Calendar from "../../../../public/images/calendar.png";
import Button from "../../components/button/page";
import information from "../../../../public/images/information.png";
import React from "react";
import { useState, useEffect } from "react";

export default function Dashboard(){
    const [user, setUser] = useState(null);

    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser){
        const parsed = JSON.parse(storedUser);
        console.log("User dari localStorage:", parsed);
        setUser(parsed);
      }
    }, []);
    
    const login = true;

    const [sisaKuota, setSisaKuota] = useState(150);
    const [productType, setProductType] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [address, setAddress] = useState("");
    const [tanggalKirim, setTanggalKirim] = useState("");
    const [orderType, setOrderType] = useState(0);
    const [timetables, setTimetables] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menus, setMenus] = useState([]);
    const [customer, setCustomer] = useState("");
    const [orders, setOrders] = useState({
      total_price: 0,
      note_order: "",
      user_id: user?.id || null,
      type_order_id: 0,
    })
    let [totalPcsInCart, setTotalPcsInCart] = useState(0);

    const [cart, setCart] = useState([]);
    const [popupData, setPopupData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

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

          fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/order/${popupData.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
            },
          })
            .then((res) => {
              if (res.ok) {
                alert("Waktu pembayaran telah habis, pesanan dibatalkan.");
                setPopupData(null);
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



    const handleCart = (menu) => {
      const totalPcsSekarang = cart.reduce(
        (sum, item) => sum + item.quantity * item.pcs,
        0
      );

      const existing = cart.find((item) => item.menu_id === menu.id);
      const tambahanPcs = menu.pcs;

      if (totalPcsSekarang + tambahanPcs > sisaKuota) {
        alert("Pemesanan melebihi batas kuota PO saat ini!");
        return;
      }

      if (existing) {
        const updated = cart.map((item) =>
          item.menu_id === menu.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        );
        setCart(updated);
      } else {
        setCart([
          ...cart,
          {
            menu_id: menu.id,
            category_id: menu.category_id,
            name: menu.name,
            price: menu.price,
            quantity: 1,
            total: menu.price,
            pcs: menu.pcs,
          },
        ]);
      }
    };



    const handlePlus = (menu_id) => {
      const existing = cart.find((item) => item.menu_id === menu_id);
      if (!existing) return;

      const totalPcsSekarang = cart.reduce(
        (sum, item) => sum + item.quantity * item.pcs,
        0
      );

      const tambahanPcs = existing.pcs;

      if (totalPcsSekarang + tambahanPcs > sisaKuota) {
        alert("Pemesanan melebihi batas kuota PO saat ini!");
        return;
      }

      const updated = cart.map((item) =>
        item.menu_id === menu_id
          ? {
              ...item,
              quantity: item.quantity + 1,
              total: (item.quantity + 1) * item.price,
            }
          : item
      );

      setCart(updated);
    };

    const handleMinus = (menu_id) => {
      const existing = cart.find((item) => item.menu_id === menu_id);
      if(existing){
        if(existing.quantity <= 1){
          setCart(cart.filter((item) => item.menu_id !== menu_id))
        }else{
          const updated = cart.map((item) => 
            item.menu_id === menu_id 
          ? {
            ...item, 
            quantity: item.quantity - 1,
            total: (item.quantity - 1) * item.price,
            pcs: item.pcs,
          } : item,
        );
        setCart(updated);

      }
      }
    }

    useEffect(() => {
      const total = cart.reduce((sum, item) => sum + item.pcs * item.quantity, 0);
      setTotalPcsInCart(total);
    }, [cart]);

    const totalPrice = cart.reduce((acc, item) => acc + item.total, 0);
    let dp = totalPrice * 30 / 100;

    const handleOrder = async () => {
      console.log("Cart final sebelum kirim:", cart);

      console.log("Payment Method:", paymentMethod);
      if (!user || cart.length === 0 || !orderType || !tanggalKirim || !address){
        alert("Lengkapi semua data terlebih dahulu");
        return;
      }
      const payload = {
        user_id: user.id,
        address,
        product_type_id: Number(productType),
        payment_method_id: Number(paymentMethod),
        delivery_date: tanggalKirim,
        total_price: totalPrice,
        note_order: orders.note_order || "-", 
        type_order_id: Number(orderType), 
        items: cart.map((item) => ({
          menu_id: item.menu_id,
          quantity: item.quantity,
          price: item.price,
          pcs: item.pcs,
          total: item.total,
        }))
      };

      try {
        const res = await fetch("https://dynastybite-backend-production-7527.up.railway.app/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept : "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok) {
          alert("Pesanan berhasil dibuat!");
          setPopupData({
            id: data.data.id,
            payment_code: data.data.payment_code,
            expired_at: data.data.expired_at,
            amount: paymentMethod == 1 ? totalPrice : dp,
          });
          setShowPopup(true);
          setProductType(0);
          setPaymentMethod(0);
          setOrders({
            total_price: 0,
            note_order: "",
            user_id: user.id,
            type_order_id: 0,
          });

          setCart([]);
          setOrderType("");
          setTanggalKirim(getTanggalPengirimanRegular());
        } else {
          console.error("Gagal:", data);
          alert("Gagal membuat pesanan.");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Terjadi kesalahan.");
      }
    }

    const formatRupiah = (number) => new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

    useEffect(()=>{
      if(user){
        setAddress(user.address || "");
        setCustomer(user.username || "")
      }
    }, [user]);

    useEffect(() => {
      fetch("https://dynastybite-backend-production-7527.up.railway.app/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data);
      })
      .catch((err) => console.error("Gagal memuat menu", err))
      
      fetch("https://dynastybite-backend-production-7527.up.railway.app/api/timetable")
      .then((res) => res.json())
      .then((data) => setTimetables(data))
      .catch((err) => console.error("Gagal memuat jadwal", err))

      fetch("https://dynastybite-backend-production-7527.up.railway.app/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Gagal memuat kategori:", err))
    }, []);

      
    useEffect(() => {
      if (!tanggalKirim || !orderType) return;

      const fetchKuota = async () => {
        try {
          const url =
            orderType === 1
              ? `https://dynastybite-backend-production-7527.up.railway.app/api/custom-quota?tanggal=${tanggalKirim}&user_id=${user.id}`
              : `https://dynastybite-backend-production-7527.up.railway.app/api/regular-quota?tanggal=${tanggalKirim}`;

          const res = await fetch(url);
          const data = await res.json();

          setSisaKuota(data.remaining_quota || 0);
        } catch (err) {
          console.error("Gagal fetch kuota otomatis:", err);
        }
      };

      fetchKuota();
    }, [orderType, tanggalKirim, user?.id]);


    if (!user) return <div>Memuat...</div>
    return(
      <div>
            <Nav login={login}/>
            <div className="grid grid-cols-[auto_1280px_auto] bg-[#F8F0DF] py-[24px]">
                <div></div>
                <div>
                    <Promo/>
                </div>
                <div></div>
            </div>
            
            <div className="bg-[#F8F0DF] py-[24px] px-4">
                <div className="max-w-[1280px] mx-auto flex flex-row gap-6 items-start relative">
                  <div className="max-w-[880px] py-[24px]">
                    <div className="flex flex-col gap-6">
                      <div className="flex-1">
                        <div className="mb-10">
                          {categories.map((cat) => (
                            <div key={cat.id} className="mb-12 w-full">
                              <div className="flex h-auto gap-4">
                                <h1 className="text-2xl font-bold mb-4">{cat.name}</h1>
                              </div>
                              {/* Horizontal Scrollable Menu List */}
                              <div className="flex gap-[24px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
                                {menus
                                  .filter((menu) => menu.category_id === cat.id)
                                  .map((menu) => (
                                    <div
                                      key={menu.id}
                                      className="bg-[#F8F0DF] rounded-lg p-4 flex-shrink-0 w-[250px] min-w-[250px]"
                                      style={{
                                        boxShadow:
                                          "10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4",
                                      }}
                                    >
                                      <Image
                                        src={`https://dynastybite-backend-production-7527.up.railway.app/storage/public/images/${menu.image}`}
                                        alt="Menu Image"
                                        width={300}
                                        height={300}
                                        priority
                                        className="object-cover rounded"
                                      />
                                      <h2 className="font-bold text-lg mt-2">{menu.name}</h2>
                                      <p className="text-sm text-[12px] py-[12px]">{menu.description}</p>
                                      <div className="grid grid-cols-[1fr_40%] h-[30px] mt-2">
                                        <div className="font-bold text-[20px]">
                                          <h3>Rp.{menu.price},00</h3>
                                        </div>
                                        <div className="flex">
                                          <div className="h-auto w-[6px] bg-black mx-[12px]"></div>
                                          <button
                                            type="button"
                                            onClick={() => handleCart(menu)}
                                            className="bg-[#DB5611] w-full py-[8px] flex justify-center rounded-lg"
                                          >
                                            <Image src={`/images/cart.png`} width={20} height={20} alt="Cart" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="font-bold text-[32px] text-center mb-[32px]">
                          <h1>Jadwal PO</h1>
                        </div>
                        <div className="grid grid-cols-3 gap-[12px] text-[24px] font-bold text-white">
                          <div className="bg-[#8E281C] flex items-center justify-center h-[80px] rounded-lg">
                            <h1>Periode</h1>
                          </div>
                          <div className="bg-[#8E281C] flex items-center justify-center h-[80px] rounded-lg">
                            <h1>Waktu Order</h1>
                          </div>
                          <div className="bg-[#8E281C] flex items-center justify-center h-[80px] rounded-lg">
                            <h1>Waktu Pengiriman</h1>
                          </div>
                            {timetables.map((timetable) => (
                            <React.Fragment key={timetable.id}>
                              <div className="h-[80px] bg-[#fde5af] mt-[12px] flex justify-center items-center text-[20px] font-bold text-black rounded-lg">{timetable.id}</div>
                              <div className="h-[80px] bg-[#fde5af] mt-[12px] flex justify-center items-center text-[20px] font-bold text-black rounded-lg">{timetable.day_order}</div>
                              <div className="h-[80px] bg-[#fde5af] mt-[12px] flex justify-center items-center text-[20px] font-bold text-black rounded-lg">{timetable.day_delivery}</div>
                            </React.Fragment>
                            ))}
                          </div>
                          <div className="p-[24px] mt-[32px] bg-[#F8F0DF] rounded-lg" style={{boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}>
                            <div className="flex text-black font-bold mb-[16px]">
                              <Image src={information} alt="information" height={24}/>
                              <span className="ml-[12px]">Informasi</span>
                            </div>
                            <div className="font-normal text-[14px]">
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                  

                    {/* Kolom kanan - sticky */}
                    <div className="w-[400px] h-fit sticky top-[75px]">
                    <div className="bg-white shadow-md py-[32px] px-[24px]">
                        <div className="text-center font-bold text-[24px] mb-[32px]">
                          <h1>Buat Pesanan</h1>
                          <h3 className="text-[10px] mt-1 italic text-gray-600">Atas nama : {customer}</h3>
                        </div>
                        <div className="font-bold text-[12px] mt-[16px] mb-[12px]">
                          <h1>Tipe Pesanan</h1>
                        </div>
                        <div className="flex justify-between gap-[24px]">
                          <button
                            type="button"
                            onClick={() => {
                              setOrderType(1);
                              setTanggalKirim("");
                            }}
                            className={`bg-[#E9B75A] w-full rounded-[4px] h-[80px] flex justify-center items-center flex-col font-bold text-[16px] ${
                              orderType === 1 ? "ring-2 ring-amber-700" : ""
                            }`}
                          >
                            <Image src={Calendar} alt="Calendar" />
                            <h2>Custom Order</h2>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOrderType(2);
                              setTanggalKirim(getTanggalPengirimanRegular());
                            }}
                            className={`bg-[#A3B18A] w-full rounded-[4px] h-[80px] flex justify-center items-center flex-col font-bold text-[16px] ${
                              orderType === 2 ? "ring-2 ring-emerald-700" : ""
                            }`}
                          >
                            <Image src={Box} alt="Box" />
                            <h2>Regular</h2>
                          </button>
                        </div>

                        <div className="text-[12px]">
                          <h1 className="font-bold mb-[8px] mt-[24px]">Tanggal Pengiriman</h1>
                          <div>
                            <input
                              type="date"
                              placeholder="--/--/--"
                              value={tanggalKirim}
                              onChange={(e) => setTanggalKirim(e.target.value)}
                              disabled={orderType === 2}
                              className={`bg-[#EBEBEB] w-full h-[40px] rounded-[4px] p-[12px] focus:outline-none ${
                                orderType === 2 ? "opacity-60 cursor-not-allowed" : ""
                              }`}
                            />
                            {orderType === 1 && (
                              <p className="text-[10px] mt-1 italic text-gray-600">
                                Tanggal pengiriman minimal 7 hari setelah pemesanan.
                              </p>
                            )}
                            {orderType === 2 && (
                              <p className="text-[10px] mt-1 italic text-gray-600">
                                Tanggal otomatis ditentukan berdasarkan jadwal PO.
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between text-[12px] font-bold w-full mb-[12px] mt-[32px]">
                          <div>Sisa kuota pada periode ini</div>
                          <div>{sisaKuota - totalPcsInCart}</div>
                        </div>
                        <form>
                          {cart.map((carts, index) => (
                          <div key={index} className="grid grid-cols-[1fr_1fr_auto_15%] ml-[8px] mb-[12px] text-[12px] h-auto items-center">
                            <h2>{carts.name}</h2>
                            {categories
                            .filter((cat)=>cat.id === carts.category_id)
                            .map((cat) => (
                              <div key={cat.id}>{cat.name}</div>
                            ))}
                              <div className="flex justify-center">
                                <button onClick={() => handleMinus(carts.menu_id)} type="button"><Image src={Minus} alt="minus"/></button>
                                <p className="w-[20px] text-center">{carts.quantity}</p>
                                <button onClick={() => handlePlus(carts.menu_id)} type="button"><Image src={Plus} alt="plus"/></button>
                              </div>
                            <h2 className="text-end">{carts.total}</h2>
                          </div>
                          ))}
                        </form>
                        <div className="flex justify-between font-bold text-[16px] mt-[12px]">
                          <h2>Total Bayar</h2>
                          <h2>{formatRupiah(totalPrice)}</h2>
                        </div>
                        <div className="text-[12px]">
                          <h1 className="font-bold mb-[8px] mt-[12px]">Tipe Produk</h1>
                          <div>
                            <select 
                              value={productType}
                              onChange={(e) => setProductType(parseInt(e.target.value))}
                              className="bg-[#EBEBEB] w-full h-[40px] rounded-[4px] p-[12px] focus:outline-none"
                            >
                              <option value={0}>Pilih Tipe Produk</option>
                              <option value={1}>Ready to eat</option>
                              <option value={2}>Frozen</option>
                            </select>
                          </div>
                        </div>

                        <div className="text-[12px]">
                          <h1 className="font-bold mb-[8px] mt-[12px]">Alamat</h1>
                          <div>
                            <textarea
                              onChange={(e) => setAddress(e.target.value)}
                              value={address}
                              placeholder="Masukkan alamat pengiriman" 
                              className="bg-[#EBEBEB] w-full h-[60px] rounded-[4px] p-[12px] focus:outline-none"/>
                          </div>
                        </div>
                        <div className="text-[12px]">
                          <h1 className="font-bold mb-[8px] mt-[12px]">Catatan Pesanan</h1>
                          <textarea
                            onChange={(e) =>
                              setOrders((prev) => ({ ...prev, note_order: e.target.value }))
                            }
                            value={orders.note_order}
                            placeholder="Misal: jangan pedas, atau tambahkan saus"
                            className="bg-[#EBEBEB] w-full h-[60px] rounded-[4px] p-[12px] focus:outline-none"
                          />
                        </div>

                        <div className="text-[12px]">
                          <h1 className="font-bold mb-[8px] mt-[12px]">Tipe Pembayaran</h1>
                          <div>
                            <select
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(parseInt(e.target.value))}
                              placeholder="Pilih jenis pembayaran" 
                              className="bg-[#EBEBEB] w-full h-[40px] rounded-[4px] p-[12px] focus:outline-none"
                            >
                              <option value={0}>Pilih Metode Pembayaran</option>
                              <option value={1}>Cash - {formatRupiah(totalPrice)}</option>
                              <option value={2}>DP - {formatRupiah(dp)}</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-[32px]">
                          <Button color={"#E9B75A"} onClick={handleOrder}>Buat Pesanan</Button>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
              <div className="grid grid-cols-[auto_1280px_auto] bg-[#8E281C] text-white font-bold text-[12px] py-[32px]">
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
            {showPopup && popupData && (
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-lg bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-8 w-[500px] text-center shadow-xl">
                <h2 className="text-xl font-bold mb-6">Informasi Pembayaran</h2>
                <p className="text-sm mb-2">Silakan selesaikan pembayaran Anda sebelum waktu berakhir.</p>
                <div className="text-left text-sm mb-6">
                  <p className="mb-[12px]"><strong>Metode:</strong> {paymentMethod == 1 ? "Cash (Full)" : "DP 30%"}</p>
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

function getTanggalPengirimanRegular() {
  const sekarang = new Date();
  const hari = sekarang.getDay();

  let kirim = new Date();

  if (hari >= 0 && hari <= 2) {
    
    kirim.setDate(sekarang.getDate() + (3 - hari));
  } else if (hari === 3 || hari === 4) {
    
    kirim.setDate(sekarang.getDate() + (5 - hari));
  } else {
    
    const offset = hari === 5 ? 2 : 1;
    kirim.setDate(sekarang.getDate() + offset);
  }

  return kirim.getFullYear() + '-' +
       String(kirim.getMonth() + 1).padStart(2, '0') + '-' +
       String(kirim.getDate()).padStart(2, '0');
}

