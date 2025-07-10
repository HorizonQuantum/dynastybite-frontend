import Link from "next/link";
import Image from "next/image";
import setting from "../../../../public/images/setting.png";
import history from "../../../../public/images/history.png";
import whatsapp from "../../../../public/images/whatsapp.png";
import cart from "../../../../public/images/cart.png";
import order from "../../../../public/images/order.png";

export default function NavDashboard(){
    return(
        <div className="flex justify-end items-center">
            <div className="flex">
                <Link href="./dashboard" className="px-[12px] py-[8px]">
                    <Image src={cart} alt="nav-menu" className="w-7 h-7"/>
                </Link>
                <Link href="./order" className="px-[12px] py-[8px]">
                    <Image src={order} alt="nav-menu" className="w-7 h-7"/>
                </Link>
                <Link href="./history" className="px-[12px] py-[8px]">
                    <Image src={history} alt="nav-menu" className="w-7 h-7"/>
                </Link>
                <Link href="https://wa.me/6285642329187" className="px-[12px] py-[8px]" target="_blank">
                    <Image src={whatsapp} alt="nav-menu" className="w-7 h-7"/>
                </Link>
                <Link href="./settings" className="px-[12px] py-[8px]">
                    <Image src={setting} alt="nav-menu" className="w-7 h-7"/>
                </Link>
            </div>
        </div>
    );
}