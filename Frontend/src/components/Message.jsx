function Message({role,text}){


return (

<div className={role}>

<p>
{text}
</p>

</div>

)

}


export default Message;