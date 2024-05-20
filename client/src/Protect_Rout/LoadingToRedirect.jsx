//-----step 1------   Create function redirect
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create function redirect
const LoadingToRedirect = () => {
  const [count, setCount] = useState(3); //set 3s
  const navigate = useNavigate();

  useEffect(() => {
    //create function  interval
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount); // 3 2 1 0!
    }, 1000); //1s

    //if count = 0 Redirect to home page
    count === 0 && navigate("/");
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div>
      <h1>No Permission, redirect in {count}</h1>
    </div>
  );
};
export default LoadingToRedirect;
