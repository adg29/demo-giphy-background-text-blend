import { useState, useEffect } from 'react'

// Hook
function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // Add event listeners
  useEffect(() => {
    let prevKey = '';
    // If pressed key is our target key then set to true
    function downHandler({ key }) {
      // prevent re-render
      if (prevKey === targetKey) return;

      if (key === targetKey) {
        setKeyPressed(true);
        prevKey = key;
      }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
        prevKey = '';
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

export default useKeyPress