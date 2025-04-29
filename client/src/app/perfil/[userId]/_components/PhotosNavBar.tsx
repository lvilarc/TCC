type PhotosNabBarProps = {
  setNavPage: React.Dispatch<React.SetStateAction<"feed" | "tournament">>;
  navPage: "feed" | "tournament";
};

export default function PhotosNavBar({
  setNavPage,
  navPage,
}: PhotosNabBarProps) {
  return (
    <nav className="p-4 mt-10 border-b-2 mr-12">
      <ul className="flex justify-start space-x-8">
        <li>
          <a
            href="#"
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
            href="#"
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
      </ul>
    </nav>
  );
}
