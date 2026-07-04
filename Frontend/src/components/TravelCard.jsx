import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TravelMap from "./TravelMap";

function TravelCard({ data, loading }) {
  const [openDay, setOpenDay] = useState(null);

  // Loading UI
  if (loading) {
    return (
      <div className="mt-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-5">
          <div className="h-56 rounded-3xl bg-gray-300"></div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-24 rounded-2xl bg-gray-300"></div>
            <div className="h-24 rounded-2xl bg-gray-300"></div>
            <div className="h-24 rounded-2xl bg-gray-300"></div>
            <div className="h-24 rounded-2xl bg-gray-300"></div>
          </div>

          <div className="h-48 rounded-3xl bg-gray-300"></div>
          <div className="h-48 rounded-3xl bg-gray-300"></div>
        </div>

        <p className="text-center mt-8 text-gray-500 text-lg">
          🤖 VoyageAI is building your perfect itinerary...
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-8">

      {/* HERO */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .5 }}
        className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 shadow-2xl text-white"
      >

        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-white/10 rounded-full"></div>

        <div className="relative z-10">

          <span className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-sm">
            ✨ AI Generated Travel Plan
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold mt-5">
            {data.trip_summary}
          </h1>

          <p className="mt-4 text-blue-100 max-w-2xl leading-7">
            VoyageAI analyzed your request, budget and travel preferences
            to generate a personalized itinerary.
          </p>

          {/* Stats */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">

            <div className="rounded-2xl bg-white/15 backdrop-blur-lg p-5 text-center">

              <div className="text-3xl">💰</div>

              <p className="text-blue-100 mt-2 text-sm">
                Budget
              </p>

              <h3 className="text-xl font-bold">
                ₹{data.total_budget}
              </h3>

            </div>

            <div className="rounded-2xl bg-white/15 backdrop-blur-lg p-5 text-center">

              <div className="text-3xl">📅</div>

              <p className="text-blue-100 mt-2 text-sm">
                Days
              </p>

              <h3 className="text-xl font-bold">
                {data.day_wise_plan?.length || 0}
              </h3>

            </div>

            <div className="rounded-2xl bg-white/15 backdrop-blur-lg p-5 text-center">

              <div className="text-3xl">📍</div>

              <p className="text-blue-100 mt-2 text-sm">
                Places
              </p>

              <h3 className="text-xl font-bold">
                {data.places_to_visit?.length || 0}
              </h3>

            </div>

            <div className="rounded-2xl bg-white/15 backdrop-blur-lg p-5 text-center">

              <div className="text-3xl">🎯</div>

              <p className="text-blue-100 mt-2 text-sm">
                Activities
              </p>

              <h3 className="text-xl font-bold">
                {data.activities?.length || 0}
              </h3>

            </div>

          </div>

        </div>

      </motion.div>

      {/* PLACES */}

      {data.places_to_visit?.length > 0 && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl bg-white shadow-xl p-7"
        >

          <h2 className="text-2xl font-bold mb-6">
            📍 Places You'll Visit
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {data.places_to_visit.map((place, index) => (

              <motion.div
                key={index}
                whileHover={{
                  scale: 1.03
                }}
                className="rounded-2xl border p-5 bg-gradient-to-r from-blue-50 to-indigo-50"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="font-bold text-lg">
                      {place}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Explore one of the must-visit attractions on your trip.
                    </p>

                  </div>

                  <div className="text-4xl">
                    📍
                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </motion.div>

      )}

      {/* 🌤 WEATHER CARD */}
{data.weather && (
  <div className="mt-6 backdrop-blur-xl bg-white/70 border rounded-2xl p-6 shadow-md">

    <h3 className="text-xl font-bold mb-4">
      🌤 Weather Info
    </h3>

    <div className="grid grid-cols-2 gap-4">

      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-gray-500">Condition</p>
        <p className="font-bold text-blue-700">
          {data.weather.condition}
        </p>
      </div>

      <div className="p-4 bg-purple-50 rounded-xl">
        <p className="text-sm text-gray-500">Temperature</p>
        <p className="font-bold text-purple-700">
          {data.weather.temperature}
        </p>
      </div>

      <div className="p-4 bg-green-50 rounded-xl col-span-2">
        <p className="text-sm text-gray-500">Best Time</p>
        <p className="font-bold text-green-700">
          {data.weather.best_time}
        </p>
      </div>

    </div>
    {/* 🗺 MAP SECTION */}
{data.places_to_visit?.length > 0 && (
  <TravelMap places={data.places_to_visit} />
)}

    {/* Packing */}
    {data.weather.packing?.length > 0 && (
      <div className="mt-4">
        <p className="font-semibold">🧥 What to Pack</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.weather.packing.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )}

  </div>
)}

      {/* DAY WISE PLAN */}

      {data.day_wise_plan?.length > 0 && (

        <div>

          <h2 className="text-2xl font-bold mb-6">
            🗓 Day-wise Itinerary
          </h2>

          <div className="space-y-5">

            {data.day_wise_plan.map((day, index) => {

              const isOpen = openDay === index;

              return (

                <motion.div
                  key={index}
                  layout
                  className="rounded-3xl bg-white border shadow-lg overflow-hidden"
                >

                  {/* HEADER */}

                  <div
                    onClick={() =>
                      setOpenDay(
                        isOpen ? null : index
                      )
                    }
                    className="cursor-pointer p-5 flex justify-between items-center hover:bg-gray-50 transition"
                  >

                    <div className="flex items-center gap-5">

                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">

                        {day.day}

                      </div>

                      <div>

                        <h3 className="text-xl font-bold">

                          Day {day.day}

                        </h3>

                        <p className="text-gray-500">

                          📍 {day.location}

                        </p>

                      </div>

                    </div>

                    <motion.div
                      animate={{
                        rotate: isOpen ? 180 : 0
                      }}
                    >
                      <span className="text-3xl">
                        ⌄
                      </span>
                    </motion.div>

                  </div>

                  <AnimatePresence>
                                        {isOpen && (

                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto"
                        }}
                        exit={{
                          opacity: 0,
                          height: 0
                        }}
                        transition={{
                          duration: 0.3
                        }}
                        className="border-t bg-gray-50 p-6 space-y-6"
                      >

                        {/* Activities */}

                        {day.activities?.length > 0 && (

                          <div>

                            <h4 className="font-semibold text-lg mb-3">
                              🎯 Activities
                            </h4>

                            <div className="flex flex-wrap gap-3">

                              {day.activities.map((activity, i) => (

                                <span
                                  key={i}
                                  className="
                                  px-4
                                  py-2
                                  rounded-full
                                  bg-blue-100
                                  text-blue-700
                                  text-sm
                                  font-medium
                                  "
                                >
                                  {activity}
                                </span>

                              ))}

                            </div>

                          </div>

                        )}

                        {/* FOOD */}

                        {day.food?.length > 0 && (

                          <div>

                            <h4 className="font-semibold text-lg mb-3">
                              🍽 Food
                            </h4>

                            <div className="flex flex-wrap gap-3">

                              {day.food.map((food, i) => (

                                <span
                                  key={i}
                                  className="
                                  px-4
                                  py-2
                                  rounded-full
                                  bg-orange-100
                                  text-orange-700
                                  text-sm
                                  font-medium
                                  "
                                >
                                  {food}
                                </span>

                              ))}

                            </div>

                          </div>

                        )}

                        {/* COST */}

                        {day.estimated_cost && (

                          <div className="
                          flex
                          justify-between
                          items-center
                          border-t
                          pt-5
                          ">

                            <span className="text-gray-600 font-medium">
                              💰 Estimated Cost
                            </span>

                            <span
                              className="
                              bg-green-100
                              text-green-700
                              px-5
                              py-2
                              rounded-full
                              font-bold
                              "
                            >
                              ₹{day.estimated_cost}
                            </span>

                          </div>

                        )}

                      </motion.div>

                    )}

                  </AnimatePresence>

                </motion.div>

              );

            })}

          </div>

        </div>

      )}

      {/* TRAVEL TIPS */}

      {data.travel_tips?.length > 0 && (

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="
          rounded-3xl
          bg-gradient-to-r
          from-emerald-500
          to-green-600
          text-white
          p-8
          shadow-xl
          "
        >

          <h2 className="text-2xl font-bold mb-6">
            🎒 Travel Tips
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            {data.travel_tips.map((tip, index) => (

              <div
                key={index}
                className="
                bg-white/15
                backdrop-blur-lg
                rounded-2xl
                p-4
                "
              >
                ✅ {tip}
              </div>

            ))}

          </div>

        </motion.div>

      )}

    </div>

  );

}

export default TravelCard;
              