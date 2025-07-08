import { useEffect, useState } from "react";
import ProfileComponent from "@pages/account/ProfileComponent.tsx";
import useAuthContext from "@hooks/useAuthContext.ts";
import Modal from "@components/ui/Modal.tsx";
import ProfileUpdateFormModalContent from "@pages/account/ProfileUpdateFormModalContent.tsx";
import CreditCardFormModalContent from "@pages/account/CreditCardFormModalContent.tsx";
import PaypalFormModalContent from "@pages/account/PaypalFormModalContent.tsx";

const ProfilePage = () => {
  const currentUser = useAuthContext().state.currentUser;
  if (!currentUser) return null;

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { fetchUserStats } = useAuthContext();

  useEffect(() => {
    if (currentUser.role === "user") fetchUserStats();
  }, [currentUser._id, fetchUserStats]);

  const handleOpenModal = (identifier: string) => setActiveModal(identifier);
  const handleCloseModal = () => setActiveModal(null);
  return (
    <>
      <Modal isOpen={activeModal === "credit-card"} onClose={handleCloseModal}>
        <CreditCardFormModalContent onModalClose={handleCloseModal} />
      </Modal>

      <Modal isOpen={activeModal === "paypal"} onClose={handleCloseModal}>
        <PaypalFormModalContent onModalClose={handleCloseModal} />
      </Modal>

      <Modal isOpen={activeModal === "edit-profile"} onClose={handleCloseModal}>
        <ProfileUpdateFormModalContent onModalClose={handleCloseModal} />
      </Modal>

      <ProfileComponent onOpenModal={handleOpenModal} />
    </>
  );
};

export default ProfilePage;
