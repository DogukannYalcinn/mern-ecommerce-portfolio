export interface ImageFile {
  id: string;
  type: "file";
  file: File;
  preview: string;
}

export const ImageFileReader = (
  files: File[],
  callback: (previewImages: ImageFile[]) => void,
) => {
  const images: ImageFile[] = [];

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        images.push({
          id: crypto.randomUUID(),
          file,
          type: "file",
          preview: reader.result.toString(),
        });

        if (images.length === files.length) {
          callback(images);
        }
      }
    };
    reader.readAsDataURL(file);
  });
};

export default ImageFileReader;
