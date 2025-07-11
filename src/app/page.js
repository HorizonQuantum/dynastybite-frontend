"use client"

import Button from "./components/button/page";
import Nav from "./components/nav/page";
import Image from "next/image";
import image from "../../public/images/dimsumHeader.png";
import logo from "../../public/images/logo2.png";
import Card from "./components/card/page";
import information from "../../public/images/information.png";
import React from "react";
import profile from "../../public/images/profile.png";
import reting from "../../public/images/reting.png";
import CardReview from "./components/card_review/page";
import Address from "../../public/images/address.png";
import Gmail from "../../public/images/gmail.png";
import Whatsapp from "../../public/images/whatsapp.png";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const login = false;

  const [menus, setMenus] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://dynastybite-backend-production-7527.up.railway.app/api/menu')
    .then((res) => res.json())
    .then((data) => setMenus(data))
    .catch((err) => console.error('Gagal memuat menu:', err));

    fetch('https://dynastybite-backend-production-7527.up.railway.app/api/timetable')
    .then((res) => res.json())
    .then((data) => setTimetables(data))
    .catch((err) => console.error('Gagal memuat jadwal:', err));

    fetch('https://dynastybite-backend-production-7527.up.railway.app/api/category')
    .then((res) => res.json())
    .then((data) => setCategories(data))
    .catch((err) => console.error('Gagal memuat jadwal:', err));
  }, []);

  return (
    <div>
      <Nav login={login}/>
      <div className="grid grid-cols-[auto_1280px_auto]">
        <div className="bg-[#F8F0DF]"></div>
            <div className="bg-[#F8F0DF] grid grid-cols-[auto_1fr] h-[587px] items-center">
              <div className="flex flex-col gap-[24px]">
                <div className="font-bold text-[48px] flex gap-3">
                  <span className="text-[#8B0000]">Dynasty</span>
                  <span className="text-[#FFC107]">Bite</span>
                </div>
                <div className="w-[380px] text-[12px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Id ratione assumenda soluta explicabo aut? Repudiandae reprehenderit blanditiis quasi animi autem quos. Suscipit amet dolorum vel.</div>
                <div className="w-[200px]">
                  <Button color={"#DB5611"}>Pesan Sekarang</Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Image src={image} alt="Dimsum"/>
              </div>
            </div>
        <div className="bg-[#F8F0DF]"></div>
      </div>
      <div className="grid grid-cols-[auto_1280px_auto] bg-[#A3B18A]">
        <div></div>
            <div className="relative flex justify-center h-[260px] items-center text-center">
              <div className="absolute -top-[50px]">
                <Image src={logo} alt="logo" width={100} height={100}/>
              </div>
              <div>
                <h1 className="font-bold text-[20px] mb-[24px] mt-[24px]">Tentang Kami</h1>
                <div className="w-[1000px] text-[12px]">
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae perspiciatis sed fugit suscipit dolores magni assumenda et rem aliquid, sapiente dolor iusto architecto earum numquam repellendus soluta nisi corrupti veritatis rerum fuga asperiores nam minus beatae. Nesciunt at pariatur saepe impedit vitae nulla odio? Reiciendis, commodi deserunt tempore aut repellat quod vitae quam odio sed reprehenderit alias fugit rem at necessitatibus impedit! Quia, iste esse eligendi praesentium porro unde dolor tempore quaerat, dolorum dolores possimus deleniti itaque ?</p>
                </div>
              </div>
            </div>
        <div></div>
      </div>
      <div className="bg-[#F8F0DF] p-[64px]">
        <div className="max-w-[1280px] mx-auto bg-[#F8F0DF] py-[24px] px-4">
          <div className="flex flex-col gap-6">
            <div className="flex-1">
              <div className="mb-10">
                <div>
                  <h2 className="font-bold text-[32px] text-center mb-[32px]">Daftar Menu</h2>
                </div>
                {categories.map((cat) => (
                  <div key={cat.id} className="mb-12 w-full items-center">
                    <div className="flex h-auto gap-4">
                      <h1 className="text-2xl font-bold mb-4">{cat.name}</h1>
                    </div>
                    {/* Horizontal Scrollable Menu List */}
                    <div 
                      className="overflow-x-auto w-full"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none"
                      }}
                      >
                      <div 
                        className="flex gap-[24px] min-w-fit"
                        style={{
                          overflow: "hidden"
                        }}
                      >
                        {menus
                          .filter((menu) => menu.category_id === cat.id)
                          .map((menu) => (
                            <div
                              key={menu.id}
                              className="bg-[#F8F0DF] rounded-lg p-4 flex-shrink-0 w-[250px] min-w-[250px]"
                              style={{
                                boxShadow: "10px 10px 30px #FFE8B7, -10px -10px 30px #FFFBF4",
                              }}
                            >
                              <Image
                                src={`https://dynastybite-backend-production-7527.up.railway.app/storage/public/images/${menu.image}`}
                                alt="Menu Image"
                                width={300}
                                height={300}
                                className="object-cover rounded"
                              />
                              <h2 className="font-bold text-lg mt-2">{menu.name}</h2>
                              <p className="text-sm">{menu.description}</p>
                              <div className="grid grid-cols-[1fr_20%] h-[30px] mt-2">
                                <div className="font-bold text-[20px]">
                                  <h3>Rp.{menu.price},00</h3>
                                </div>
                                <div className="flex">
                                  <Link
                                    href="./auth/login"
                                    className="bg-[#DB5611] w-full py-[8px] flex justify-center rounded-lg"
                                  >
                                    <Image
                                      src={"/images/cart.png"}
                                      alt="cart"
                                      width={18}
                                      height={18}
                                    />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[auto_1280px_auto] bg-[#E9B75A] p-[64px]">
        <div></div>
        <div>
          <div className="font-bold text-[32px] text-center mb-[32px]">
            <h1>Jadwal PO</h1>
          </div>
          <div className="grid grid-cols-3 gap-[12px] text-[28px] font-bold text-white">
            <div className="bg-[#8E281C] flex items-center justify-center h-[80px] rounded-lg">
              <h1>Periode</h1>
            </div>
            <div className="bg-[#8E281C] flex items-center justify-center h-[80px] rounded-lg">
              <h1>Waktu Order</h1>
            </div>
            <div className="bg-[#8E281C] flex items-center justify-center h-[80px] rounded-lg">
              <h1>Waktu Pengiriman</h1>
            </div>
            {timetables.map((timetable) => (
              <React.Fragment key={timetable.id}>
                <div className="h-[80px] bg-[#F8F0DF] mt-[12px] flex justify-center items-center text-[24px] font-bold text-black rounded-lg">{timetable.id}</div>
                <div className="h-[80px] bg-[#F8F0DF] mt-[12px] flex justify-center items-center text-[24px] font-bold text-black rounded-lg">{timetable.day_order}</div>
                <div className="h-[80px] bg-[#F8F0DF] mt-[12px] flex justify-center items-center text-[24px] font-bold text-black rounded-lg">{timetable.day_delivery}</div>
              </React.Fragment>
              ))}
          </div>
            <div className="p-[24px] mt-[32px] bg-[#E9B75A] rounded-lg" style={{boxShadow:"10px 10px 30px #CA9A41, -10px -10px 30px #FFC965"}}>
              <div className="flex text-black font-bold mb-[16px]">
                <Image src={information} alt="information" height={24}/>
                <span className="ml-[12px]">Informasi</span>
              </div>
              <div className="font-normal">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
              </div>
            </div>
        </div>
        <div></div>
      </div>
      <div className="grid grid-cols-[auto_1280px_auto] bg-[#F8F0DF] py-[64px]">
        <div></div>
        <div>
          <div className="font-bold text-[32px] text-center mb-[32px]">
            <h1>Review</h1>
          </div>
          <div className="flex flex-col gap-[28px]">
            <div className="grid grid-cols-5 gap-[12px]">
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
            </div>
            <div className="grid grid-cols-5 gap-[12px]">
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
              <CardReview imageProfile={profile} name={"Junaidi"} reting={reting} comment={"Ask CDCR San Quintin State Prison 2008. We installed Purex dispensers throughout the prison to comba"}/>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="grid grid-cols-[auto_1280px_auto] bg-[#8E281C] text-white font-bold text-[12px] py-[32px]">
        <div></div>
        <div className="grid grid-rows-3 gap-[24px]">
          <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
            <Image src={Whatsapp} alt="Whatsapp" width={24}/>
            <p>085524976693</p>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
            <Image src={Gmail} alt="Gamil"/>
            <p>dynastybite03@gmail.com</p>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center h-auto gap-[8px]">
            <Image src={Address} alt="Address"/>
            <p>3517 W. Gray St. Utica, Pennsylvania 57867</p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

