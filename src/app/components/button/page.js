export default function Button({children, color, onClick}){
    return(
        <button type="submit" onClick={onClick} className="flex justify-center w-full py-[8px] font-bold text-[18px] rounded-lg text-white" style={{backgroundColor:`${color}`, boxShadow:"10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4"}}>
            {children}
        </button>
    );
}