import { useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ReactMarkdown from "react-markdown";

const Main = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [showInitialContent, setShowInitialContent] = useState(true);
  const resultEndRef = useRef(null);

  useEffect(() => {
    // Automatically scroll to the bottom of the results when data changes
    resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [resultData]);

  const handleCardClick = (promptText) => {
    setInput(promptText);
    sendRequest(promptText);
  };

  const sendRequest = async (text) => {
    if (!text.trim()) {
		alert("Please enter a valid prompt!");
		return;
	}
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/", { data: text });
      setResultData(response.data.response); // Set new results from the server
      setShowInitialContent(false); // Hide initial content after the first interaction
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    sendRequest(input);
    setInput(""); // Clear input after sending
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user} alt="" />
      </div>
      <div className="main-container">
        {showInitialContent && (
          <>
            <div className="greet">
              <p><span>Hello, Dev </span></p>
              <p>How Can I Help You Today?</p>
            </div>
            <div className="cards">
              <div className="card" onClick={() => handleCardClick("Suggest Some Place To Visit In Kerala")}>
                <p>Suggest Some Place To Visit In Kerala</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              {/* Other cards */}
            </div>
          </>
        )}
        <div className="result">
			<div className="result-data">
			{resultData.map((item, index) => (
            <div key={index} className={`response-entry ${item.role}`}>
              <img src={item.role === "model" ? assets.gemini_icon : assets.user} alt="" />
              {item.role === "model" ? (
                  <p className="markdown-container">
					<ReactMarkdown>{item.parts}</ReactMarkdown>
				  </p>
                ) : (
                  <p>{item.parts}</p>
                )}

            </div>
          ))}
          <div ref={resultEndRef} />
			</div>
          {loading && (
            <div className="response-entry">
			  <img src={assets.gemini_icon} alt="" />
              <p><ClipLoader size={20} color={"#123abc"} /></p>
            </div>
          )}
        </div>
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Enter the Prompt Here"
              disabled={loading}
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img src={assets.send_icon} alt="" onClick={handleSend} disabled={loading} />
            </div>
          </div>
          <div className="bottom-info">
            <p>Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy & Gemini Apps</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
