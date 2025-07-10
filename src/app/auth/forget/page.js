//Page Ubah Password
"use client"

import { useState } from "react";
import Image from "next/image";
import auth from "../../../../public/images/auth.png";
import Button from "../../components/button/page";
import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const [formData, setFormData] = useState({
    email: "",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");


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
        setStep("otp")
      } else {
        alert(data.message || "Gagal kirim OTP");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
      console.error(err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch("http://dynastybite.test/api/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ ...formData, otp }),
        });

        const data = await res.json();
        if (res.ok) {
        alert("OTP valid. Silakan masukkan password baru.");
        setStep("password")
        } else {
        alert(data.message || "Otp Salah");
        }
    } catch (err) {
        alert("Terjadi kesalahan");
        console.error(err);
    }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword.new_password !== newPassword.confirm_password) {
            alert("Konfirmasi password tidak cocok!");
            return;
        }

        try {
            const res = await fetch(`http://dynastybite.test/api/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: newPassword.password,
                    new_password: newPassword.new_password,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal mengganti password");
            }

            alert("Password berhasil diubah. Silahkan login.");
            router.push("./login");
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan: " + error.message);
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
          {step === "email" && (
            <SendEmail formData={formData} setFormData={setFormData} handleSendOtp={handleSendOtp} color={color} />
            )}

            {step === "otp" && (
            <InputOtpCode otp={otp} setOtp={setOtp} handleVerifyOtp={handleVerifyOtp} color={color} />
            )}

            {step === "password" && (
            <SendNewPassword
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                handleChangePassword={handleChangePassword}
                color={color}
            />
            )}
        </div>
      </div>
    </div>
  );
}

function SendEmail({ formData, setFormData, handleSendOtp, color }) {
  return (
    <div className="relative top-[32px] left-[124px]">
      <div className="w-[400px]">
        <div className="text-center font-bold text-[28px] mb-[12px] mt-[64px]" style={{ color: "#343A40" }}>
          <h1>Verifikasi Email</h1>
        </div>
        <form onSubmit={handleSendOtp}>
          <div className="font-bold text-[12px]" style={{ color: "#343A40" }}>
            {[
              { label: "Email", type: "email", name: "email" },
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
          </div>
          <Button color={color}>Kirim Kode Otp</Button>
        </form>
      </div>
    </div>
  );
}

function InputOtpCode({handleVerifyOtp, setOtp, color }) {
  return (
    <div className="relative top-[116px] left-[124px]">
      <div className="w-[400px]">
        <div className="text-center font-bold text-[28px] mb-[64px]" style={{ color: "#343A40" }}>
          <h1>Verifikasi OTP</h1>
        </div>
        <form onSubmit={handleVerifyOtp}>
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

function SendNewPassword({ newPassword, setNewPassword, handleChangePassword, color }) {
  return (
    <div className="relative top-[32px] left-[124px]">
      <div className="w-[400px]">
        <div className="text-center font-bold text-[28px] mb-[12px] mt-[64px]" style={{ color: "#343A40" }}>
          <h1>Buat Password Baru</h1>
        </div>
        <form onSubmit={handleChangePassword}>
          <div className="font-bold text-[12px]" style={{ color: "#343A40" }}>
            {[
              { label: "Password Lama", type: "text", name: "password" },
              { label: "Password Baru", type: "text", name: "new_password" },
              { label: "Konfirmasi Password Baru", type: "text", name: "confirm_password" },
            ].map(({ label, type, name }) => (
              <div key={name} className="mb-[12px]">
                <label>{label}</label><br />
                <input
                  type={type}
                  placeholder={`Masukkan ${label}`}
                  className="mt-[6px] py-[13px] px-[18px] w-full rounded-lg focus:outline-none"
                  style={{ backgroundColor: "#F8F0DF", boxShadow: "10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4" }}
                  onChange={(e) => setNewPassword({ ...newPassword, [name]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <Button color={color}>Ubah Password</Button>
        </form>
      </div>
    </div>
  );
}
