import { useRouter } from 'next/navigation'; // Next.js 13+

type PerfilNavBarProps = {
  setNavPage: React.Dispatch<React.SetStateAction<"feed" | "tournament" | "comunidade">>;
  navPage: "feed" | "tournament" | "comunidade";
};

export default function PerfilNavBar({
  setNavPage,
  navPage,
}: PerfilNavBarProps) {
  const router = useRouter();

  const handleNavClick = (page: "feed" | "tournament" | "comunidade") => {
    setNavPage(page);
    // Atualiza a URL sem adicionar ao histórico
    router.replace(`#${page}`, { scroll: false });
  };

  return (
    <nav className="p-4 mt-10 border-b-2">
      <ul className="flex justify-start space-x-8">
        <li>
          <button
            className={
              navPage === "feed"
                ? "text-gray-800 border-b-2 border-black pb-5 font-bold"
                : "text-gray-600 hover:text-gray-800 font-semibold"
            }
            onClick={() => handleNavClick("feed")}
          >
            Feed
          </button>
        </li>
        <li>
          <button
            className={
              navPage === "tournament"
                ? "text-gray-800 border-b-2 border-black pb-5 font-bold"
                : "text-gray-600 hover:text-gray-800 font-semibold"
            }
            onClick={() => handleNavClick("tournament")}
          >
            Torneios
          </button>
        </li>
        <li>
          <button
            className={
              navPage === "comunidade"
                ? "text-gray-800 border-b-2 border-black pb-5 font-bold"
                : "text-gray-600 hover:text-gray-800 font-semibold"
            }
            onClick={() => handleNavClick("comunidade")}
          >
            Comunidade
          </button>
        </li>
      </ul>
    </nav>
  );
}