function TravelCard({data}){


return (

<div className="travel-card">

<h2>
🌍 Trip Summary
</h2>


<p>
{data.trip_summary}
</p>


<h3>
💰 Budget
</h3>

<p>
{data.total_budget}
</p>


<h3>
📍 Places
</h3>


<ul>

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