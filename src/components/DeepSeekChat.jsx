import React, { useState } from 'react';

const DeepSeekChat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResponse = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "HTTP-Referer": "LearningStake.com", // Optional. Site URL for rankings on openrouter.ai.
          // "X-Title": "LearningStake", 
          // "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-4-maverick:free",
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ]
        })
      });
       console.log(res);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to fetch response');
      }

      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || 'No response received.');
    } catch (err) {
      setError('Error: ' + (err.message || 'Failed to fetch response'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto shadow-lg rounded-2xl bg-white">
      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          disabled={loading}
        />
      </div>

      <button
        onClick={fetchResponse}
        disabled={loading || !prompt.trim()}
        className={`w-full px-4 py-2 rounded-lg text-white ${
          loading || !prompt.trim() 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Generating...' : 'Get Response'}
      </button>

      {error && (
        <div className="mt-4 p-3 text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-800">Response:</p>
          <p className="mt-2 text-gray-700 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
};

export default DeepSeekChat;