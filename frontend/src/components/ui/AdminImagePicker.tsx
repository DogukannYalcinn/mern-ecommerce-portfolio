import { useRef } from "react";
import UploadIcon from "@icons/UploadIcon.tsx";
import CloseIcon from "@icons/CloseIcon.tsx";

export interface ImageFile {
  id: string;
  type: "file";
  file: File;
  preview: string;
}

interface ImagePickerProps {
  images: ImageFile[];
  onImagesSelect: (files: File[]) => void;
  onImageRemove: (id: string) => void;
  pickerId: string;
}
const AdminImagePicker: React.FC<ImagePickerProps> = ({
  images,
  onImagesSelect,
  onImageRemove,
  pickerId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const filesArray = Array.from(event.target.files);
    onImagesSelect(filesArray);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <label
        htmlFor={`image-picker-${pickerId}`}
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition"
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <UploadIcon className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-600">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-400">JPG, PNG, JPEG, (max 5MB)</p>
        </div>
        <input
          id={`image-picker-${pickerId}`}
          type="file"
          multiple
          className="hidden"
          onChange={handleImageChange}
          ref={fileInputRef}
        />
      </label>

      <div className="flex flex-wrap gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative w-32 h-32 overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <button type="button">
              <img
                src={image.preview}
                alt={image.file.name}
                className="w-full h-full object-cover transition duration-300 group-hover:opacity-90"
              />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onImageRemove(image.id)}
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <CloseIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminImagePicker;
