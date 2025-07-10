"use client"

import { useState } from "react";
import Image from "next/image";
import auth from "../../../../public/images/auth.png";
import Button from "../../components/button/page";
import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    number_phone: "",
    address: ""
  });
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://dynastybite.test/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("OTP dikirim ke email");
        setShowOtp(true);
      } else {
        alert(data.message || "Gagal kirim OTP");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch("http://dynastybite.test/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ ...formData, otp }),
        });

        const data = await res.json();
        if (res.ok) {
        alert("Registrasi berhasil!");
        router.push("login")
        } else {
        alert(data.message || "Gagal registrasi");
        }
    } catch (err) {
        alert("Terjadi kesalahan");
        console.error(err);
    }
    };


  const color = "#FFC107";

  return (
    <div className="flex h-screen justify-center items-center" style={{ backgroundColor: "#F8F0DF" }}>
      <div className="w-[1200px] h-[600px] rounded-lg grid grid-cols-[auto_1fr]" style={{ backgroundColor: "#F8F0DF", boxShadow: "10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4" }}>
        <div className="py-[12px] pl-[12px]">
          <Image src={auth} alt="auth" />
        </div>
        <div>
          {!showOtp ? (
            <Register formData={formData} setFormData={setFormData} handleSendOtp={handleSendOtp} color={color} />
          ) : (
            <InputOtpCode otp={otp} setOtp={setOtp} color={color} handleRegister={handleRegister}/>
          )}
        </div>
      </div>
    </div>
  );
}

function Register({ formData, setFormData, handleSendOtp, color }) {
  return (
    <div className="relative top-[32px] left-[124px]">
      <div className="w-[400px]">
        <div className="text-center font-bold text-[28px] mb-[12px]" style={{ color: "#343A40" }}>
          <h1>Register</h1>
        </div>
        <form onSubmit={handleSendOtp}>
          <div className="font-bold text-[12px]" style={{ color: "#343A40" }}>
            {[
              { label: "Username", type: "text", name: "username" },
              { label: "Password", type: "password", name: "password" },
              { label: "Email", type: "email", name: "email" },
              { label: "No Handphone", type: "text", name: "number_phone" },
            ].map(({ label, type, name }) => (
              <div key={name} className="mb-[12px]">
                <label>{label}</label><br />
                <input
                  type={type}
                  placeholder={`Masukkan ${label}`}
                  className="mt-[6px] py-[13px] px-[18px] w-full rounded-lg focus:outline-none"
                  style={{ backgroundColor: "#F8F0DF", boxShadow: "10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4" }}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                />
              </div>
            ))}
            <div className="mb-[12px]">
              <label>Alamat</label><br />
              <textarea
                placeholder="Masukkan alamat"
                className="mt-[6px] py-[13px] px-[18px] w-full rounded-lg focus:outline-none"
                style={{ backgroundColor: "#F8F0DF", boxShadow: "10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4" }}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <Button color={color}>Kirim Kode Otp</Button>
        </form>
      </div>
    </div>
  );
}

function InputOtpCode({handleRegister, setOtp, color }) {
  return (
    <div className="relative top-[116px] left-[124px]">
      <div className="w-[400px]">
        <div className="text-center font-bold text-[28px] mb-[64px]" style={{ color: "#343A40" }}>
          <h1>Verifikasi OTP</h1>
        </div>
        <form onSubmit={handleRegister}>
          <div className="font-bold text-[12px]" style={{ color: "#343A40" }}>
            <div className="mb-[17px]">
              <label>Kode OTP</label><br />
              <input
                className="mt-[12px] py-[13px] px-[18px] w-full rounded-lg focus:outline-none"
                type="text"
                placeholder="* * * *"
                style={{ backgroundColor: "#F8F0DF", boxShadow: "10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4" }}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>
          <Button color={color}>Submit</Button>
        </form>
      </div>
    </div>
  );
}
