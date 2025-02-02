interface GameCardProps {
    imageSrc?: string;
    title: string;
}

export default function GameCard({ title }: GameCardProps) {
    return (
        <div className="w-[500px] rounded-lg overflow-hidden shadow-md border-2 cursor-pointer hover:border-stone-500">
            {/* Imagem */}
            <div
                className="w-full h-64 bg-stone-100"
            />
            {/* Título */}
            <div className="p-4 bg-stone-800 text-white text-center">
                <h2 className="text-xl font-bold">{title}</h2>
            </div>
        </div>
    );
}