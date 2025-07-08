import { useEffect, useState } from "react";
import adminApi from "@api/adminApi.ts";
import CaretRightIcon from "@icons/CaretRightIcon.tsx";
import EyeIcon from "@icons/EyeIcon.tsx";
import CaretLeftIcon from "@icons/CaretLeftIcon.tsx";
import EyeSlashIcon from "@icons/EyeSlashIcon.tsx";
import useUIContext from "@hooks/useUIContext.ts";
import { useOutletContext } from "react-router-dom";
import { AdminLayoutContext } from "@components/layout/AdminRootLayout.tsx";
import NoResults from "@components/ui/NoResults.tsx";

const ITEMS_PER_PAGE = 10;

export type ContactForm = {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  );
  const { setUnreadContactFormCount } = useOutletContext<AdminLayoutContext>();
  const { showToast } = useUIContext();
  useEffect(() => {
    const loadContacts = async () => {
      const { data, total } = await adminApi.fetchContacts(
        currentPage,
        ITEMS_PER_PAGE,
      );
      setContacts(data);
      setTotal(total);
    };

    loadContacts();
  }, [currentPage]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const toggleContact = (id: string) => {
    setSelectedContactId((prev) => (prev === id ? null : id));
  };

  const handleSetAsRead = async (id: string) => {
    try {
      await adminApi.markContactAsRead(id);
      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id ? { ...contact, isRead: true } : contact,
        ),
      );
      showToast("success", "contact updated successfully!");
      const response = await adminApi.fetchUnreadContactCount();
      setUnreadContactFormCount(response.count);
    } catch (err) {
      showToast("error", "contact updated failed!");
      console.error("Failed to mark as read", err);
    }
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const sortedContacts = contacts.sort(
    (a, b) => Number(a.isRead) - Number(b.isRead),
  );
  return (
    <div className="w-full max-w-7xl mx-auto p-4 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Contact Messages
      </h2>
      {/* ContactPage List */}

      {sortedContacts.length === 0 ? (
        <NoResults title="No Contact Message Found" subtitle={""} />
      ) : (
        <>
          <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow ring-1 ring-gray-100 overflow-hidden">
            {sortedContacts.map((contact) => {
              const isSelected = selectedContactId === contact._id;

              return (
                <li
                  key={contact._id}
                  className={`group p-4 transition-colors duration-200 hover:bg-gray-50 cursor-pointer ${
                    contact.isRead ? "opacity-70" : "opacity-100"
                  }`}
                  onClick={() => toggleContact(contact._id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {contact.fullName}
                      </h4>
                      <p className="text-gray-600 text-sm">{contact.subject}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {contact.isRead ? (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeSlashIcon className="w-5 h-5 text-blue-500" />
                      )}
                      {!contact.isRead && (
                        <button
                          className="text-xs text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsRead(contact._id);
                          }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 text-sm text-gray-700">
                      <p className="mb-2 whitespace-pre-wrap leading-relaxed">
                        {contact.message}
                      </p>
                      <div className="text-gray-500  flex flex-col sm:flex-row sm:gap-4">
                        <span>{contact.email}</span>
                        <span>
                          {new Date(contact.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Pagination Arrows */}
          <div className="flex justify-end items-center mt-4 gap-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition
                ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-gray-400 text-gray-600 hover:text-black hover:border-black"
                }`}
            >
              <CaretLeftIcon className="w-5 h-5" />
            </button>

            <span className="text-sm text-gray-600">
              Page <strong>{currentPage}</strong> of{" "}
              <strong>{totalPages || 1}</strong>
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition
                ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-gray-400 text-gray-600 hover:text-black hover:border-black"
                }`}
            >
              <CaretRightIcon className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminContactsPage;
