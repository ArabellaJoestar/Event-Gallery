import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative text-black">

        {/*Botão para fechar modal*/}

        <button
          className="absolute top-3 right-3"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-lg font-bold mb-4">Tem certeza?</h2>
        <p className="mb-6">Você realmente quer realizar esta ação?</p>
        <div className="flex justify-end gap-3">
          {/*Botão para cancelar ação e fechar modal*/}
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          {/*Botão confirmar ação e fechar modal*/}
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;