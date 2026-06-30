import {useState} from "react";

import {generateTrip} from "./services/api";

import TravelCard from "./components/TravelCard";


function App(){


const[input,setInput]=useState("");

const[trip,setTrip]=useState(null);

const[loading,setLoading]=useState(false);



const handleGenerate=async()=>{


setLoading(true);


const response =
await generateTrip({

user_input:input

});


setTrip(
response.data.data
);


setLoading(false);


};



return (

<div className="container">


<h1>
🚀 VoyageAI
</h1>


<p>
Multi-Agent AI Travel Planner
</p>



<textarea

placeholder="Plan a 5 day trip to Manali under 30000"

value={input}

onChange={
(e)=>setInput(e.target.value)
}

/>



<button
onClick={handleGenerate}
>

{
loading
?
"AI Agents Working..."
:
"Generate Trip"
}

</button>



{
trip &&
<TravelCard data={trip}/>
}



</div>

)

}


export default App;