"use client";

import { useUser } from "@/hooks/User/useUser";
import { Info, MapPin } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function PerfilPage() {
  const { userId } = useParams();

  const { data, isLoading, isError } = useUser(Number(userId));

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
        <div className="flex flex-col cols-span-1 p-12 gap-4">
          <span className="pt-2 font-semibold text-2xl">{data?.name}</span>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <Info />
              <span>Fotógrafo de esportes</span>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <MapPin />
              <span>Rio de janeiro, Brasil</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap cols-span-3 gap-1 p-12"></div>
      </div>
    </div>
  );
}
