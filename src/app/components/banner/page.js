import Image from "next/image";
import Banner from "../../../../public/images/banner.png";

function Promo(){
    return(
        <div>
            <Image src={Banner} alt="banner"/>
        </div>
    );
}

export default Promo;