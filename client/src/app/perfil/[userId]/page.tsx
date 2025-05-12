"use client";

import { getUserPhotos, useUser } from "@/hooks/User/useUser";
import { Info, MapPin, Lock, Camera, Award, Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import PhotosNavBar from "./_components/PhotosNavBar";
import TournamentTab from "./_components/TournamentTab";
import FeedTab from "./_components/FeedTab";
import Image from "next/image";
import { UserCircle } from "@/components/icons/UserCircle";
import PerfilNavBar from "./_components/PhotosNavBar";
import { useAuthContext } from "@/hooks/AuthContext/useAuthContext";
import ComunidadeTab from "./_components/ComunidadeTab";

export default function PerfilPage() {
  const { userId } = useParams();

  const { data: userData, isLoading, isError } = useUser(Number(userId));
  const { user } = useAuthContext();

  const isOwner = Number(userId) === user?.id;

  const {
    data: userPhotos,
    isLoading: isLoadingPhotos,
    isError: isErrorPhotos,
  } = getUserPhotos(Number(userId));

  const coverPhoto = userPhotos?.find((photo) => photo.type === "COVER_PHOTO");

  const profilePhoto = userPhotos?.find(
    (photo) => photo.type === "PROFILE_AVATAR"
  );

  const [navPage, setNavPage] = useState<"feed" | "tournament" | "comunidade">("feed");

  if (isLoading || isLoadingPhotos) {
    return <div>Carregando perfil...</div>;
  }

  if (isError || isErrorPhotos) {
    return <div>Erro ao carregar perfil</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mt-[-12px]">
      <div className="w-full relative h-[26vh]">
        {coverPhoto?.url ? (
          <Image
            src={coverPhoto.url}
            layout="fill"
            objectFit="cover"
            alt="Foto de capa do usuário"
          />
        ) : (
          <div className="w-full h-full bg-stone-200" />
        )}
        <div className="w-28 h-28 rounded-full border-2 absolute -bottom-10 left-12 overflow-hidden bg-white flex items-center justify-center">
          {profilePhoto?.url ? (
            <Image
              src={profilePhoto.url}
              layout="fill"
              objectFit="cover"
              alt="Foto de perfil do usuário"
            />
          ) : (
            <UserCircle size={112} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 w-full h-full">
        <div className="flex flex-col col-span-1 p-12 gap-4">
          <span className="pt-2 font-semibold text-2xl">{userData?.name}</span>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <Info />
              <span>{userData?.photographerCategory}</span>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <MapPin />
              <span>Rio de janeiro, Brasil</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col col-span-3 mr-12">
          <PerfilNavBar
            setNavPage={setNavPage}
            navPage={navPage}
          ></PerfilNavBar>

          {navPage === "feed" && <FeedTab userId={Number(userId)} isOwner={isOwner}></FeedTab>}
          {navPage === "tournament" && <TournamentTab userId={Number(userId)}></TournamentTab>}
          {navPage === "comunidade" && <ComunidadeTab userId={Number(userId)}></ComunidadeTab>}
        </div>
      </div>
    </div>
  );
}
