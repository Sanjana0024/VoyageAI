import { useState, useEffect } from "react";

import { generateTrip } from "./services/api";
import { streamTrip } from "./services/stream";

import TravelCard from "./components/TravelCard";
import HistorySidebar from "./components/HistorySidebar";
import AgentChat from "./components/AgentChat";

function App() {

  const [input, setInput] = useState("");

  const [trip, setTrip] = useState(null);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);


  // Load history
  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem("voyage_history")
      ) || [];

    setHistory(saved);

  }, []);


  // One Click Planner
  const handlePlanTrip = async () => {

    if (!input.trim()) return;

    setLoading(true);

    setMessages([]);

    setTrip(null);

    try {

      // Start Agent Chat
      streamTrip(

        input,

        (message) => {

          setMessages(prev => [

            ...prev,

            message

          ]);

        }

      );

      // Generate itinerary
      const response = await generateTrip({

        user_input: input

      });

      const tripData = response.data.data;

      setTrip(tripData);

      const newTrip = {

        id: Date.now(),

        title: tripData.trip_summary,

        date: new Date().toLocaleDateString(),

        trip: tripData

      };

      const updatedHistory = [

        newTrip,

        ...history

      ];

      setHistory(updatedHistory);

      localStorage.setItem(

        "voyage_history",

        JSON.stringify(updatedHistory)

      );

    }

    catch (err) {

      console.log(err);

    }

    setLoading(false);

  };


  const openHistoryTrip = (trip) => {

    setTrip(trip.trip);

    setMessages([]);

  };


  const createNewTrip = () => {

    setTrip(null);

    setInput("");

    setMessages([]);

  };
    return (

    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100">

      {/* Sidebar */}
      <HistorySidebar
        history={history}
        onSelect={openHistoryTrip}
        onNewTrip={createNewTrip}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">

        <div className="max-w-6xl mx-auto p-8">

          {/* Hero */}
          <div className="text-center mb-10">

            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ✈️ VoyageAI
            </h1>

            <p className="text-gray-600 mt-3 text-lg">
              Your AI Powered Multi-Agent Travel Planner
            </p>

          </div>

          {/* Input Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">

            <textarea

              value={input}

              onChange={(e)=>setInput(e.target.value)}

              placeholder="Example: Plan a 5 day adventure trip to Manali under ₹30000"

              className="
              w-full
              h-36
              rounded-2xl
              border
              border-gray-300
              p-5
              text-lg
              resize-none
              focus:outline-none
              focus:ring-4
              focus:ring-blue-200
              "

            />

            <button

              onClick={handlePlanTrip}

              disabled={loading}

              className="
              mt-6
              w-full
              rounded-2xl
              py-4
              text-lg
              font-bold
              text-white
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              hover:scale-[1.02]
              transition
              disabled:opacity-60
              "

            >

              {

                loading

                ?

                "🤖 VoyageAI is Planning..."

                :

                "✨ Plan My Trip"

              }

            </button>

          </div>

          {/* AI Chat */}
          {(loading || messages.length > 0) && (

            <div className="mt-8">

              <AgentChat

                messages={messages}

              />

            </div>

          )}

          {/* Travel Card */}

          <TravelCard

            data={trip}

            loading={loading}

          />

        </div>

      </div>

    </div>

  );

}

export default App;