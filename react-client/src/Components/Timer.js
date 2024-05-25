import React, { useState, useEffect } from 'react';

const Timer = ({ initialSeconds, onComplete }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onComplete();
    }
  }, [seconds, onComplete]);

  return <div>{seconds > 0 ? `Rest Time: ${seconds}s` : "Rest Complete"}</div>;
};

export default Timer;
