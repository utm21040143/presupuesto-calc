import React from "react";
import { Sun, Moon } from "lucide-react"; 
import "./ToggleSwitch.css";

const ToggleSwitch = ({ isToggled, onToggle }) => {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className="slider round">
        <Sun className="sun-icon" />
        <Moon className="moon-icon" />
      </span>
    </label>
  );
};

export default ToggleSwitch;
