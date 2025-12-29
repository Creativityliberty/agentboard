async function run() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  console.log("Using API Key:", apiKey.substring(0, 10) + "...");
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
        const err = await response.text();
        console.error("Error response:", err);
        return;
    }
    const data = await response.json();
    console.log("Models found:", data.models?.map((m: any) => m.name).join(", "));
  } catch (e) {
    console.error("Fetch Error:", e);
  }
}

run();
