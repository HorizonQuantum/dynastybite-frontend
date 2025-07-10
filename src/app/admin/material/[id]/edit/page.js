"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebar/page";
import Image from "next/image";


export default function(){
    return(
        <div className="flex">
            <div className="grid fixed top-0 h-screen">
                <Sidebar/>
            </div>
            <div>
                <EditMenu/>
            </div>
        </div>
    );
}

function EditMenu(){
    const router = useRouter();
    const params = useParams();
    const [category, setCategory] = useState([])

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name : '',
        pcs : '',
        price : '',
        description : '',
        category_id : '',
        image: '',
    });

    useEffect(() => {
        fetch(`http://dynastybite.test/api/menu/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
            setForm(data)
            setLoading(false)
        })
        
        fetch(`http://dynastybite.test/api/category`)
        .then((res) => res.json())
        .then((data) => {
            setCategory(data)
            setLoading(false)
        })
    }, [params.id]);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    

    const submitHendler = async (e) => {
        e.preventDefault();

        if(
            !form.name ||
            !form.pcs ||
            !form.price ||
            !form.description ||
            !form.category_id
        ){
            alert("Harap lengkapi semua form!");
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("pcs", form.pcs);
        formData.append("price", form.price);
        formData.append("description", form.description);
        formData.append("category_id", form.category_id);
        if(form.image){
            formData.append("image", form.image);
        }
        formData.append("_method", "PATCH")

        try{
            const res = await fetch(`http://dynastybite.test/api/menu/${params.id}`, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                },
                body: formData,
            });
            const data = await res.json();

            if (!res.ok) {
            throw new Error(data.message || "Gagal mengedit menu");
            }
            alert("Menu berhasil diubah!");
            router.push("/admin/material");
        } catch (err) {
            console.error("Gagal tambah menu:", err);
            alert(err.message || "Gagal kirim data ke server");
        } 
    }

    if (loading) return <p>Loading...</p>

    return(
        <div className="flex-1 overflow-y-auto">
            <nav className="grid grid-cols-2 fixed left-[280px] top-0 right-0 bg-[#E9B75A] h-[75px] z-10">
                <div className="flex h-full items-center">
                    <form className="flex">
                        <div className="relative ml-[32px]">
                            <Image src={`/images/search.png`} alt="Search" width={24} height={24} className="absolute left-[12px] top-[12px]"/>
                            <input placeholder="Searc" className="py-[12px] pl-[48px] pr-[12px] w-[380px] focus:outline-none bg-white rounded-lg"/>
                        </div>
                        <button type="submit" className="px-[24px] py-[12px] bg-[#8E281C] rounded-lg ml-[12px] font-bold text-white">Cari</button>
                    </form>
                </div>
                <div className="flex h-full items-center justify-end mr-[32px]">
                    <h2 className="font-bold text-white mr-[12px]">Fadhilah Arumsari</h2>
                    <Image src={`/images/photo-admin.png`} alt="Photo" width={55} height={55}/>
                </div>
            </nav>
            <div className="grid grid-cols-1 absolute left-[280px] top-[75px] right-0 h-auto">
                <div className="flex justify-center py-[12px]">
                    <form 
                        className="flex flex-col w-[50%] p-[12px] rounded-lg" 
                        onSubmit={submitHendler}
                    >
                        <h1 className="font-bold text-[24px] text-center mt-[24px] mb-[64px]">Form Ubah Data Menu</h1>
                        <label className="font-bold">Nama Produk :</label>
                        <input 
                            className="py-[12px] pl-[24px] pr-[12px] focus:outline-none bg-white rounded-lg mb-[32px]"
                            placeholder="Nama Produk" 
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                        />
                        <label className="font-bold">Type Produk :</label>
                        <select
                            className="py-[12px] pl-[24px] pr-[12px] focus:outline-none bg-white rounded-lg mb-[32px]"
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            style={{textTransform: "capitalize"}}
                        >
                            {category.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <label className="font-bold">Pcs :</label>
                        <input 
                            className="py-[12px] pl-[24px] pr-[12px] focus:outline-none bg-white rounded-lg mb-[32px]"
                            placeholder="Jumlah pcs" 
                            name="pcs"
                            type="text"
                            value={form.pcs}
                            onChange={handleChange}
                        />
                        <label className="font-bold">Harga :</label>
                        <input 
                            className="py-[12px] pl-[24px] pr-[12px] focus:outline-none bg-white rounded-lg mb-[32px]"
                            placeholder="Harga" 
                            name="price"
                            type="text"
                            value={form.price}
                            onChange={handleChange}
                        />
                        <label className="font-bold">Deskripsi :</label>
                        <textarea 
                            className="py-[12px] pl-[24px] pr-[12px] focus:outline-none bg-white rounded-lg mb-[32px] h-[120px]"
                            placeholder="Deskripsi" 
                            name="description"
                            type="text"
                            value={form.description}
                            onChange={handleChange}
                        />
                        <input 
                            className="py-[12px] pl-[24px] pr-[12px] focus:outline-none bg-white rounded-lg mb-[32px]"
                            name="image"
                            type="file"
                            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                        />
                        {form.image && typeof form.image === 'object' && (
                            <p className="text-sm text-gray-500 mb-[32px]">{form.image.name}</p>
                        )}
                        <button 
                        type="submit" 
                        className="px-[24px] py-[12px] bg-[#8E281C] rounded-lg font-bold text-white"
                        >
                            Ubah Data
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}