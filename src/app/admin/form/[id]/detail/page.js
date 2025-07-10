"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/sidebar/page";
import { useRouter } from "next/navigation";

export default function OrderDetailPage() {
  return (
    <div className="flex">
      <div className="grid sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <DetailOrder />
      </div>
    </div>
  );
}

function DetailOrder() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeOrders, setTypeOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, orderRes, itemRes, menuRes, catRes, typeRes, payRes, statusRes] = await Promise.all([
          fetch("http://dynastybite.test/api/user"),
          fetch(`http://dynastybite.test/api/order/${params.id}`),
          fetch("http://dynastybite.test/api/order_item"),
          fetch("http://dynastybite.test/api/menu"),
          fetch("http://dynastybite.test/api/category"),
          fetch("http://dynastybite.test/api/type_order"),
          fetch("http://dynastybite.test/api/payment_method"),
          fetch("http://dynastybite.test/api/order_status"),
        ]);

        const userData = await userRes.json();
        const orderData = await orderRes.json();

        setUser(userData.find((u) => u.id === orderData.user_id)); // ambil user terkait
        setOrders([orderData]);
        setOrderItems(await itemRes.json());
        setMenus(await menuRes.json());
        setCategories(await catRes.json());
        setTypeOrders(await typeRes.json());
        setPaymentMethods(await payRes.json());
        setOrderStatus(await statusRes.json());
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <div className="bg-[#F8F0DF] min-h-screen pb-16">
      {/* Navbar */}
      <nav className="grid grid-cols-2 fixed left-[280px] top-0 right-0 bg-[#E9B75A] h-[75px] z-10">
        <div className="flex h-full items-center">
          <form className="flex">
            <div className="relative ml-[32px]">
              <Image src="/images/search.png" alt="Search" className="absolute left-[12px] top-[12px]" height={24} width={24} />
              <input placeholder="Cari pesanan" className="py-[12px] pl-[48px] pr-[12px] w-[380px] focus:outline-none bg-white rounded-lg" />
            </div>
            <button type="submit" className="px-[24px] py-[12px] bg-[#8E281C] rounded-lg ml-[12px] font-bold text-white">Cari</button>
          </form>
        </div>
        <div className="flex h-full items-center justify-end mr-[32px]">
          <h2 className="font-bold text-white mr-[12px]">{user?.username || "Admin"}</h2>
          <Image src="/images/photo-admin.png" alt="Photo" height={55} width={55} />
        </div>
      </nav>

      {/* Progres Status */}
      <div className="grid grid-cols-[auto_1280px_auto] mt-[75px]">
        <div></div>
        <div className="flex relative justify-center h-[144px] items-center">
          <div className="h-[2px] w-[360px] bg-black absolute"></div>
          <div className="flex absolute gap-[128px] top-[46px]">
            {["cooking", "delivery", "location"].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Image src={`/images/${step}.png`} alt={step} width={55} height={55} />
                <label>{["Diproses", "Dikirim", "Sampai"][idx]}</label>
              </div>
            ))}
          </div>
        </div>
        <div></div>
      </div>

      {/* Detail Pesanan */}
      <div className="grid grid-cols-[auto_1280px_auto]">
        <div></div>
        <div className="flex flex-col">
          {orders.map((order) => {
            const status = orderStatus.find((s) => s.id === order.status_id);
            if (!status) return null;

            return (
              <div key={order.id} className="bg-white grid grid-cols-[auto_650px_auto] py-[32px] rounded-lg my-[32px]">
                <div></div>
                <div>
                  <h1 className="font-bold text-[24px] text-center mb-[64px]">Pesanan Saya</h1>
                  <h2 className="font-bold">Atas nama:</h2>
                  <p className="mb-[32px]">{user?.username || "-"}</p>

                  <h2 className="font-bold">Daftar Produk:</h2>
                  {orderItems
                    .filter((item) => item.order_id === order.id)
                    .map((item, index) => {
                      const menu = menus.find((m) => m.id === item.menu_id);
                      const category = categories.find((c) => c.id === menu?.category_id);
                      return (
                        <div key={index} className="grid grid-cols-4 text-[14px] mb-[12px]">
                          <div>{menu?.name || "-"}</div>
                          <div className="text-end">{category?.name || "-"}</div>
                          <div className="text-end">{item.quantity}</div>
                          <div className="text-end">{formatRupiah(item.price)}</div>
                        </div>
                      );
                    })}

                  <div className="mt-[32px]">
                    <h3 className="font-bold text-[16px] mb-[6px]">Jenis Pesanan</h3>
                    <p className="text-[14px] font-semibold">
                      {typeOrders.find((t) => t.id === order.type_order_id)?.name || "-"}
                    </p>
                  </div>

                  <div className="my-[32px]">
                    <h3 className="font-bold text-[16px] mb-[6px]">Tanggal Pengiriman</h3>
                    <p className="text-[14px] font-semibold">{order.delivery_date}</p>
                  </div>

                  <div className="mb-[32px]">
                    <h3 className="font-bold text-[16px] mb-[6px]">Alamat</h3>
                    <p className="text-[14px] font-semibold">{order.address}</p>
                  </div>

                  <div className="mb-[32px]">
                    <h3 className="font-bold text-[16px] mb-[6px]">Pembayaran</h3>
                    <p className="text-[14px] font-semibold">
                      {paymentMethods.find((p) => p.id === order.payment_method_id)?.name} - {formatRupiah(order.total_price)}
                    </p>
                  </div>

                  {/* Tombol Batalkan */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("Apakah anda yakin ingin membatalkan order ini?")) {
                        try {
                          const res = await fetch(`http://dynastybite.test/api/order/${order.id}`, { method: "DELETE" });
                          const data = await res.json();
                          if (res.ok) {
                            alert(data.message);
                            setOrders([]);
                            setOrderItems((items) => items.filter((i) => i.order_id !== order.id));
                            router.push("/admin/form");
                          } else {
                            alert("Gagal: " + data.message);
                          }
                        } catch (err) {
                          console.error("Gagal:", err);
                        }
                      }
                    }}
                    className="bg-[#8E281C] w-full py-[12px] mt-[16px] rounded-lg font-bold text-[20px] text-white"
                  >
                    Batalkan
                  </button>
                </div>
                <div></div>
              </div>
            );
          })}
        </div>
        <div></div>
      </div>
    </div>
  );
}
