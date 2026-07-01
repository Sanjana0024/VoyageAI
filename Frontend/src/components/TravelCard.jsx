function TravelCard({data}){


return (

<div className="
mt-8
bg-gray-50
rounded-xl
p-6
border
">


<h2 className="
text-2xl
font-bold
text-blue-600
">

🌍 Trip Summary

</h2>


<p className="
mt-3
text-gray-700
">

{data.trip_summary}

</p>



<h3 className="
mt-5
font-bold
text-xl
">

💰 Budget

</h3>


<p>

{data.total_budget}

</p>



<h3 className="
mt-5
font-bold
text-xl
">

📍 Places To Visit

</h3>


<ul className="
list-disc
ml-6
">

{

data.places_to_visit?.map(

(place,index)=>(

<li key={index}>
{place}
</li>

)

)

}


</ul>


</div>

)

}


export default TravelCard;