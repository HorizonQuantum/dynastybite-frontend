"use client"

import Sidebar from "@/app/components/sidebar/page";
import Image from "next/image";
import Search from "../../../../public/images/search.png";
import Photo from "../../../../public/images/photo-admin.png";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";

export default function(){
    return(
        <div className="flex">
            <div className="grid sticky top-0 h-screen">
                <Sidebar/>
            </div>
            <div className="flex-1 overflow-y-auto">
                <FormOrder/>
            </div>
        </div>
    );
}

function FormOrder(){
    let number = 1;
    const [historys, setHistorys] = useState([]);
    const [users, setUsers] = useState([]);
    const [types, setTypes] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchKeyword, setSearchKeyword] = useState("");


    const toggleOrderSelection = (orderId) => {
      const order = historys.find((o) => o.id === orderId);
      if (!order || [1, 5].includes(order.status_id)) return;

      setSelectedOrderIds((prev) =>
        prev.includes(orderId)
          ? prev.filter((id) => id !== orderId)
          : [...prev, orderId]
      );
    };



    useEffect(() => {
        fetch("http://dynastybite.test/api/order")
        .then((res) => res.json())
        .then((data) => setHistorys(data))
        .catch((err) => console.error("Gagal memuat data:", err))
    }, []);

    useEffect(() => {
        fetch("http://dynastybite.test/api/user")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Gagal memuat data:", err))
    }, []);

    useEffect(() => {
        fetch("http://dynastybite.test/api/type_order")
        .then((res) => res.json())
        .then((data) => setTypes(data))
        .catch((err) => console.error("Gagal memuat data:", err))
    }, []);

    useEffect(() => {
        fetch("http://dynastybite.test/api/order_status")
        .then((res) => res.json())
        .then((data) => setStatuses(data))
        .catch((err) => console.error("Gagal memuat data:", err))
    }, []);

    const filteredHistory = historys.filter((history) => {
      const user = users.find((u) => u.id === history.user_id);
      return (
        user &&
        user.username.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    });

    return(
        <div>
            <nav className="grid grid-cols-2 fixed left-[280px] top-0 right-0 bg-[#E9B75A] h-[75px] z-10">
                <div className="flex h-full items-center">
                  <form className="flex" onSubmit={(e) => e.preventDefault()}>
                    <div className="relative ml-[32px]">
                      <Image
                        src={`/images/search.png`}
                        alt="Search"
                        width={24}
                        height={24}
                        className="absolute left-[12px] top-[12px]"
                      />
                      <input
                        placeholder="Cari nama pelanggan..."
                        className="py-[12px] pl-[48px] pr-[12px] w-[380px] focus:outline-none bg-white rounded-lg"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)} // ✅ Real-time search
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-[24px] py-[12px] bg-[#8E281C] rounded-lg ml-[12px] font-bold text-white"
                    >
                      Cari
                    </button>
                </form>
                </div>
                <div className="flex h-full items-center justify-end mr-[32px]">
                    <h2 className="font-bold text-white mr-[12px]">Fadhilah Arumsari</h2>
                    <Image src={Photo} alt="Photo"/>
                </div>
            </nav>
            <div className="relative left-0 top-[75px] right-0">
                <div className="grid mx-[32px] p-[12px] bg-[#F8F0DF] my-[24px]" style={{boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}>
                    <div>
                      <div className="flex items-center gap-4 pb-4">
                        <select
                          className="py-2 px-3 font-bold text-white bg-[#E9B75A]  rounded"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          <option value="">Pilih Status Baru</option>
                          {statuses
                            .filter((s) => s.id !== 1) 
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={async () => {
                            if (!selectedStatus || selectedOrderIds.length === 0) {
                              alert("Pilih status dan minimal satu pesanan.");
                              return;
                            }

                            const confirmed = confirm("Ubah status untuk pesanan terpilih?");
                            if (!confirmed) return;

                            try {
                              const results = await Promise.all(
                                selectedOrderIds.map((id) =>
                                  fetch(`http://dynastybite.test/api/order/${id}/status`, {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Accept: "application/json"
                                    },
                                    body: JSON.stringify({ status_id: parseInt(selectedStatus) }),
                                  })
                                )
                              );

                              alert("Status berhasil diubah.");
                              // Refresh data
                              const updated = await fetch("http://dynastybite.test/api/order");
                              const updatedData = await updated.json();
                              setHistorys(updatedData);
                              setSelectedOrderIds([]); // reset
                              setSelectedStatus("");
                            } catch (err) {
                              console.error("Gagal ubah status:", err);
                              alert("Gagal mengubah status.");
                            }
                          }}
                          className="bg-[#8E281C] text-white font-bold px-2 py-2 rounded"
                        >
                          Ubah Status
                        </button>
                        <p className="font-bold text-sm text-gray-600">Dipilih: {selectedOrderIds.length}</p>
                      </div>
                    </div>
                    <h1 className="font-bold text-[24px] mb-[12px]">Tipe Regular Order</h1>
                    <div className="grid grid-cols-[auto_auto_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-[6px] text-[18px] font-bold text-white">
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px] rounded-tl-lg w-[40px]">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                const ids = historys
                                  .filter((h) => ![1, 5].includes(h.status_id))
                                  .map((h) => h.id);
                                setSelectedOrderIds(ids);
                              } else {
                                setSelectedOrderIds([]);
                              }
                            }}
                            checked={
                              selectedOrderIds.length > 0 &&
                              selectedOrderIds.length === historys.filter((h) => ![1, 5].includes(h.status_id)).length
                            }
                          />
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px] w-[40px]">
                          <h1>No</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Nama</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Tipe Order</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Catatan</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Status</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Tanggal Pesan</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Estimasi Pengiriman</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px] rounded-tr-lg w-[160px]">
                          <h1>Aksi</h1>
                        </div>
                        {filteredHistory
                        .filter((history) => history.type_order_id === 2 && [1,2,3,4].includes(history.status_id))
                        .map((history) => (
                          <React.Fragment key={history.id}>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center">
                              {![1, 5].includes(history.status_id) && (
                                <input
                                  type="checkbox"
                                  checked={selectedOrderIds.includes(history.id)}
                                  onChange={() => toggleOrderSelection(history.id)}
                                />
                              )}
                            </div>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{number++}</div>
                            {users
                            .filter((user) => user.id === history.user_id)
                            .map((user) => (
                                <div key={user.id} className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{user.username}</div>
                            ))}
                            {types
                            .filter((type) => type.id === history.type_order_id)
                            .map((type) => (
                                <div key={type.id} className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{type.name}</div>
                            ))}
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{history.note_order}</div>
                            {statuses
                            .filter((status) => status.id === history.status_id)
                            .map((status) => (
                                <div key={status.id} className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{status.name}</div>
                            ))}
                            
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">
                                {formatTanggalLocal(history.created_at)}
                            </div>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black"><TanggalKirim createdAt={history.created_at}/></div>
                           
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">
                                <div className="flex w-full px-[12px]">
                                    <Link href={`/admin/form/${history.id}/detail`} className="bg-[#DB5611] w-full py-[6px] flex justify-center rounded-lg">
                                        <Image src={`/images/detail.png`} alt="cart" width={20} height={20} />
                                    </Link>
                                    <div className="h-auto w-[6px] bg-black mx-[12px]"></div>
                                      <button 
                                        type="button" 
                                         onClick={async (e) => {
                                            const confirmation = confirm("Apakah anda yakin ingin menghapus order ini?")

                                            if(confirmation){
                                              e.preventDefault();
                                              try {
                                              const res = await fetch(`http://dynastybite.test/api/order/${history.id}`, {
                                                  method: "DELETE",
                                              });
                                              const data = await res.json();
                                              if (res.ok) {
                                                  alert(data.message);
                                                  setHistorys(historys.filter((u) => u.id !== history.id));
                                              } else {
                                                  alert("Gagal menghapus: " + data.message);
                                              }
                                              } catch (err) {
                                              console.error("Gagal menghapus user:", err);
                                              }
                                            }
                                        }}
                                        className="bg-[#DB5611] w-full py-[6px] flex justify-center rounded-lg">
                                        <Image src={`/images/image_delete.png`} alt="cart" width={20} height={20} />
                                    </button>
                                </div>
                            </div>
                          </React.Fragment>
                        ))}
                        {filteredHistory.length === 0 && (
                          <div className="col-span-9 text-center text-gray-500 font-semibold py-6">
                            Tidak ada yang cocok dengan pencarian.
                          </div>
                        )}
                    </div>
                </div>
                <div className="grid mx-[32px] p-[12px] bg-[#F8F0DF]" style={{boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}>
                    <h1 className="font-bold text-[24px] mb-[12px]">Tipe Custom Order</h1>
                    <div className="grid grid-cols-[auto_auto_1fr_1fr_1fr_1fr_1fr_1fr_auto] gap-[6px] text-[18px] font-bold text-white">
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px] rounded-tl-lg w-[40px]">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                const ids = historys
                                  .filter((h) => ![1, 5].includes(h.status_id))
                                  .map((h) => h.id);
                                setSelectedOrderIds(ids);
                              } else {
                                setSelectedOrderIds([]);
                              }
                            }}
                            checked={
                              selectedOrderIds.length > 0 &&
                              selectedOrderIds.length === historys.filter((h) => ![1, 5].includes(h.status_id)).length
                            }
                          />
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px] w-[40px]">
                          <h1>No</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Nama</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Tipe Order</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Catatan</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Status</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Tanggal Pesan</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
                          <h1>Estimasi Pengiriman</h1>
                        </div>
                        <div className="bg-[#8E281C] flex items-center justify-center h-[40px] rounded-tr-lg w-[160px]">
                          <h1>Aksi</h1>
                        </div>
                        {filteredHistory
                        .filter((history) => history.type_order_id === 1 && [1,2,3].includes(history.status_id))
                        .map((history) => (
                          <React.Fragment key={history.id}>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center">
                              {![1, 5].includes(history.status_id) && (
                                <input
                                  type="checkbox"
                                  checked={selectedOrderIds.includes(history.id)}
                                  onChange={() => toggleOrderSelection(history.id)}
                                />
                              )}
                            </div>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{number++}</div>
                            {users
                            .filter((user) => user.id === history.user_id)
                            .map((user) => (
                                <div key={user.id} className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{user.username}</div>
                            ))}
                            {types
                            .filter((type) => type.id === history.type_order_id)
                            .map((type) => (
                                <div key={type.id} className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{type.name}</div>
                            ))}
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{history.note_order}</div>
                            {statuses
                            .filter((status) => status.id === history.status_id)
                            .map((status) => (
                                <div key={status.id} className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{status.name}</div>
                            ))}
                            
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">
                                {formatTanggalLocal(history.created_at)}
                            </div>
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">{formatTanggalLocal(history.delivery_date)}</div>
                           
                            <div className="h-[40px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">
                                <div className="flex w-full px-[12px]">
                                    <Link href={`/admin/history/${history.id}/edit`} className="bg-[#DB5611] w-full py-[6px] flex justify-center rounded-lg">
                                        <Image src={`/images/detail.png`} alt="cart" width={20} height={20} />
                                    </Link>
                                    <div className="h-auto w-[6px] bg-black mx-[12px]"></div>
                                      <button 
                                        type="button" 
                                         onClick={async (e) => {
                                            const confirmation = confirm("Apakah anda yakin ingin menghapus order ini?")

                                            if(confirmation){
                                              e.preventDefault();
                                              try {
                                              const res = await fetch(`http://dynastybite.test/api/order/${history.id}`, {
                                                  method: "DELETE",
                                              });
                                              const data = await res.json();
                                              if (res.ok) {
                                                  alert(data.message);
                                                  setHistorys(historys.filter((u) => u.id !== history.id));
                                              } else {
                                                  alert("Gagal menghapus: " + data.message);
                                              }
                                              } catch (err) {
                                              console.error("Gagal menghapus user:", err);
                                              }
                                            }
                                        }}
                                        className="bg-[#DB5611] w-full py-[6px] flex justify-center rounded-lg">
                                        <Image src={`/images/image_delete.png`} alt="cart" width={20} height={20} />
                                    </button>
                                </div>
                            </div>
                          </React.Fragment>
                        ))}
                        {filteredHistory.length === 0 && (
                          <div className="col-span-9 text-center text-gray-500 font-semibold py-6">
                            Tidak ada yang cocok dengan pencarian.
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function getPengirimanDariCreated(createdAt) {
  const created = new Date(createdAt)
  const createdDay = created.getDay() // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  let targetDay

  if (createdDay === 0 || createdDay === 2) {
    targetDay = 3 // Rabu
  } else if (createdDay === 3 || createdDay === 4) {
    targetDay = 5 // Jumat
  } else if (createdDay === 5 || createdDay === 6) {
    targetDay = 0 // Minggu
  } else {
    targetDay = 3 // Default: anggap Senin ikut ke Rabu
  }

  let diff = targetDay - createdDay
  if (diff < 0) diff += 7

  const tanggalKirim = new Date(created)
  tanggalKirim.setDate(created.getDate() + diff)

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return tanggalKirim.toLocaleDateString('id-ID', options)
}

// Komponen utama
function TanggalKirim({ createdAt }) {
  const tanggal = getPengirimanDariCreated(createdAt)

  return (
    <div className="text-sm">
      <span>{tanggal}</span>
    </div>
  )
}

const formatTanggalLocal = (createdAt) => {
  try {
    const tanggal = typeof createdAt === "string"
      ? new Date(createdAt.split("T")[0])
      : new Date(createdAt);

    tanggal.setHours(0, 0, 0, 0); // Hindari shifting timezone
    return tanggal.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return "Invalid Date";
  }
};
