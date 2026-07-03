function HistorySidebar({
  history,
  onSelect,
  onNewTrip
}) {
  return (
    <div className="w-72 bg-white border-r shadow-lg flex flex-col">

      <div className="p-5 border-b">
        <h2 className="text-2xl font-bold text-blue-600">
          VoyageAI
        </h2>

        <button
          onClick={onNewTrip}
          className="
          mt-4
          w-full
          bg-blue-600
          text-white
          py-3
          rounded-xl
          hover:bg-blue-700
          transition
          "
        >
          + New Trip
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {history.length === 0 ? (
          <p className="p-4 text-gray-500">
            No trips yet
          </p>
        ) : (
          history.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onSelect(trip)}
              className="
              cursor-pointer
              p-4
              border-b
              hover:bg-gray-100
              transition
              "
            >
              <h3 className="font-semibold">
                {trip.title}
              </h3>

              <p className="text-sm text-gray-500">
                {trip.date}
              </p>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default HistorySidebar;