import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Guides() {
  const [guides, setGuides] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date: "", location: "", message: "" });
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/login");
    API.get("/guides").then((res) => setGuides(res.data));
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookings", {
        guideId: selected._id,
        ...form,
      });
      setSuccess(`Booking sent to ${selected.name} successfully!`);
      setSelected(null);
      setForm({ date: "", location: "", message: "" });
    } catch (err) {
      alert("Booking failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navbar */}
      <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Maharashtra Tour Guide</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-orange-500 px-4 py-1 rounded-lg font-medium text-sm hover:bg-orange-100"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Find Your Perfect Guide
        </h2>
        <p className="text-gray-500 mb-6">
          Browse verified local guides across Maharashtra
        </p>

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <div
              key={guide._id}
              className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl mb-4">
                🧭
              </div>
              <h3 className="text-lg font-bold text-gray-800">{guide.name}</h3>
              <p className="text-orange-500 text-sm font-medium mb-1">
                {guide.speciality}
              </p>
              <p className="text-gray-500 text-sm mb-1">📍 {guide.location}</p>
              <p className="text-gray-500 text-sm mb-3">
                ⭐ {guide.experience} years experience
              </p>
              <p className="text-gray-600 text-sm mb-4">{guide.bio}</p>
              <button
                onClick={() => setSelected(guide)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition"
              >
                Book This Guide
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Book {selected.name}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {selected.speciality} · {selected.location}
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">
                Tour Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">
                Location
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Where do you want to visit?"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-1 font-medium">
                Message to Guide
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell the guide what you're looking for"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBook}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 border border-gray-300 text-gray-600 font-medium py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}