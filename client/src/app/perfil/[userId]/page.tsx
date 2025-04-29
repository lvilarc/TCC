"use client";

import { getUserPhotos, useUser } from "@/hooks/User/useUser";
import { Info, MapPin, Lock, Camera, Award, Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import PhotosNavBar from "./_components/PhotosNavBar";
import TournamentTab from "./_components/TournamentTab";
import FeedTab from "./_components/FeedTab";
import Image from "next/image";

export default function PerfilPage() {
  const { userId } = useParams();

  const { data: user, isLoading, isError } = useUser(Number(userId));

  const {
    data: userPhotos,
    isLoading: isLoadingPhotos,
    isError: isErrorPhotos,
  } = getUserPhotos(Number(userId));

  const coverPhoto = userPhotos?.find((photo) => photo.type === "COVER_PHOTO");

  const profilePhoto = userPhotos?.find(
    (photo) => photo.type === "PROFILE_AVATAR"
  );

  const [navPage, setNavPage] = useState<"feed" | "tournament">("feed");

  if (isLoading || isLoadingPhotos) {
    return <div>Carregando perfil...</div>;
  }

  if (isError || isErrorPhotos) {
    return <div>Erro ao carregar perfil</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full relative h-[26vh]">
        <Image
          src={
            coverPhoto?.url ||
            "https://blog.iprocess.com.br/wp-content/uploads/2021/11/placeholder.png"
          } // URL da imagem ou um placeholder
          layout="fill" // Preenche o espaço da div
          objectFit="cover" // Garante que a imagem cubra o espaço sem distorcer
          alt="Foto de capa do usuário"
        />
        <div className="w-28 h-28 rounded-full border-2 absolute -bottom-10 left-12 overflow-hidden">
          <Image
            src={
              profilePhoto?.url ||
              "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
            } // URL da imagem ou um placeholder
            layout="fill" // Preenche o espaço da div
            objectFit="cover" // Garante que a imagem cubra o espaço sem distorcer
            alt="Foto de perfil do usuário"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 w-full h-full">
        <div className="flex flex-col col-span-1 p-12 gap-4">
          <span className="pt-2 font-semibold text-2xl">{user?.name}</span>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <Info />
              <span>{user?.photographerCategory}</span>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <MapPin />
              <span>Rio de janeiro, Brasil</span>
            </div>

            {/* Nova seção de progresso e ranking */}
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm">
              {/* Rank com badge */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Rank</p>
                  <p className="font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {user?.rank.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              {/* Nível */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Nível {user?.level}
                </span>
                <span className="text-xs text-gray-500">{user?.xp} XP</span>
              </div>

              {/* Barra de progresso XP */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                {/* Assumindo que cada nível requer 100 XP */}
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${user?.xp || 1 % 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {100 - (user?.xp || 1 % 100)} XP para o próximo nível
              </p>
            </div>

            {/* Achievements/Badges - Redesenhados */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Conquistas</h3>
              <div className="grid grid-cols-3 gap-3">
                {/* Fotógrafo Iniciante */}
                <div className="flex flex-col items-center bg-white rounded-lg p-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                    <Camera size={24} className="text-amber-600" />
                  </div>
                  <span className="text-xs font-medium text-center">Fotógrafo Iniciante</span>
                  <span className="text-[10px] text-gray-500">Publicou 5 fotos</span>
                </div>
                
                {/* 5 Participações */}
                <div className="flex flex-col items-center bg-white rounded-lg p-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <Award size={24} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-center">Participativo</span>
                  <span className="text-[10px] text-gray-500">5 torneios</span>
                </div>
                
                {/* Próxima conquista */}
                <div className="flex flex-col items-center bg-white rounded-lg p-2 border border-gray-100 shadow-sm hover:shadow-md transition-shadow opacity-70">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                    <Lock size={24} className="text-gray-400" />
                  </div>
                  <span className="text-xs font-medium text-center">Bloqueado</span>
                  <span className="text-[10px] text-gray-500">Próximo nível</span>
                </div>
              </div>
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
