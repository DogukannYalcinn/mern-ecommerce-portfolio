import { useEffect, useState } from "react";
import { AdminGeneralSettingProps } from "@pages/admin/AdminGeneralSettingsPage.tsx";
import adminApi from "@api/adminApi.ts";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";
import Modal from "@components/ui/Modal.tsx";
import AdminImagePicker, {
  ImageFile,
} from "@components/ui/AdminImagePicker.tsx";
import ImageFileReader from "@utils/ImageFileReader.ts";
import useUIContext from "@hooks/useUIContext.ts";
import TrashBinIcon from "@icons/TrashBinIcon.tsx";
import EyeIcon from "@icons/EyeIcon.tsx";
import EyeSlashIcon from "@icons/EyeSlashIcon.tsx";
import ConfirmDeleteContent from "@pages/admin/ConfirmDeleteContent.tsx";

export type AnnouncementType = {
  _id: string;
  message: string;
  backgroundImage: string;
  isActive: boolean;
};

type State = {
  announcements: AnnouncementType[];
  selectedAnnouncement: AnnouncementType | null;
  modalMode: string;
  validationErrors: string[];
};

const AnnouncementManager = ({ setIsLoading }: AdminGeneralSettingProps) => {
  const [state, setState] = useState<State>({
    announcements: [],
    selectedAnnouncement: null,
    modalMode: "",
    validationErrors: [],
  });
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const { showToast } = useUIContext();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const announcements = await adminApi.fetchAnnouncements();
        setState((prev) => ({ ...prev, announcements: announcements }));
      } catch (error) {
        console.error("Failed to fetch promos", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleUpdateAnnouncementStatus = async (
    announcementId: string,
    isActive: boolean,
  ) => {
    if (!announcementId) return;

    try {
      setIsLoading(true);
      const updatedAnnouncement = await adminApi.toggleAnnouncement(
        announcementId,
        isActive,
      );
      setState((prev) => ({
        ...prev,
        announcements: prev.announcements.map((a) =>
          a._id === updatedAnnouncement._id
            ? updatedAnnouncement
            : { ...a, isActive: false },
        ),
        selectedAnnouncement: null,
        modalMode: "",
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = (announcement: AnnouncementType) => {
    setState((prevState) => ({
      ...prevState,
      modalMode: "delete",
      selectedAnnouncement: announcement,
    }));
  };

  const handleDeleteAnnouncement = async () => {
    if (!state.selectedAnnouncement) return;

    try {
      setIsLoading(true);

      await adminApi.deleteAnnouncement(state.selectedAnnouncement._id);

      setState((prev) => ({
        ...prev,
        announcements: prev.announcements.filter(
          (a) => a._id !== state.selectedAnnouncement!._id,
        ),
        selectedAnnouncement: null,
        modalMode: "",
      }));
      showToast("success", "Announcement deleted successfully");
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setUploadedImages([]);
    setState((prev) => ({
      ...prev,
      modalMode: "",
      selectedAnnouncement: null,
      validationErrors: [],
    }));
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const errors: string[] = [];
    const message = formData.get("message") as string;

    if (!message) errors.push("Announcement message is required.");

    if (uploadedImages.length !== 1) {
      errors.push("Please upload exactly 1 image.");
    }

    if (errors.length > 0) {
      setState((prev) => ({ ...prev, validationErrors: errors }));
      return;
    }

    formData.append("images", uploadedImages[0].file);

    try {
      handleModalClose();
      setIsLoading(true);
      await adminApi.createAnnouncement(formData);
      const announcements = await adminApi.fetchAnnouncements();

      setState((prevState) => ({
        ...prevState,
        announcements,
        selectedAnnouncement: null,
      }));

      showToast("success", `Announcement created successfully`);
    } catch (err) {
      console.log(err);
      showToast("error", `Announcement create failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (files: File[]) => {
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
  const sortByActiveAnnouncements = state.announcements.sort(
    (a, b) => Number(b.isActive) - Number(a.isActive),
  );

  return (
    <>
      <Modal isOpen={state.modalMode !== ""} onClose={handleModalClose}>
        {state.modalMode === "delete" && (
          <ConfirmDeleteContent
            onCancel={handleModalClose}
            onConfirm={handleDeleteAnnouncement}
          />
        )}
        {state.modalMode === "create" && (
          <form onSubmit={handleOnSubmit} className="space-y-4 p-6">
            <ul className="list-disc">
              {state.validationErrors?.map((error) => (
                <li key={error} className="text-sm text-red-500 capitalize">
                  {error}
                </li>
              ))}
            </ul>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Announcement Message
              </label>
              <textarea
                name="message"
                defaultValue={state.selectedAnnouncement?.message || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Current Background Image */}
            {state.selectedAnnouncement?.backgroundImage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Background
                </label>
                <img
                  src={`http://localhost:4000/images/${state.selectedAnnouncement.backgroundImage}`}
                  alt="Announcement"
                  className="w-full h-auto object-contain border rounded-md"
                />
              </div>
            )}

            {/* Image Picker */}
            <AdminImagePicker
              pickerId="announcement"
              key="announcementManager"
              images={uploadedImages}
              onImagesSelect={handleFileSelect}
              onImageRemove={handleImageRemove}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {state.selectedAnnouncement ? "Update" : "Create"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <div className="flex flex-col gap-4">
        <div className="self-end">
          <button
            onClick={() =>
              setState((prevState) => ({ ...prevState, modalMode: "create" }))
            }
            className="inline-flex items-center gap-1 whitespace-nowrap bg-blue-600 text-white px-4 py-2 shadow hover:bg-blue-700 transition rounded-lg"
          >
            <CirclePlusIcon className="w-4 h-4" />
            <span>Add Announcement</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {sortByActiveAnnouncements.map((announcement) => (
            <div
              key={announcement._id}
              className="relative h-16 w-full shadow-md rounded"
            >
              {/* Background Image */}
              <img
                src={`http://localhost:4000/images/${announcement.backgroundImage}`}
                alt="Announcement Background"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  announcement.isActive ? "opacity-100" : "opacity-30"
                }`}
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 z-0" />

              {/* Content */}
              <div className="relative z-10 flex justify-between items-center h-full px-4">
                <p className="uppercase tracking-wider font-semibold text-sm md:text-base text-gray-900 drop-shadow-sm">
                  {announcement.message}
                </p>

                <div className="flex items-center gap-2">
                  {/* Toggle Visibility Button */}
                  <div className="relative group">
                    <button
                      aria-label={
                        announcement.isActive
                          ? "Disable Announcement"
                          : "Enable Announcement"
                      }
                      onClick={() =>
                        handleUpdateAnnouncementStatus(
                          announcement._id,
                          !announcement.isActive,
                        )
                      }
                      className="px-3 py-1 rounded bg-gray-800/50 hover:bg-gray-800 transition text-white"
                    >
                      {announcement.isActive ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                      )}
                    </button>
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                      {announcement.isActive ? "Disable" : "Enable"}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <div className="relative group">
                    <button
                      onClick={() => onDelete(announcement)}
                      className="px-3 py-1 rounded bg-gray-800/50 hover:bg-gray-800 transition text-white"
                    >
                      <TrashBinIcon className="h-5 w-5" />
                    </button>
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                      Delete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default AnnouncementManager;
