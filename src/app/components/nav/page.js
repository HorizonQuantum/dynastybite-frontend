import Image from "next/image";
import logo from "../../../../public/images/logo.png"
import NavLandingPage from "./nav_landingPage";
import NavDashboard from "./nav_dashboard";

export default function Nav({login}){
    return(
        <div className="grid grid-cols-[auto_1280px_auto] bg-[#8E281C] sticky top-0 z-20">
            <div></div>
            <div className="grid grid-cols-[auto_1fr] font-bold h-[75px] text-white sticky top-0 w-full z-10 text-[18px]">
                <div className="flex items-center">
                    <div>
                    </div>
                    <div className="ml-[12px] flex h-auto items-center gap-[12px]">
                        <Image src={logo} alt="Logo"/>
                        <h1>DynastyBite</h1>
                    </div>
                </div>
                {login ? <NavDashboard/> : <NavLandingPage/>}
            </div>
            <div></div>
        </div>
    );
}