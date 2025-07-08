type Props = {
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
};
const ConfirmDeleteContent = ({
  title = "Are you sure you want to delete this item?",
  message = "This action cannot be undone.",
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="mb-6 text-gray-700">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteContent;
