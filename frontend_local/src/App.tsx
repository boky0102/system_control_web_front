import { useEffect, useRef, useState } from "react";
import "./App.css";
import { calculateAngle, calculateDirection } from "./utility/calculations";

type pos = {
  x: number;
  y: number;
};

function App() {
  const [mouseDown, setMouseDown] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const currentLocation = window.location.hostname;
    console.log(window.location);

    const currentPath = window.location.pathname;
    const currentPort = currentPath.split("/")[1];

    const backendurl = "http://" + currentLocation + ":" + currentPort + "/";
    console.log(backendurl);

    // Establish WebSocket connection
    wsRef.current = new WebSocket(backendurl + "ws");

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
      sendTouchData(100, 100);
    };

    wsRef.current.onmessage = (message) => {
      console.log("Received from server:", message.data);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const touchPos = useRef({ x: 0, y: 0 });
  const addToCursor = useRef({ x: 0, y: 0 });
  const touchElem = useRef<HTMLDivElement | null>(null);
  let elemCenter: pos;
  let elemHeight: number;

  if (touchElem.current) {
    const x = touchElem.current.getBoundingClientRect().left / 2;
    const y = touchElem.current.getBoundingClientRect().bottom / 2;
    if (x && y) {
      const rect = touchElem.current.getBoundingClientRect();
      elemCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      elemHeight = touchElem.current.clientHeight / 2;
    }
  }

  function handeVolumeUp() {
    wsRef.current?.send("6!u");
  }

  function handleVolumeDonw() {
    wsRef.current?.send("6!d");
  }

  function handleFullScreen() {
    wsRef.current?.send("1!1");
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const newTouchPos = {
      x: event.touches.item(0).clientX,
      y: event.touches.item(0).clientY,
    };
    touchPos.current = newTouchPos;

    if (elemCenter && elemHeight) {
      const angle = calculateAngle(newTouchPos, elemCenter, elemHeight);
      const cursorPos = calculateDirection(angle.angle, angle.intensity);
      addToCursor.current = cursorPos;
    }
    setMouseDown(true);
  }

  function handleTouchEnd() {
    console.log("Released");
    setMouseDown(false);
  }

  const sendTouchData = (x: number, y: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(`0!${x}/${y}`);
    }
  };

  function handeTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    const newTouchPos = {
      x: event.touches.item(0).clientX,
      y: event.touches.item(0).clientY,
    };
    touchPos.current = newTouchPos;
    if (elemCenter) {
      const angle = calculateAngle(newTouchPos, elemCenter, elemHeight);
      const cursorPos = calculateDirection(angle.angle, angle.intensity);
      addToCursor.current = cursorPos;
    }
  }

  function handleShutdown() {
    wsRef.current?.send("5!y");
  }

  function handleClick() {
    wsRef.current?.send("2!2");
  }

  useEffect(() => {
    let intervalId: number;
    if (mouseDown) {
      intervalId = setInterval(() => {
        sendTouchData(addToCursor.current.x, addToCursor.current.y);
      }, 10);
    }

    return () => {
      clearInterval(intervalId as number);
    };
  }, [mouseDown, addToCursor, touchPos]);

  return (
    <div>
      <div className="top">
        <h1>Hoi Busra</h1>
        <button className="shtdw" onClick={handleShutdown}>
          SHUTDOWN
        </button>
      </div>
      <div className="sound">
        <h1>Sound</h1>
        <div className="control-cont">
          <button onClick={handleVolumeDonw}>-</button>
          <button onClick={handeVolumeUp}>+</button>
        </div>
      </div>
      <div className="fullsc">
        <button onClick={handleFullScreen}>FULL SCREEN</button>
        <button onClick={handleClick}>CLICK</button>
      </div>

      <div className="ms-container">
        <div
          ref={touchElem}
          className="ms"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handeTouchMove}
        ></div>
      </div>
    </div>
  );
}

export default App;
