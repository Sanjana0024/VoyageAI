import { useState, useEffect } from "react";

import { generateTrip } from "./services/api";
import { streamTrip } from "./services/stream";

import TravelCard from "./components/TravelCard";
import HistorySidebar from "./components/HistorySidebar";

function App() {

  const [input, setInput] = useState("");

  const [trip, setTrip] = useState(null);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);


  // Load history from localStorage
  useEffect(() => {

    const savedHistory =
      JSON.parse(
        localStorage.getItem("voyage_history")
      ) || [];

    setHistory(savedHistory);

  }, []);



  // Generate AI Trip
  const handleGenerate = async () => {

    if (!input) return;

    setLoading(true);

    setTrip(null);

    try {

      const response = await generateTrip({

        user_input: input

      });

      console.log(
        "Backend Response:",
        response.data
      );

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

    catch (error) {

      console.log(error);

    }

    setLoading(false);

  };



  // Streaming AI
  const handleStreamGenerate = async () => {

    setMessages([]);

    setLoading(true);

    await streamTrip(

      input,

      (message) => {

        setMessages(prev => [

          ...prev,

          message

        ]);

      }

    );

    setLoading(false);

  };



  // Open old trip
  const openHistoryTrip = (trip) => {

    setTrip(trip.trip);

  };



  // Start new trip
  const createNewTrip = () => {

    setTrip(null);

    setInput("");

  };



  return (

    <div className="min-h-screen flex bg-gray-100">

      <HistorySidebar

        history={history}

        onSelect={openHistoryTrip}

        onNewTrip={createNewTrip}

      />



      <div className="flex-1 p-8">

        <div
          className="
          w-full
          max-w-5xl
          mx-auto
          bg-white
          rounded-2xl
          shadow-xl
          p-8
          "
        >

          <h1
            className="
            text-4xl
            font-bold
            text-center
            text-blue-600
            "
          >
            🚀 VoyageAI
          </h1>

          <p
            className="
            text-center
            text-gray-500
            mt-2
            "
          >
            Multi-Agent AI Travel Planner
          </p>

          <textarea

            className="
            mt-8
            w-full
            h-32
            border
            rounded-xl
            p-4
            text-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
            "

            placeholder="
Plan a 5 day adventure trip to Manali under ₹30000
"

            value={input}

            onChange={(e) =>

              setInput(e.target.value)

            }

          />
                    <div
            className="
            flex
            gap-4
            mt-5
            "
          >

            <button

              onClick={handleGenerate}

              className="
              flex-1
              bg-blue-600
              text-white
              py-3
              rounded-xl
              hover:bg-blue-700
              transition
              "

            >

              Generate Plan 🚀

            </button>



            <button

              onClick={handleStreamGenerate}

              className="
              flex-1
              bg-purple-600
              text-white
              py-3
              rounded-xl
              hover:bg-purple-700
              transition
              "

            >

              Watch AI Agents 🤖

            </button>

          </div>



          {
            loading && (

              <div
                className="
                mt-6
                bg-gray-50
                rounded-xl
                p-5
                "
              >

                <h2
                  className="
                  font-bold
                  text-lg
                  mb-3
                  "
                >

                  🤖 AI Agents Working

                </h2>


                {
                  messages.map(

                    (msg, index) => (

                      <p

                        key={index}

                        className="
                        text-gray-700
                        animate-pulse
                        mb-2
                        "

                      >

                        {msg}

                      </p>

                    )

                  )
                }

              </div>

            )
          }



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