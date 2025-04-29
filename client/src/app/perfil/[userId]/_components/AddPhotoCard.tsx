export default function AddPhotoCard() {
  return (
    <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center h-60 w-96">
      <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
          <span>+</span>
        </div>
      </div>
      <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full mb-4">
        Adicionar Foto
      </button>
      <p className="text-gray-500">
        Receba feedback, exibições e avaliações. <br />
        Projetos públicos podem receber destaque de nossos curadores.
      </p>
    </div>
  );
}
