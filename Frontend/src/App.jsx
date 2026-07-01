import { useState } from "react";

import { generateTrip } from "./services/api";
import { streamTrip } from "./services/stream";

import TravelCard from "./components/TravelCard";


function App() {


  const [input, setInput] = useState("");

  const [trip, setTrip] = useState(null);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);



  // Normal AI plan generation
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


      setTrip(
        response.data.data
      );


    }

    catch(error){

      console.log(error);

    }


    setLoading(false);

  };




  // Streaming agent execution
  const handleStreamGenerate = async () => {


    if (!input) return;


    setMessages([]);

    setTrip(null);

    setLoading(true);



    await streamTrip(

      input,

      (message)=>{


        setMessages((previous)=>[

          ...previous,

          message

        ]);


      }

    );


    setLoading(false);


  };




  return (


    <div className="
      min-h-screen
      flex
      justify-center
      items-center
      bg-gradient-to-br
      from-blue-50
      to-purple-100
      p-6
    ">


      <div className="
        w-full
        max-w-4xl
        bg-white
        rounded-2xl
        shadow-xl
        p-8
      ">



        <h1 className="
          text-4xl
          font-bold
          text-center
          text-blue-600
        ">

          🚀 VoyageAI

        </h1>



        <p className="
          text-center
          text-gray-500
          mt-2
        ">

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
          Example:
          Plan a 5 day adventure trip to Manali under ₹30000
          "


          value={input}


          onChange={(e)=>setInput(e.target.value)}


        />





        <div className="
          flex
          gap-4
          mt-5
        ">


          <button

            onClick={handleGenerate}

            className="
              flex-1
              bg-blue-600
              text-white
              py-3
              rounded-xl
              hover:bg-blue-700
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
            "

          >

            Watch AI Agents 🤖

          </button>



        </div>






        {
          loading && (

            <div className="
              mt-6
              bg-gray-50
              rounded-xl
              p-5
            ">


              <h2 className="
                font-bold
                text-lg
                mb-3
              ">

                🤖 AI Agents Working

              </h2>



              {
                messages.map(

                  (msg,index)=>(

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






        {
          trip && (

            <TravelCard

              data={trip}

            />

          )
        }




      </div>


    </div>


  );


}


export default App;