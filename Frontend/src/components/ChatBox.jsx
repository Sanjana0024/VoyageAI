import { useState } from "react";
import { planTrip } from "../services/api";
import TravelCard from "./TravelCard";


function ChatBox(){

    const [input,setInput] = useState("");
    const [trip,setTrip] = useState(null);
    const [loading,setLoading] = useState(false);


    const generateTrip = async()=>{

        try{

            setLoading(true);

            const response = await planTrip(input);

            setTrip(response.data.data);

        }
        catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }

    };


    return(
        <div className="max-w-3xl mx-auto mt-10">

            <h1 className="text-3xl font-bold text-center">
                🌍 VoyageAI
            </h1>


            <textarea

                className="w-full mt-6 p-4 border rounded-xl"

                placeholder="Plan a 5 day adventure trip to Manali under 30000"

                value={input}

                onChange={(e)=>setInput(e.target.value)}

            />


            <button

            onClick={generateTrip}

            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl"

            >

            {
                loading ? "Planning..." : "Generate Trip"
            }

            </button>


            {
                trip && <TravelCard data={trip}/>
            }


        </div>
    )

}


export default ChatBox;