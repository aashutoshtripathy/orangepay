import React, { useEffect, useState } from 'react'
import CancellationHistory from './CancellationHistory'

const CancellationHistoryyy = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
          setUserId(storedUserId);
      }
  }, []); // Runs only once after the first render

  if (!userId) {
      return <div>Loading...</div>; // Or any placeholder while userId is being fetched
  }

  return (
      <div>
          <CancellationHistory userId={userId} />
      </div>
  );
};

export default CancellationHistoryyy
