import Image from "next/image";

function CardReview({imageProfile, name, reting, comment}){
    return(
        <div className="h-[164px] bg-[#FFFFFF] rounded-lg py-[12px] px-[24px]">
            <div className="grid grid-cols-[auto_1fr] gap-[6px] items-center mb-[16px]">
                <Image src={imageProfile} alt="Profile"/>
                <div className="flex flex-col gap-[9px] ml-[8px] text-[16px] font-bold">
                    <h1>{name}</h1>
                    <Image src={reting} alt="Reting"/>
                </div>
            </div>
            <div className="text-center text-[12px]">
                <p>{comment}</p>
            </div>
        </div>
    );
}

export default CardReview;