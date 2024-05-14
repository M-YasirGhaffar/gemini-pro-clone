import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);

  return (
    <div className="sidebar">
      <div className="top">
        <img
          src={assets.menu_icon}
          className="menu"
          alt="menu-icon"
          onClick={() => {
            setExtended((prev) => !prev);
          }}
        />
<div
    className="new-chat"
    onClick={async () => {
        const response = await axios.get("https://gemini-pro-clone.onrender.com/clear-chat");
        const data = response.data;
        alert(data.message);
		window.location.reload();
    }}
>
    <img src={assets.plus_icon} alt="" />
    {extended ? <p>New Chat</p> : null}
</div>
        {extended ? <div className="recent"></div> : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="" />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
