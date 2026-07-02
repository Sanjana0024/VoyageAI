function TravelCard({ data }) {
  if (!data) return null;

  return (
    <div className="mt-8 bg-gray-50 rounded-xl p-6 border">

      {/* 🌍 Trip Summary */}
      <h2 className="text-2xl font-bold text-blue-600">
        🌍 Trip Summary
      </h2>

      <p className="mt-3 text-gray-700">
        {data.trip_summary}
      </p>

      {/* 💰 Budget */}
      <h3 className="mt-5 font-bold text-xl">
        💰 Budget
      </h3>

      <p className="text-gray-800">
        ₹{data.total_budget}
      </p>

      {/* 📍 Places */}
      {data.places_to_visit?.length > 0 && (
        <>
          <h3 className="mt-5 font-bold text-xl">
            📍 Places To Visit
          </h3>

          <ul className="list-disc ml-6 text-gray-700 mt-2">
            {data.places_to_visit.map((place, index) => (
              <li key={index}>{place}</li>
            ))}
          </ul>
        </>
      )}

      {/* 📅 Day-wise Plan */}
      {data.day_wise_plan?.length > 0 && (
        <>
          <h3 className="mt-6 font-bold text-xl">
            📅 Day-wise Plan
          </h3>

          <div className="mt-3 space-y-4">

            {data.day_wise_plan.map((day, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg border shadow-sm"
              >

                <h4 className="font-bold text-lg text-gray-800">
                  Day {day.day} 📍 {day.location}
                </h4>

                {/* Activities */}
                {day.activities?.length > 0 && (
                  <>
                    <p className="mt-2 font-semibold text-gray-700">
                      🎯 Activities
                    </p>
                    <ul className="list-disc ml-6 text-gray-600">
                      {day.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Food */}
                {day.food?.length > 0 && (
                  <>
                    <p className="mt-2 font-semibold text-gray-700">
                      🍽 Food
                    </p>
                    <ul className="list-disc ml-6 text-gray-600">
                      {day.food.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Cost */}
                {day.estimated_cost && (
                  <p className="mt-2 font-semibold text-green-600">
                    💸 Estimated Cost: ₹{day.estimated_cost}
                  </p>
                )}

              </div>
            ))}

          </div>
        </>
      )}

      {/* 🎒 Travel Tips */}
      {data.travel_tips?.length > 0 && (
        <>
          <h3 className="mt-6 font-bold text-xl">
            🎒 Travel Tips
          </h3>

          <ul className="list-disc ml-6 text-gray-700 mt-2">
            {data.travel_tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </>
      )}

    </div>
  );
}

export default TravelCard;