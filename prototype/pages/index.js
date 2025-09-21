"use client";

import { useState } from "react";

export default function Home() {
  const [documentText, setDocumentText] = useState("");
  const [simplifiedText, setSimplifiedText] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingSimplify, setLoadingSimplify] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [error, setError] = useState(null);

  // The API key is provided by the environment, so we leave it empty here.
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 

  // PDF Upload Handler
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Dynamically import the PDF.js library
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
      }
      setDocumentText(text);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load PDF. Please try a different file.");
    }
  };

  // Call Gemini API to simplify and highlight text
  const processDocument = async () => {
    if (!documentText) {
      setError("Please upload or paste a document first.");
      return;
    }

    setLoadingSimplify(true);
    setHighlights([]);
    setError(null);

    try {
      // Prompt the model to return a structured JSON response
      const prompt = `
      Simplify the following legal document into plain, easy-to-understand language.
      Extract key legal terms from the document such as "deadline", "obligation", "risk", "penalty", "termination" and any other relevant legal or financial terms.
      
      Your response must be a single JSON object with two fields:
      1. "simplifiedText": The simplified text as a string.
      2. "highlights": An array of strings, where each string is a key term extracted from the original document.

      Do not include any other text or formatting outside of the JSON object.

      Legal Document:
      ${documentText}
      `;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "API call failed");
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsedData = JSON.parse(rawText);
        setSimplifiedText(parsedData.simplifiedText || "Failed to simplify text.");
        setHighlights(parsedData.highlights || []);
      } else {
        setSimplifiedText("Failed to simplify text. No content returned.");
      }
    } catch (err) {
      console.error("Simplification error:", err);
      setError(`Error simplifying document: ${err.message}`);
      setSimplifiedText("Error simplifying document.");
    } finally {
      setLoadingSimplify(false);
    }
  };

  // Call Gemini API to answer a question
  const askQuestion = async () => {
    if (!question || !simplifiedText) {
      setError("Please simplify a document and ask a question.");
      return;
    }

    setLoadingAnswer(true);
    setError(null);

    try {
      const prompt = `
      You are a legal assistant. Answer the following question based on the provided text. Keep the answer concise and to the point.

      Simplified Text:
      ${simplifiedText}

      Question:
      ${question}
      `;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "API call failed");
      }
      
      const data = await res.json();
      const ans = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate an answer.";
      setAnswer(ans);
    } catch (err) {
      console.error("Q&A error:", err);
      setError(`Error generating answer: ${err.message}`);
      setAnswer("Error generating answer.");
    } finally {
      setLoadingAnswer(false);
    }
  };

  // ---- Styles ----
  const containerStyle = {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fefefe",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginBottom: "1rem",
    transition: "transform 0.2s",
  };

  const buttonStyle = {
    padding: "0.6rem 1.2rem",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "bold",
    transition: "background-color 0.2s, transform 0.2s",
  };

  const buttonHover = (e) => {
    e.target.style.backgroundColor = "#45a049";
    e.target.style.transform = "scale(1.05)";
  };

  const buttonLeave = (e) => {
    e.target.style.backgroundColor = "#4CAF50";
    e.target.style.transform = "scale(1)";
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        Legal Document Simplifier
      </h1>
      
      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <p>{error}</p>
        </div>
      )}

      {/* PDF Upload Card */}
      <div style={cardStyle}>
        <h3 style={{ color: "#000" }}>Upload Your Document</h3>
        <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
        <p style={{ fontSize: "0.9rem", color: "#000000ff", marginTop: "0.3rem" }}>
          Upload PDF or paste text below.
        </p>
      </div>

      {/* Textarea Card */}
      <div style={cardStyle}>
        <h3 style={{ color: "#000" }}>Or Paste Legal Text</h3>
        <textarea
          placeholder="Paste legal text here..."
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #000000ff",
            marginTop: "0.5rem",
            resize: "vertical",
          }}
        />
      </div>

      {/* Simplify Button */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <button
          style={buttonStyle}
          onClick={processDocument}
          onMouseEnter={buttonHover}
          onMouseLeave={buttonLeave}
          disabled={loadingSimplify}
        >
          {loadingSimplify ? "Simplifying..." : "Simplify & Highlight"}
        </button>
      </div>

      {/* Highlights Card */}
      <div style={cardStyle}>
        <h3 style={{ color: "#000" }}>Highlighted Keywords</h3>
        {highlights.length
          ? highlights.map((word, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: "#FFF3CD",
                  color: "#000000ff",
                  padding: "0.3rem 0.6rem",
                  marginRight: "0.4rem",
                  borderRadius: "4px",
                  fontWeight: "600",
                }}
              >
                {word}
              </span>
            ))
          : <p style={{ color: "#666" }}>No key terms detected yet.</p>}
      </div>

      {/* Simplified Text Card */}
      <div style={cardStyle}>
        <h3 style={{ color: "#000" }}>Simplified Text</h3>
        <p
          style={{
            backgroundColor: "#f8f9fa",
            color: "#000",
            padding: "1rem",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
          }}
        >
          {simplifiedText || "Your simplified text will appear here."}
        </p>
      </div>

      {/* Q&A Card */}
      <div style={cardStyle}>
        <h3 style={{ color: "#000" }}>Ask a Question</h3>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            style={{ ...buttonStyle, padding: "0.5rem 1rem" }}
            onClick={askQuestion}
            onMouseEnter={buttonHover}
            onMouseLeave={buttonLeave}
            disabled={loadingAnswer}
          >
            {loadingAnswer ? "Generating..." : "Ask"}
          </button>
        </div>
        {answer && (
          <p style={{ marginTop: "0.5rem", fontStyle: "italic", color: "#555" }}>
            {answer}
          </p>
        )}
      </div>
    </div>
  );
}
