"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => { router.push('/torneios') }, [router])

  return (
    <div className="w-full h-full flex justify-center items-center overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Mapeando a lista de jogos para criar os GameCards */}
        {/* {jogos.map((jogo) => (
          <GameCard
            key={jogo.id}
            imageSrc={jogo.imageSrc}
            title={jogo.title}
            championshipId={jogo.id}
          />
        ))} */}
      </div>
    </div>
  );
}
