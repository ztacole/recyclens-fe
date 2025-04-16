// api/predict.js
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get the form data from the request
    const formData = await request.formData();
    
    // Forward the request to your ML API
    const response = await fetch("https://web-production-c8bf2.up.railway.app/predict", {
      method: 'POST',
      body: formData,
    });
    
    // Get the response from the ML API
    const data = await response.json();
    
    // Return the response
    return new Response(
      JSON.stringify(data),
      { 
        status: response.status, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}