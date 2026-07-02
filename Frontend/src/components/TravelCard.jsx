import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TravelCard({ data, loading }) {
  const [openDay, setOpenDay] = useState(null);

  // 🧠 Loading UI (AI thinking state)
  if (loading) {
    return (
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>

          <div className="h-32 bg-gray-300 rounded-xl"></div>
          <div className="h-32 bg-gray-300 rounded-xl"></div>
        </div>

        <p className="text-center mt-6 text-gray-500">
          🧠 AI is planning your perfect trip...
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mt-8 max-w-4xl mx-auto space-y-6">

      {/* 🌍 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 border rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-blue-600">
          🌍 Trip Summary
        </h2>

        <p className="mt-3 text-gray-700">{data.trip_summary}</p>

        <p className="mt-4 text-lg font-semibold text-gray-800">
          💰 Budget: ₹{data.total_budget}
        </p>
      </motion.div>

      {/* 📍 PLACES */}
      {data.places_to_visit?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-xl bg-white/70 border rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-xl font-bold">📍 Places To Visit</h3>

          <div className="flex flex-wrap gap-2 mt-3">
            {data.places_to_visit.map((place, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:scale-105 transition"
              >
                {place}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* 📅 DAY WISE ACCORDION */}
      {data.day_wise_plan?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold">📅 Day-wise Plan</h3>

          {data.day_wise_plan.map((day, index) => {
            const isOpen = openDay === index;

            return (
              <motion.div
                key={index}
                layout
                className="backdrop-blur-xl bg-white/70 border rounded-2xl shadow-md overflow-hidden"
              >

                {/* HEADER */}
                <div
                  onClick={() =>
                    setOpenDay(isOpen ? null : index)
                  }
                  className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <h4 className="font-bold text-lg">
                    Day {day.day} 📍 {day.location}
                  </h4>

                  <span>{isOpen ? "▲" : "▼"}</span>
                </div>

                {/* CONTENT */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-4 border-t space-y-3"
                    >

                      {/* Activities */}
                      {day.activities?.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-700">
                            🎯 Activities
                          </h5>
                          <ul className="list-disc ml-6 text-gray-600">
                            {day.activities.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Food */}
                      {day.food?.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-700">
                            🍽 Food
                          </h5>
                          <ul className="list-disc ml-6 text-gray-600">
                            {day.food.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Cost */}
                      {day.estimated_cost && (
                        <p className="font-semibold text-green-600">
                          💸 Estimated Cost: ₹{day.estimated_cost}
                        </p>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>
      )}

      {/* 🎒 TIPS */}
      {data.travel_tips?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-xl bg-white/70 border rounded-2xl p-6 shadow-md"
        >
          <h3 className="text-xl font-bold">🎒 Travel Tips</h3>

          <ul className="list-disc ml-6 mt-3 text-gray-700">
            {data.travel_tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </motion.div>
      )}

    </div>
  );
}

export default TravelCard;