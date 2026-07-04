import { motion } from "framer-motion";

function AgentChat({ messages }) {

  return (

    <div className="mt-8">

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5">

          <h2 className="text-2xl font-bold">
            🤖 VoyageAI Assistant
          </h2>

          <p className="text-blue-100 mt-1">
            Multi-Agent AI is planning your trip...
          </p>

        </div>

        <div className="p-6 space-y-5 max-h-[450px] overflow-y-auto">

          {messages.length === 0 && (

            <div className="text-center text-gray-400 italic animate-pulse">

              Waiting for your request...

            </div>

          )}

          {messages.map((msg, index) => (

            <motion.div

              key={index}

              initial={{ opacity: 0, x: -30 }}

              animate={{ opacity: 1, x: 0 }}

              transition={{ duration: 0.4 }}

              className="
              bg-gray-50
              rounded-2xl
              p-4
              border
              border-gray-200
              shadow-sm
              "

            >

              <div className="flex justify-between">

                <span className="font-semibold text-blue-600">

  {msg.includes("Destination") && "🧭 Destination Agent"}

  {msg.includes("Budget") && "💰 Budget Agent"}

  {msg.includes("Weather") && "☀️ Weather Agent"}

  {msg.includes("Activity") && "🎯 Activity Agent"}

  {msg.includes("Itinerary") && "🗓️ Itinerary Agent"}

  {msg.includes("VoyageAI") && "🚀 VoyageAI"}

</span>

                <span className="text-xs text-gray-400">

                  just now

                </span>

              </div>

              <p className="mt-2 text-gray-700">

                {msg}

              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default AgentChat;