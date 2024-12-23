import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Papa from 'papaparse';
import { MessageCircleIcon, SendIcon, XIcon, MessageSquareOff } from "lucide-react";
import "./GeminiChatbox.css";

const EnhancedChatbox = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [legalData, setLegalData] = useState({
    ipc: [],
    bns: [],
    bsa: [],
  });
  const chatContainerRef = useRef(null);

  // Initialize Gemini AI with Vite environment variable
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Load CSV data
  useEffect(() => {
    const loadLegalData = async () => {
      try {
        const loadCSV = async (filename) => {
          const response = await fetch(`/data/${filename}`);
          const csvText = await response.text();
          return new Promise((resolve) => {
            Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                resolve(results.data);
              }
            });
          });
        };

        const [ipcData, bnsData, bsaData] = await Promise.all([
          loadCSV('ipc_sections.csv'),
          loadCSV('bns_sections.csv'),
          loadCSV('bsa_sections.csv')
        ]);

        setLegalData({
          ipc: ipcData,
          bns: bnsData,
          bsa: bsaData
        });
      } catch (error) {
        console.error("Error loading legal data:", error);
      }
    };

    loadLegalData();
  }, []);

  // Search functions for each legal code
  const searchLegalData = (query, database, type) => {
    query = query.toLowerCase().trim();
    const results = [];
    
    database.forEach((entry) => {
      let searchText, resultText;
      
      if (type === 'ipc') {
        searchText = `${entry.Section} ${entry.Description} ${entry.Offense} ${entry.Punishment}`;
        resultText = `Section ${entry.Section}:\n${entry.Description}\nOffense: ${entry.Offense}\nPunishment: ${entry.Punishment}`;
      } else { // BNS and BSA have the same structure
        searchText = `${entry.Section} ${entry.Description} ${entry['Section _name']} ${entry.Chapter_name}`;
        resultText = `Chapter ${entry.Chapter} - ${entry.Chapter_name}\nSection ${entry.Section}: ${entry['Section _name']}\n${entry.Description}`;
      }
      
      if (searchText.toLowerCase().includes(query)) {
        results.push(resultText);
      }
    });
    
    return results.length > 0 ? results.join("\n\n") : null;
  };

  const generateWithContext = async (query, context, type) => {
    const lawName = type === 'ipc' 
      ? 'Indian Penal Code (IPC)'
      : type === 'bns'
        ? 'Bharatiya Nyaya Sanhita (BNS), 2023'
        : 'Bharatiya Sakshya Adhiniyam (BSA), 2023';

    const prompt = `
      You are an expert in the ${lawName}. Use the following context to answer the query:

      Legal Context:
      ${context}

      User Query: ${query}
      Provide a clear and concise response, referring to relevant sections when appropriate.
      If providing multiple sections, format them clearly with section numbers and descriptions.
      Give plain text as reponse.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  const formatContext = (data, type) => {
    if (type === 'ipc') {
      return data.map(entry => 
        `Section ${entry.Section}:\n${entry.Description}\nOffense: ${entry.Offense}\nPunishment: ${entry.Punishment}`
      ).join("\n\n");
    } else {
      return data.map(entry =>
        `Chapter ${entry.Chapter} - ${entry.Chapter_name}\nSection ${entry.Section}: ${entry['Section _name']}\n${entry.Description}`
      ).join("\n\n");
    }
  };

  const processMessage = async (message) => {
    const casualGreetings = ["hi", "hello", "how are you", "what's up", "hey"];
    const lowercaseMsg = message.toLowerCase();

    if (casualGreetings.includes(lowercaseMsg)) {
      return "Hello! I'm your legal assistant. How can I help you with information about the Indian Penal Code (IPC), Bharatiya Nyaya Sanhita (BNS), or Bharatiya Sakshya Adhiniyam (BSA)?";
    }

    // Check for explicit mentions
    const responses = [];

    if (lowercaseMsg.includes("ipc") || lowercaseMsg.includes("indian penal code")) {
      const response = searchLegalData(message, legalData.ipc, 'ipc');
      if (response) {
        responses.push(`IPC Results:\n${response}`);
      } else {
        const context = formatContext(legalData.ipc, 'ipc');
        const aiResponse = await generateWithContext(message, context, 'ipc');
        responses.push(aiResponse);
      }
    }

    if (lowercaseMsg.includes("bns") || lowercaseMsg.includes("bharatiya nyaya")) {
      const response = searchLegalData(message, legalData.bns, 'bns');
      if (response) {
        responses.push(`BNS Results:\n${response}`);
      } else {
        const context = formatContext(legalData.bns, 'bns');
        const aiResponse = await generateWithContext(message, context, 'bns');
        responses.push(aiResponse);
      }
    }

    if (lowercaseMsg.includes("bsa") || lowercaseMsg.includes("bharatiya sakshya")) {
      const response = searchLegalData(message, legalData.bsa, 'bsa');
      if (response) {
        responses.push(`BSA Results:\n${response}`);
      } else {
        const context = formatContext(legalData.bsa, 'bsa');
        const aiResponse = await generateWithContext(message, context, 'bsa');
        responses.push(aiResponse);
      }
    }

    // If no explicit mentions, search all databases
    if (responses.length === 0) {
      const ipcResponse = searchLegalData(message, legalData.ipc, 'ipc');
      const bnsResponse = searchLegalData(message, legalData.bns, 'bns');
      const bsaResponse = searchLegalData(message, legalData.bsa, 'bsa');

      if (ipcResponse) responses.push(`IPC Results:\n${ipcResponse}`);
      if (bnsResponse) responses.push(`BNS Results:\n${bnsResponse}`);
      if (bsaResponse) responses.push(`BSA Results:\n${bsaResponse}`);

      // If still no results, use combined context
      if (responses.length === 0) {
        const combinedContext = [
          "IPC Context:\n" + formatContext(legalData.ipc, 'ipc'),
          "BNS Context:\n" + formatContext(legalData.bns, 'bns'),
          "BSA Context:\n" + formatContext(legalData.bsa, 'bsa')
        ].join("\n\n");

        const aiResponse = await generateWithContext(message, combinedContext, 'combined');
        responses.push(aiResponse);
      }
    }

    return responses.join("\n\n");
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;
    
    setIsLoading(true);
    try {
      const response = await processMessage(userInput);
      
      setChatHistory(prevHistory => [
        ...prevHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory(prevHistory => [
        ...prevHistory,
        { type: "user", message: userInput },
        { type: "bot", message: "Sorry, there was an error processing your request." },
      ]);
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const clearChat = () => setChatHistory([]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="gemini-chatbox-wrapper">
      {/* Chat Toggle Button */}
      {!isChatOpen && (
        <button 
          onClick={toggleChat}
          className="gemini-chat-toggle-btn"
        >
          <MessageCircleIcon size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="gemini-chat-container">
          {/* Chat Header */}
          <div className="gemini-chat-header">
            <h3>Legal AI Assistant</h3>
            <div className="gemini-chat-header-actions">
              <button 
                onClick={clearChat}
                title="Clear Chat"
              >
                <MessageSquareOff size={20} />
              </button>
              <button 
                onClick={toggleChat}
                title="Close Chat"
              >
                <XIcon size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="gemini-chat-messages"
          >
            {chatHistory.map((chat, index) => (
              <div 
                key={index} 
                className={`gemini-chat-message ${chat.type}`}
              >
                <div className="message-content">
                  {chat.message}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="gemini-chat-message bot">
                <div className="message-content">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="gemini-chat-input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about IPC, BNS, or BSA..."
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || userInput.trim() === ""}
            >
              <SendIcon size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedChatbox;