import Image from "next/image";
import Button from "../button/page";
import cart from "../../../../public/images/cart.png"

export default function Card({imageContent, heading, content, price}){
    return(
        <div className="bg-[#F8F0DF] rounded-lg" style={{boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}>
            <div className="px-[12px] pt-[12px] pb-[16px]">
                <Image src={imageContent} alt="image card" width={387} height={387}/>
            </div>
            <div className="px-[24px] pb-[16px]">
                <h1 className="mb-[12px] font-bold text-[24px]">{heading}</h1>
                <div className="text-[12px] h-[80px]">
                    {content}
                </div>
                <div className="flex justify-between">
                    <div className="font-bold text-[20px]">
                        <h3>Rp.{price},00</h3>
                    </div>
                    <div className="w-[56px]">
                        <Button color={"#DB5611"}>
                            <Image src={cart} alt="cart" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
