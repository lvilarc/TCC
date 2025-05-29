"use client";

import { getUserPhotos, useUser } from "@/hooks/User/useUser";
import { Info, MapPin, Lock, Camera, Award, Trophy, Save, Edit, X } from "lucide-react";
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
import { useUpdateUserDescription } from "@/hooks/User/useUpdateUserDescription";
import UploadProfilePhotoModal from "@/components/UploadProfilePhotoModal";

export default function PerfilPage() {
  const { userId } = useParams();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  // const { updateProfilePhoto, isPending: isUpdatingPhoto } = useUpdateProfilePhoto();

  const { data: userData, isLoading, isError } = useUser(Number(userId));
  const { user } = useAuthContext();
  const isOwner = Number(userId) === user?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(userData?.desc || "");

  const {
    updateDescription,
    isPending: isSaving,
    error: updateError
  } = useUpdateUserDescription();

  const handleEditDescription = () => {
    setIsEditing(true);
    setNewDescription(userData?.desc || "");
  };

  const handleSaveDescription = async () => {
    try {
      await updateDescription({ desc: newDescription });
      setIsEditing(false);
    } catch (error) {
      // O erro já é tratado pelo hook, mas você pode adicionar tratamento adicional aqui se necessário
      console.error("Falha ao atualizar descrição:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewDescription(userData?.desc || "");
  };

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
        <div className="w-28 h-28 rounded-full border-2 absolute -bottom-10 left-12 bg-white flex items-center justify-center">
          {profilePhoto?.url ? (
            <Image
              src={profilePhoto.url}
              layout="fill"
              objectFit="cover"
              alt="Foto de perfil do usuário"
              className="rounded-full"
            />
          ) : (
            <UserCircle size={112} />
          )}
          {isOwner && (
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="absolute bottom-0 right-0 bg-white border border-gray-200 shadow-md text-stone-800 p-2 rounded-full"
              aria-label="Editar foto de perfil"
            >
              <Edit size={16} />
            </button>
          )}
        </div>
      </div>

      {isPhotoModalOpen && (
        <UploadProfilePhotoModal
          onClose={() => setIsPhotoModalOpen(false)}
          currentPhotoUrl={profilePhoto?.url}
        />
      )}

      <div className="grid grid-cols-4 w-full h-full">
        <div className="flex flex-col col-span-1 p-12 gap-4">
          <span className="pt-2 font-semibold text-2xl">{userData?.name}</span>
          {/* Área de descrição com edição */}
          <div className="relative">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                  rows={8}
                  maxLength={200}
                  placeholder="Digite sua descrição..."
                />
                <div className="flex gap-2 w-full justify-between font-medium">
                  <p className="text-xs text-gray-500 text-right truncate ml-2">
                    {newDescription.length}/200 caracteres
                  </p>
                  <div className="flex gap-2 justify-end font-medium">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1 rounded-md text-sm text-gray-500 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveDescription}
                      disabled={isSaving}
                      className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-900 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {isSaving ? "Salvando..." : "Salvar"}
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="relative pr-6">
                <p className="text-gray-700 text-sm">
                  {userData?.desc || "Usuário ainda não adicionou uma descrição."}
                </p>
                {isOwner && (
                  <button
                    onClick={handleEditDescription}
                    className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
                    aria-label="Editar descrição"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
            )}
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
