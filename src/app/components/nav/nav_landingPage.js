import Link from "next/link";

export default function NavLandingPage(){
    return(
        <div className="flex justify-end items-center">
            <div className="">
                <Link href="#" className="px-[12px] py-[8px]">Beranda</Link>
                <Link href="#" className="px-[12px] py-[8px]">Tentang Kami</Link>
                <Link href="#" className="px-[12px] py-[8px]">Produk</Link>
                <Link href="#" className="px-[12px] py-[8px]">Jadwal</Link>
                <Link href="#" className="px-[12px] py-[8px]">Review</Link>
            </div>
            <div className="h-[43px] border-2 rounded-lg mx-[12px] my-[8px]">
            </div>
            <div>
                <Link href="./auth/login" className="px-[12px] py-[8px]">Login</Link>
                <Link href="./auth/register" className="px-[12px] py-[8px]">Register</Link>
            </div>
        </div>
    );
}