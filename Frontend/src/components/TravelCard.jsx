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

      {/* 🌄 HERO SECTION */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl p-8"
>

  {/* Decorative circles */}
  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
  <div className="absolute -bottom-16 -left-10 w-52 h-52 bg-white/10 rounded-full"></div>

  <div className="relative z-10">

    <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-md">
      ✨ AI Generated Itinerary
    </span>

    <h2 className="text-4xl font-extrabold mt-4 leading-tight">
      {data.trip_summary}
    </h2>

    <p className="mt-3 text-blue-100 max-w-2xl">
      Sit back and relax! VoyageAI has crafted a personalized travel
      itinerary based on your preferences, budget, and interests.
    </p>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

      <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center">
        <p className="text-3xl">💰</p>
        <p className="text-sm text-blue-100 mt-2">Budget</p>
        <h3 className="font-bold text-lg">
          ₹{data.total_budget}
        </h3>
      </div>

      <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center">
        <p className="text-3xl">📅</p>
        <p className="text-sm text-blue-100 mt-2">Days</p>
        <h3 className="font-bold text-lg">
          {data.day_wise_plan?.length || 0}
        </h3>
      </div>

      <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center">
        <p className="text-3xl">📍</p>
        <p className="text-sm text-blue-100 mt-2">Places</p>
        <h3 className="font-bold text-lg">
          {data.places_to_visit?.length || 0}
        </h3>
      </div>

      <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 text-center">
        <p className="text-3xl">🎯</p>
        <p className="text-sm text-blue-100 mt-2">Activities</p>
        <h3 className="font-bold text-lg">
          {data.activities?.length || 0}
        </h3>
      </div>

    </div>

  </div>

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
                className="
relative
overflow-hidden
rounded-3xl
border
border-gray-200
bg-white
shadow-lg
hover:shadow-2xl
hover:-translate-y-1
transition-all
duration-300
"
              >

                {/* HEADER */}
                <div
                  onClick={() =>
                    setOpenDay(isOpen ? null : index)
                  }
                  className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">

  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
    {day.day}
  </div>

  <div>
    <h4 className="font-bold text-lg">
      Day {day.day}
    </h4>

    <p className="text-gray-500">
      📍 {day.location}
    </p>
  </div>

</div>

<motion.div
  animate={{ rotate: isOpen ? 180 : 0 }}
  transition={{ duration: 0.25 }}
>
  ⌄
</motion.div>
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