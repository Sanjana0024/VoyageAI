export async function streamTrip(userInput, onMessage) {

    const response = await fetch(
        "http://127.0.0.1:8000/plan-stream",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_input: userInput
            })
        }
    );


    const reader = response.body.getReader();

    const decoder = new TextDecoder();


    while (true) {

        const { done, value } = await reader.read();


        if (done) {
            break;
        }


        const chunk = decoder.decode(value);


        console.log("STREAM DATA:", chunk);


        onMessage(chunk);

    }

}