import { useEffect, useState } from "react";
import AdminImagePicker, {
  ImageFile,
} from "@components/ui/AdminImagePicker.tsx";
import adminApi from "@api/adminApi.ts";
import EditIcon from "@icons/EditIcon.tsx";
import TrashBinIcon from "@icons/TrashBinIcon.tsx";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";
import useUIContext from "@hooks/useUIContext.ts";
import Modal from "@components/ui/Modal.tsx";
import ImageFileReader from "@utils/ImageFileReader.ts";
import { validateSlider } from "@utils/formValidations.ts";
import { SliderType } from "../../context/ProductContext.tsx";

import { AdminGeneralSettingProps } from "@pages/admin/AdminGeneralSettingsPage.tsx";
import FormErrorMessage from "@components/ui/FormErrorMessage.tsx";
import LinkCreator from "@pages/admin/LinkCreator.tsx";
import ConfirmDeleteContent from "@pages/admin/ConfirmDeleteContent.tsx";

type State = {
  sliders: SliderType[];
  selectedSlider: SliderType | null;
  isDeleteMode: boolean;
  validationErrors: string[];
  isModalOpen: boolean;
};

const SliderManager = ({ setIsLoading }: AdminGeneralSettingProps) => {
  const [state, setState] = useState<State>({
    sliders: [],
    selectedSlider: null,
    isDeleteMode: false,
    validationErrors: [],
    isModalOpen: false,
  });
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const { showToast } = useUIContext();

  useEffect(() => {
    const fetchSlider = async () => {
      const sliders = await adminApi.getSlider();
      setState((prevState) => ({ ...prevState, sliders: sliders }));
    };
    fetchSlider();
  }, []);

  const handleSelectSliderAndMode = (
    action: "create" | "edit" | "delete",
    slider?: SliderType,
  ) => {
    setState((prev) => ({
      ...prev,
      selectedSlider: action === "create" ? null : (slider ?? null),
      isDeleteMode: action === "delete",
      isModalOpen: true,
      validationErrors: [],
    }));
  };

  const handleFileSelect = async (files: File[]) => {
    console.log(files);
    try {
      ImageFileReader(files, (newImages) => {
        setUploadedImages((prevState) => [...prevState, ...newImages]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageRemove = async (id: string) => {
    if (!id) return;
    const image = uploadedImages.findIndex((img) => img.id === id) !== -1;
    if (!image) return;
    setUploadedImages((prevState) => prevState.filter((img) => img.id !== id));
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subtitle = formData.get("subtitle") as string;

    const errors = validateSlider({
      link: generatedUrl,
      subtitle,
      title,
      description,
    });

    const isEdit = !!state.selectedSlider;

    if (!isEdit && uploadedImages.length !== 1) {
      errors.push("Please upload exactly 1 image.");
    }

    if (isEdit && uploadedImages.length > 1) {
      errors.push("You can only upload one image.");
    }

    if (errors.length > 0) {
      setState((prev) => ({ ...prev, validationErrors: errors }));
      return;
    }

    if (uploadedImages.length === 1) {
      formData.append("images", uploadedImages[0].file);
    }

    //Set Slider Link
    formData.set("link", generatedUrl);

    try {
      handleFormClose();
      setIsLoading(true);
      const response =
        state.selectedSlider && state.selectedSlider._id
          ? await adminApi.editSlider(state.selectedSlider._id, formData)
          : await adminApi.createSlider(formData);

      setState((prev) => {
        const updated = state.selectedSlider
          ? prev.sliders.map((item) =>
              item._id === response._id ? response : item,
            )
          : [...prev.sliders, response];

        return {
          ...prev,
          sliders: updated,
          isModalOpen: false,
          selectedSlider: null,
          validationErrors: [],
        };
      });
      setUploadedImages([]);
      showToast(
        "success",
        `Slider ${state.selectedSlider ? "updated" : "created"} successfully`,
      );
    } catch (err: any) {
      const message = err.response?.data?.message;
      showToast(
        "error",
        message ||
          `Slider ${state.selectedSlider ? "update" : "create"} failed`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSlider = async () => {
    if (!state.selectedSlider) return;

    try {
      handleFormClose();
      setIsLoading(true);
      await adminApi.deleteSlider(state.selectedSlider._id);

      const updatedSliders = state.sliders.filter(
        (slider) => slider._id !== state.selectedSlider!._id,
      );

      setState((prev) => ({
        ...prev,
        sliders: updatedSliders,
      }));
      showToast("success", "slider deleted successfully");
    } catch (err) {
      showToast("error", "slider deletion failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormClose = () => {
    setState((prevState) => ({
      ...prevState,
      isModalOpen: false,
      selectedSlider: null,
    }));
    setUploadedImages([]);
  };

  const getFormByMode = () => {
    if (state.isDeleteMode) {
      return (
        <ConfirmDeleteContent
          onCancel={handleFormClose}
          onConfirm={handleDeleteSlider}
        />
      );
    }

    return (
      <div className="space-y-4 p-6">
        <ul className="list-disc pl-6 text-red-500">
          {state.validationErrors.map((error, idx) => (
            <li key={idx}>
              <FormErrorMessage message={error} />
            </li>
          ))}
        </ul>

        <form onSubmit={handleOnSubmit} className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slider Title
              </label>
              <input
                type="text"
                name="title"
                defaultValue={state.selectedSlider?.title || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* SubTitle Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slider Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                defaultValue={state.selectedSlider?.subtitle || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={state.selectedSlider?.description || ""}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Link Creator */}

          <LinkCreator onChange={setGeneratedUrl} />

          {/* Current Image */}
          {state.selectedSlider?.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Image
              </label>
              <img
                src={`http://localhost:4000/images/${state.selectedSlider.imageUrl}`}
                alt="HeroSlider"
                className="w-full h-auto object-contain border rounded-md"
              />
            </div>
          )}

          <AdminImagePicker
            pickerId={"slider"}
            key={"sliderManager"}
            images={uploadedImages}
            onImagesSelect={handleFileSelect}
            onImageRemove={handleImageRemove}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleFormClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              {state.selectedSlider ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <>
      <Modal
        key={state.isModalOpen ? "open" : "close"}
        isOpen={state.isModalOpen}
        onClose={handleFormClose}
        size="large"
      >
        {getFormByMode()}
      </Modal>

      <div className="flex justify-end py-2">
        <button
          onClick={() => handleSelectSliderAndMode("create")}
          className="inline-flex items-center gap-1 whitespace-nowrap bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <CirclePlusIcon className="w-4 h-4" />
          <span>Add Slider</span>
        </button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {state.sliders.map((slider) => (
          <li
            key={slider._id}
            className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition flex flex-col"
          >
            {/* Image Top Full Width */}
            <div className="w-full h-44 sm:h-52 md:h-60">
              <img
                src={`http://localhost:4000/images/${slider.imageUrl}`}
                alt={slider.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-4 flex-1">
              <div>
                <h3 className="text-lg font-bold text-gray-800 capitalize">
                  {slider.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2 first-letter:capitalize">
                  {slider.description}
                </p>
                <a
                  href={slider.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm mt-2 inline-block hover:underline"
                >
                  Visit Link
                </a>
              </div>

              <div className="flex justify-end gap-4 text-sm mt-4">
                <button
                  className="hover:text-yellow-500 flex gap-1 items-center"
                  onClick={() => handleSelectSliderAndMode("edit", slider)}
                >
                  <EditIcon className="h-5 w-5" />
                  <span>Edit</span>
                </button>
                <button
                  className="hover:text-red-500 flex gap-1 items-center"
                  onClick={() => handleSelectSliderAndMode("delete", slider)}
                >
                  <TrashBinIcon className="h-5 w-5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SliderManager;
