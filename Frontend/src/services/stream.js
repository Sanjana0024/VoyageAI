const API_URL = import.meta.env.VITE_API_URL;

export async function streamTrip(userInput, onMessage) {

    const response = await fetch(
        `${API_URL}/plan-stream`,
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

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {

        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        console.log("STREAM DATA:", chunk);

        onMessage(chunk);
    }
}