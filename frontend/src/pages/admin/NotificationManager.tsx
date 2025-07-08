import { useEffect, useRef, useState } from "react";
import Modal from "@components/ui/Modal.tsx";
import adminApi from "@api/adminApi.ts";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";
import TrashBinIcon from "@icons/TrashBinIcon.tsx";
import useUIContext from "@hooks/useUIContext.ts";
import { AdminGeneralSettingProps } from "@pages/admin/AdminGeneralSettingsPage.tsx";
import FormErrorMessage from "@components/ui/FormErrorMessage.tsx";
import LinkCreator from "@pages/admin/LinkCreator.tsx";
import ConfirmDeleteContent from "@pages/admin/ConfirmDeleteContent.tsx";

export type Promo = { _id: string; message: string; link: string };

type StateType = {
  promos: Promo[];
  isModalOpen: boolean;
  validationErrors: string[];
  deletePromoId?: string;
};

const NotificationManager = ({ setIsLoading }: AdminGeneralSettingProps) => {
  const [state, setState] = useState<StateType>({
    promos: [],
    isModalOpen: false,
    validationErrors: [],
  });
  const [generatedUrl, setGeneratedUrl] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const { showToast } = useUIContext();

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const promos = await adminApi.getPromos();
        setState((prev) => ({ ...prev, promos: promos }));
      } catch (error) {
        console.error("Failed to fetch promos", error);
      }
    };

    fetchPromos();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = messageRef.current?.value;

    const errors: string[] = [];
    if (!message || !message.trim()) errors.push("Message is required.");
    if (!generatedUrl.trim()) errors.push("Link is required.");

    if (errors.length > 0) {
      setState((prev) => ({ ...prev, validationErrors: errors }));
      return;
    }

    try {
      handleModalClose();
      setIsLoading(true);

      //message guaranteed
      const newPromo = await adminApi.createPromo(message!, generatedUrl);
      setState((prev) => ({
        ...prev,
        promos: [...prev.promos, newPromo],
        validationErrors: [],
      }));
      showToast("success", "promo created successfully.");
    } catch (error) {
      console.error("Create promo error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () =>
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      deletePromoId: undefined,
      validationErrors: [],
    }));

  const handleDeletePromo = async () => {
    if (!state.deletePromoId) return;
    try {
      handleModalClose();
      setIsLoading(true);
      await adminApi.deletePromo(state.deletePromoId);

      setState((prevState) => ({
        ...prevState,
        promos: prevState.promos.filter((p) => p._id !== state.deletePromoId),
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={state.isModalOpen} onClose={handleModalClose}>
        {state.deletePromoId ? (
          <ConfirmDeleteContent
            onCancel={handleModalClose}
            onConfirm={handleDeletePromo}
          />
        ) : (
          <div className="space-y-4 p-6">
            <ul className="list-disc pl-6 text-red-500">
              {state.validationErrors.map((error, idx) => (
                <li key={idx}>
                  <FormErrorMessage message={error} />
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Create Promotion
              </h2>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Message
                </label>
                <textarea
                  name="message"
                  className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Write your promotional message..."
                  ref={messageRef}
                />
              </div>
              <LinkCreator onChange={setGeneratedUrl} />
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
                  className="w-1/3 self-end py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <div className="flex justify-end py-2">
        <button
          onClick={() =>
            setState((prevState) => ({ ...prevState, isModalOpen: true }))
          }
          className="inline-flex items-center gap-1 whitespace-nowrap bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <CirclePlusIcon className="w-4 h-4" />
          <span>Add Promo</span>
        </button>
      </div>
      <ul className="divide-y divide-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
        {state.promos.map((promo) => (
          <li
            key={promo._id}
            className="flex items-start justify-between p-4 hover:bg-gray-50 transition"
          >
            <div>
              <p className="text-gray-900 font-medium">{promo.message}</p>
              {promo.link && (
                <a
                  href={promo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline break-all"
                >
                  {promo.link}
                </a>
              )}
            </div>

            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  isModalOpen: true,
                  deletePromoId: promo._id,
                }))
              }
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <TrashBinIcon className="w-5 h-5" />
              <span>Delete</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
export default NotificationManager;
