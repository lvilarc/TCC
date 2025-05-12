type PerfilNavBarProps = {
  setNavPage: React.Dispatch<React.SetStateAction<"feed" | "tournament" | "comunidade">>;
  navPage: "feed" | "tournament" | "comunidade";
};

export default function PerfilNavBar({
  setNavPage,
  navPage,
}: PerfilNavBarProps) {
  return (
    <nav className="p-4 mt-10 border-b-2">
      <ul className="flex justify-start space-x-8">
        <li>
          <a
            href="#feed"
            className={
              navPage === "feed"
                ? "text-gray-800 border-b-2 border-black pb-5 font-bold"
                : "text-gray-600 hover:text-gray-800 font-semibold"
            }
            onClick={() => setNavPage("feed")}
          >
            Feed
          </a>
        </li>
        <li>
          <a
            href="#torneios"
            className={
              navPage === "tournament"
                ? "text-gray-800 border-b-2 border-black pb-5 font-bold"
                : "text-gray-600 hover:text-gray-800 font-semibold"
            }
            onClick={() => setNavPage("tournament")}
          >
            Torneios
          </a>
        </li>
        <li>
          <a
            href="#comunidade"
            className={
              navPage === "comunidade"
                ? "text-gray-800 border-b-2 border-black pb-5 font-bold"
                : "text-gray-600 hover:text-gray-800 font-semibold"
            }
            onClick={() => setNavPage("comunidade")}
          >
            Comunidade
          </a>
        </li>
      </ul>
    </nav>
  );
}
