"use client";
import { useState } from "react";
import Link from 'next/link';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaYoutube , FaFacebookF,FaLinkedinIn} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <>
          <div className="w-full bg-[#fdfaf7] py-2 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          {/* Left: Home Button */}
          <Link
            href="/"
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors"
          >
            🏚️
        </Link>

          {/* Right: Text */}
          <div className="text-2xl font-bold text-amber-700">قَمَرْ</div>
        </div>
      </div>
      <div className="container mx-auto px-6 md:px-20 py-14">

{/* HEADER */}
<div className="text-center mb-16">
  <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-3">
    Get in Touch
  </h1>
  <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
    Have questions or need assistance? Our team is ready to help you anytime.
  </p>
</div>

{/* GRID */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-14">

  {/* LEFT – CONTACT INFO */}
  <div className="flex flex-col gap-8">

    <div className="flex items-start gap-4">
      <FaPhoneAlt className="text-amber-700 text-3xl mt-1" />
      <div>
        <h3 className="text-xl font-semibold text-amber-800">Phone</h3>
        <p className="text-gray-600 hover:text-amber-700 transition">
          <a href="tel:+201112345678">+20 111 234 5678</a>
        </p>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <FaEnvelope className="text-amber-700 text-3xl mt-1" />
      <div>
        <h3 className="text-xl font-semibold text-amber-800">Email</h3>
        <p className="text-gray-600 hover:text-amber-700 transition">
          <a href="mailto:support@scarfboutique.com">support@scarfboutique.com</a>
        </p>
      </div>
    </div>

    <div className="flex items-start gap-4">
      <FaMapMarkerAlt className="text-amber-700 text-3xl mt-1" />
      <div>
        <h3 className="text-xl font-semibold text-amber-800">Address</h3>
        <p className="text-gray-600">Mohandseen, Giza, Egypt</p>
      </div>
    </div>

    {/* SOCIAL MEDIA LINKS */}
    <div className="flex gap-6 mt-4">
    <a
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-blue-600 transition text-2xl"
      >
        <FaFacebookF />
      </a>
      <a
        href="https://www.linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-blue-500 transition text-2xl"
      >
        <FaLinkedinIn />
      </a>
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-pink-500 transition text-2xl"
      >
        <FaInstagram />
      </a>
      <a
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-red-600 transition text-2xl"
      >
        <FaYoutube />
      </a>
    </div>

  </div>

  {/* RIGHT – CONTACT FORM */}
  <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      <div>
        <label className="block text-gray-700 font-medium mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-amber-700 transition"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email address"
          required
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-amber-700 transition"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Message</label>
        <textarea
          name="message"
          rows="6"
          value={formData.message}
          onChange={handleChange}
          placeholder="Write your message here..."
          required
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-amber-700 transition"
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-amber-800 text-white text-lg py-3 rounded-lg hover:bg-amber-700 transition shadow-md"
      >
        Send Message
      </button>

    </form>
  </div>

</div>

</div>
    </>
  );
}
