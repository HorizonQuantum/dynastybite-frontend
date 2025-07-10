"use client"

import Sidebar from "@/app/components/sidebar/page";
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";

export default function () {
  return (
    <div className="flex">
      <div className="grid sticky top-0 h-screen">
        <Sidebar />
      </div>
      <div className="flex-1 h-[3000px] overflow-y-auto">
        <Customer />
      </div>
    </div>
  );
}

function Customer() {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ state pencarian

  // ✅ Fetch semua user dari API
  useEffect(() => {
    fetch("https://dynastybite-backend-production-7527.up.railway.app/api/user")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Gagal memuat data user:", err));
  }, []);

  // ✅ Filter berdasarkan keyword pencarian dan hanya role 'user'
  const filteredUsers = users.filter((user) =>
    user.role === "user" &&
    user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.address.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    user.number_phone.includes(searchKeyword)
  );

  return (
    <div>
      {/* ✅ Top Navbar */}
      <nav className="grid grid-cols-2 fixed left-[280px] top-0 right-0 bg-[#E9B75A] h-[75px] z-10">
        <div className="flex h-full items-center">
          {/* ✅ Form search input */}
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
          <Image
            src={`/images/photo-admin.png`}
            alt="Photo"
            width={55}
            height={55}
          />
        </div>
      </nav>

      {/* ✅ Konten Tabel Pelanggan */}
      <div className="relative left-0 top-[75px] right-0">
        <div
          className="grid mx-[32px] p-[12px] bg-[#F8F0DF] my-[24px]"
          style={{
            boxShadow: "10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4",
          }}
        >
          <h1 className="font-bold text-[24px] mb-[12px]">Data Pelanggan</h1>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-[6px] text-[18px] font-bold text-white">
            <div className="bg-[#8E281C] flex items-center justify-center h-[40px] rounded-tl-lg">
              <h1>Username</h1>
            </div>
            <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
              <h1>Password</h1>
            </div>
            <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
              <h1>Kontak</h1>
            </div>
            <div className="bg-[#8E281C] flex items-center justify-center h-[40px]">
              <h1>Alamat</h1>
            </div>
            <div className="bg-[#8E281C] flex items-center justify-center h-[40px] rounded-tr-lg w-[160px]">
              <h1>Aksi</h1>
            </div>

            {/* ✅ Loop data hasil pencarian */}
            {filteredUsers
            .filter((user) => user.role === "user")
            .map((user) => (
              <React.Fragment key={user.id}>
                <div className="min-h-[40px] p-[12px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">
                  {user.username}
                </div>
                <div className="min-h-[40px] p-[12px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">
                  {"* * * * * *"}
                </div>
                <div className="min-h-[40px] p-[12px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">
                  {user.number_phone}
                </div>
                <div className="min-h-[40px] p-[12px] bg-[#ffe3af] flex text-[14px] font-semibold text-black">
                  {user.address}
                </div>
                <div className="min-h-[40px] p-[12px] bg-[#ffe3af] flex justify-center items-center text-[14px] font-semibold text-black">
                  <div className="flex w-full px-[12px]">
                    <Link
                      href={`/admin/customer/${user.id}/edit`}
                      className="bg-[#DB5611] w-full py-[6px] flex justify-center rounded-lg"
                    >
                      <Image
                        src={`/images/image_edit.png`}
                        alt="edit"
                        width={20}
                        height={20}
                      />
                    </Link>
                    <div className="h-auto w-[6px] bg-black mx-[12px]"></div>
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await fetch(
                            `http://dynastybite.test/api/user/${user.id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          const data = await res.json();
                          if (res.ok) {
                            alert(data.message);
                            setUsers(users.filter((u) => u.id !== user.id));
                          } else {
                            alert("Gagal menghapus: " + data.message);
                          }
                        } catch (err) {
                          console.error("Gagal menghapus user:", err);
                        }
                      }}
                      className="bg-[#DB5611] w-full py-[6px] flex justify-center rounded-lg"
                    >
                      <Image
                        src={`/images/image_delete.png`}
                        alt="hapus"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* ✅ Jika tidak ada hasil */}
            {filteredUsers.length === 0 && (
              <div className="col-span-5 text-center text-gray-500 font-semibold py-6">
                Tidak ada pelanggan yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
