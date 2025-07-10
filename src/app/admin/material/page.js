"use client"

import Sidebar from "@/app/components/sidebar/page";
import Image from "next/image";
import Search from "../../../../public/images/search.png";
import Photo from "../../../../public/images/photo-admin.png";
import Edit from "../../../../public/images/image_edit.png"
import Delete from "../../../../public/images/image_delete.png"
import Link from "next/link";
import { useState, useEffect } from "react";

export default function(){
    return(
        <div className="flex overflow-x-hidden">
          <div className="fixed top-0 h-screen">
            <Sidebar />
          </div>
          <div className="ml-[280px] w-full">
            <Material />
          </div>
        </div>
    );
}

function Material() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newMenu, setNewMenu] = useState({
    name: "",
    pcs: "",
    price: "",
    description: "",
    image: "",
    category_id: "",
  });
  const [button, setButton] = useState(false);

  useEffect(() => {
    fetch("https://dynastybite-backend-production-7527.up.railway.app/api/menu")
      .then((res) => res.json())
      .then((data) => setMenus(data));

    fetch("https://dynastybite-backend-production-7527.up.railway.app/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleAddCategory = async () => {
    try {
      const res = await fetch("https://dynastybite-backend-production-7527.up.railway.app/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      const data = await res.json();
      alert(data.messege);
      setNewCategory("");

      // Refetch kategori
      const categoryRes = await fetch("https://dynastybite-backend-production-7527.up.railway.app/api/category");
      const categoriesData = await categoryRes.json();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Gagal tambah kategori:", err);
    }
  };


  const handleButton = () => {
    setButton((prev) => !prev);
  };

  const handleAddMenu = async () => {
    if (
      !newMenu.name ||
      !newMenu.pcs ||
      !newMenu.price ||
      !newMenu.description ||
      !newMenu.category_id ||
      !newMenu.image
    ) {
      alert("Harap isi semua field!");
      return;
    }

    const formData = new FormData();
    formData.append("name", newMenu.name);
    formData.append("description", newMenu.description);
    formData.append("pcs", newMenu.pcs);
    formData.append("price", newMenu.price);
    formData.append("category_id", newMenu.category_id);
    formData.append("image", newMenu.image);

    try {
      const res = await fetch("https://dynastybite-backend-production-7527.up.railway.app/api/menu", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan menu");
      }

      alert("Menu berhasil ditambahkan!");
      setMenus((prevMenus) => [
        ...prevMenus,
        {
          ...data.data,
          category_id: parseInt(data.data.category_id), // penting!
        },
      ]);

      setNewMenu({
        name: "",
        pcs: "",
        price: "",
        description: "",
        image: "",
        category_id: "",
      });
    } catch (err) {
      console.error("Gagal tambah menu:", err);
      alert(err.message || "Gagal kirim data ke server");
    }
  };

  const handleDeleteCat = async (id) => {
    const confirmDelete = confirm("Apakah anda yakin ingin menghapus categori")
    if(!confirmDelete) return;

    try {
      const res = await fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/category/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json"
        }
      })

      const data = res.json();

      if(!res.ok){
        throw new Error(data.message || "Gagal menghapus kategori menu")
      }

      alert("Kategori menu berhasil dihapus")
      setCategories(categories.filter((cat) => cat.id !== id));
    }catch(err){
      console.log("Gagal menghapus kategori menu:", err)
      alert(err.messege || "Terjadi kesalahan saat menghapus")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Apakah anda yakin ingin menghapus menu ini?");
    if(!confirmDelete) return;

    try {
      const res = await fetch(`https://dynastybite-backend-production-7527.up.railway.app/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          Accept : "application/json"
        },
      });

      const data = res.json();

      if(!res.ok){
        throw new Error(data.message || "Gagal menghapus menu")
      }

      alert("Menu berhasil dihapus");
      setMenus(menus.filter((menu) => menu.id !== id));
    }catch(err){
      console.log("Gagal menghapus menu:", err);
      alert(err.message || "Terjadi kesalahan saat menghapus")
    }
  };

  return (
    <div className="flex overflow-x-hidden relative">
      {/* KONTEN UTAMA */}
      <div className="flex-1 pr-[420px]">
        <nav className="grid grid-cols-1 fixed left-[280px] top-0 right-0 bg-[#E9B75A] h-[75px] z-10">
          <div className="flex h-full items-center">
          </div>
          <div className="flex h-full items-center justify-end mr-[32px]">
            <h2 className="font-bold text-white mr-[12px]">Fadhilah Arumsari</h2>
            <Image src={Photo} alt="Photo"/>
          </div>
        </nav>

        <div className="p-8 mt-[75px]">
          <button
            type="button"
            onClick={handleButton}
            className="p-[12px] bg-green-600 text-white font-bold rounded-lg mb-[24px]"
          >
            + Tambah Menu
          </button>

          <div className="max-w-[1600px] py-[24px]">
            <div className="flex flex-col gap-6">
              <div className="flex-1">
                <div className="mb-10">
                  {categories.map((cat) => (
                    <div key={cat.id} className="mb-12 w-full">
                      <div className="flex h-auto gap-4">
                        <h1 className="text-2xl font-bold mb-4">{cat.name}</h1>
                        <button
                          type="button"
                          onClick={() => handleDeleteCat(cat.id)}
                          className="bg-[#DB5611] w-[32px] h-[32px] py-[8px] flex justify-center rounded-lg"
                        >
                          <Image src={Delete} alt="cart" width={18} height={18} />
                        </button>
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
                                src={`https://dynastybite-backend-production-7527.up.railway.app/storage/images/${menu.image}`}
                                alt="Menu Image"
                                width={300}
                                height={300}
                                priority
                                className="object-cover rounded"
                              />
                              <h2 className="font-bold text-lg mt-2">{menu.name}</h2>
                              <p className="text-sm">{menu.description}</p>
                              <div className="grid grid-cols-[1fr_40%] h-[30px] mt-2">
                                <div className="font-bold text-[20px]">
                                  <h3>Rp.{menu.price},00</h3>
                                </div>
                                <div className="flex">
                                  <Link
                                    href={`/admin/material/${menu.id}/edit`}
                                    className="bg-[#DB5611] w-full py-[8px] flex justify-center rounded-lg"
                                  >
                                    <Image src={Edit} alt="cart" width={18} height={18}/>
                                  </Link>
                                  <div className="h-auto w-[6px] bg-black mx-[12px]"></div>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(menu.id)}
                                    className="bg-[#DB5611] w-full py-[8px] flex justify-center rounded-lg"
                                  >
                                    <Image src={Delete} alt="cart" width={18} height={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR FORM KANAN */}
      {button && (
        <div className="fixed top-[75px] right-0 w-[400px] h-[calc(100vh-75px)] bg-white shadow-lg p-6 overflow-y-auto z-20">
          <h2 className="text-xl font-bold mb-4 text-center">Tambah Menu</h2>

          <div className="mb-8">
            <input
              className="p-2 border rounded mr-2 w-full"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nama kategori"
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full"
              onClick={handleAddCategory}
            >
              Tambah Kategori
            </button>
          </div>

          <div>
            <input
              className="p-2 border rounded w-full mb-2"
              placeholder="Nama menu"
              value={newMenu.name}
              onChange={(e) =>
                setNewMenu({ ...newMenu, name: e.target.value })
              }
            />
            <input
              className="p-2 border rounded w-full mb-2"
              placeholder="Deskripsi"
              value={newMenu.description}
              onChange={(e) =>
                setNewMenu({ ...newMenu, description: e.target.value })
              }
            />
            <input
              className="p-2 border rounded w-full mb-2"
              placeholder="Pcs"
              type="number"
              value={newMenu.pcs}
              onChange={(e) =>
                setNewMenu({ ...newMenu, pcs: e.target.value })
              }
            />
            <input
              className="p-2 border rounded w-full mb-2"
              placeholder="Harga"
              type="number"
              value={newMenu.price}
              onChange={(e) =>
                setNewMenu({ ...newMenu, price: e.target.value })
              }
            />
            <select
              className="p-2 border rounded w-full mb-2"
              value={newMenu.category_id}
              onChange={(e) =>
                setNewMenu({ ...newMenu, category_id: e.target.value })
              }
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              className="p-2 border rounded w-full mb-2"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewMenu({ ...newMenu, image: e.target.files[0] })
              }
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 mt-2 rounded w-full"
              onClick={handleAddMenu}
            >
              Simpan Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
