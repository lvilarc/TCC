"use client";

import { useUser } from "@/hooks/User/useUser";
import { Info, MapPin } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import AddPhotoCard from "./_components/AddPhotoCard";
import { useState } from "react";
import PhotosNavBar from "./_components/PhotosNavBar";
import TournamentTab from "./_components/TournamentTab";
import FeedTab from "./_components/FeedTab";

export default function PerfilPage() {
  const { userId } = useParams();

  const { data, isLoading, isError } = useUser(Number(userId));

  const [navPage, setNavPage] = useState<"feed" | "tournament">("feed");

  console.log(data);

  if (isLoading) {
    return <div>Carregando perfil...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar perfil</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full relative h-[26vh] bg-red-600">
        {/* <Image
          src={"https://wallpapers.com/images/featured/4k-praia-5uo4p0ijzi3jgrv5.jpg"} // Coloque o caminho ou URL da sua imagem
          layout="fill" // Preenche o espaço da div
          objectFit="cover" // Garante que a imagem cubra o espaço sem distorcer
          alt="Descrição da imagem"
        ></Image> */}
        <div className="w-28 h-28 rounded-full border-2 bg-blue-400 absolute -bottom-10 left-12"></div>
      </div>

      <div className="grid grid-cols-4 w-full h-full">
        <div className="flex flex-col col-span-1 p-12 gap-4">
          <span className="pt-2 font-semibold text-2xl">{data?.name}</span>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <Info />
              <span>{data?.photographerCategory}</span>
            </div>

            <div className="flex flex-row gap-2">
              <MapPin />
              <span>Rio de janeiro, Brasil</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col col-span-3">
          <PhotosNavBar
            setNavPage={setNavPage}
            navPage={navPage}
          ></PhotosNavBar>

          {navPage === "tournament" && <TournamentTab></TournamentTab>}
          {navPage === "feed" && <FeedTab></FeedTab>}
        </div>
      </div>
    </div>
  );
}
