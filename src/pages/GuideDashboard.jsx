import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function GuideDashboard() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "guide") navigate("/login");
    API.get("/bookings/requests").then((res) => setBookings(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/bookings/${id}/status`, { status });
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b))
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Guide Dashboard</h1>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Booking Requests
        </h2>
        <p className="text-gray-500 mb-6">
          Manage your incoming tour requests
        </p>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
            No booking requests yet
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {booking.tourist?.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {booking.tourist?.email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <p>📅 Date: {booking.date}</p>
                  <p>📍 Location: {booking.location}</p>
                </div>

                {booking.message && (
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg mb-4">
                    💬 "{booking.message}"
                  </p>
                )}

                {booking.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(booking._id, "accepted")}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(booking._id, "rejected")}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}