import { FormEvent, useRef, useState } from "react";
import useUIContext from "@hooks/useUIContext.ts";
import PhoneIcon from "@icons/PhoneIcon.tsx";
import EnvelopeIcon from "@icons/EnvelopeIcon.tsx";
import MapPinIcon from "@icons/MapPinIcon.tsx";
import ClockIcon from "@icons/ClockIcon.tsx";
import userApi from "@api/userApi.ts";

export type ContactForm = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useUIContext();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current!);
    const fullName = formData.get("fullName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const subject = formData.get("subject")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!fullName || !email || !subject || !message) {
      showToast("error", "Please fill in all fields.");
      return;
    }

    // Optional email regex check
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      await userApi.postContactForm({ fullName, email, subject, message });
      showToast("success", "Your message has been sent!");
      formRef.current?.reset(); // clear inputs
    } catch (err) {
      showToast("error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 min-h-screen">
      <header>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Get in Touch</h1>
        <p className="text-gray-600 mb-12 ">
          We'd love to hear from you. Whether you have a question about
          features, pricing, need a demo, or anything else — our team is ready
          to answer all your questions.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-12 items-start">
        {/* ContactPage Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div>
              <PhoneIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">+1 (416) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Icon */}
            <div>
              <EnvelopeIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">support@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Icon */}
            <div>
              <MapPinIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Address</h3>
              <p className="text-gray-600">
                123 Queen Street West, Toronto, ON, Canada
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Icon */}
            <div>
              <ClockIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Business Hours</h3>
              <p className="text-gray-600">Mon - Fri: 9:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* ContactPage Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              name="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="self-end bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ContactPage;
