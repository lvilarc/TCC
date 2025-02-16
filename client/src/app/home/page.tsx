import GameCard from "@/components/TournamentCard";
import Image from "next/image";

export default function Home() {
  const jogos = [
    {
      id: 1,
      title: "Arte Urbana",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Arte+Urbana",
    },
    {
      id: 2,
      title: "Rio de Janeiro",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+2",
    },
    {
      id: 3,
      title: "Praia",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+3",
    },
    {
      id: 4,
      title: "Jogo 4",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+4",
    },
    {
      id: 5,
      title: "Jogo 5",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+5",
    },
    {
      id: 6,
      title: "Jogo 6",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+6",
    },
    {
      id: 7,
      title: "Jogo 7",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+7",
    },
    {
      id: 8,
      title: "Jogo 8",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+8",
    },
    {
      id: 9,
      title: "Jogo 9",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+9",
    },
    {
      id: 10,
      title: "Jogo 10",
      imageSrc: "https://via.placeholder.com/500x300.png?text=Jogo+10",
    },
  ];

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
