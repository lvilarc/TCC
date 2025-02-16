export default function Championship() {
  const jogo = {
    id: 1,
    title: "Arte Urbana",
    imageSrc: "https://via.placeholder.com/500x300.png?text=Arte+Urbana",
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <p>{jogo.title}</p>
    </div>
  );
}
