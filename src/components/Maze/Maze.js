import React, { useState } from "react";
import classes from "./Maze.module.scss";

const Maze = () => {
  const [startIndex, setStartIndex] = useState(null);
  const [setting, setSetting] = useState({
    x: 10,
    y: 10,
    maxIterations: 100,
    start: 98,
    finish: 0,
    open: 99,
    wall: 100,
  });
  const [buildParams, setBuildParams] = useState({
    name: "start",
    value: setting.start,
  });
  const [error, setError] = useState(null);

  const createCleanMaze = (x, y, wall) => {
    const sizeX = [
      ...Array.from(Array(y).fill([...Array.from(Array(x).keys())])),
    ].flat();

    const sizeY = [...Array.from(Array(y))]
      .map((value, index) => {
        return (value = [...Array.from(Array(x).fill(index))]);
      })
      .flat();

    const cleanMaze = [...Array.from(Array(x * y).keys())].map((key) => ({
      x: sizeX[key],
      y: sizeY[key],
      value: wall,
      flag: "wall",
    }));
    return cleanMaze;
  };

  const [maze, setMaze] = useState(
    createCleanMaze(setting.x, setting.y, setting.wall)
  );

  const getNeighbors = (startPositions) => {
    const neighbors = [];
    startPositions.forEach((value) => {
      const i = maze[value].x;
      const j = maze[value].y;
      const right = maze.findIndex(
        (value) => value.x === i + 1 && value.y === j
      );
      const left = maze.findIndex(
        (value) => value.x === i - 1 && value.y === j
      );
      const top = maze.findIndex((value) => value.x === i && value.y === j + 1);
      const bottom = maze.findIndex(
        (value) => value.x === i && value.y === j - 1
      );
      neighbors.push(right, left, top, bottom);
    });
    return neighbors.filter(
      (value, index, array) => value !== -1 && array.indexOf(value) === index
    );
  };

  const getNeighborsFlag = (workedMaze, startPositions, flag) => {
    const neighbors = [];
    startPositions.forEach((value) => {
      const i = workedMaze[value].x;
      const j = workedMaze[value].y;
      const right = workedMaze.findIndex(
        (value) =>
          value.x === i + 1 &&
          value.y === j &&
          (value.flag === flag[0] || value.flag === flag[1])
      );
      const left = workedMaze.findIndex(
        (value) =>
          value.x === i - 1 &&
          value.y === j &&
          (value.flag === flag[0] || value.flag === flag[1])
      );
      const top = workedMaze.findIndex(
        (value) =>
          value.x === i &&
          value.y === j + 1 &&
          (value.flag === flag[0] || value.flag === flag[1])
      );
      const bottom = workedMaze.findIndex(
        (value) =>
          value.x === i &&
          value.y === j - 1 &&
          (value.flag === flag[0] || value.flag === flag[1])
      );
      neighbors.push(right, left, top, bottom);
    });
    return neighbors.filter(
      (value, index, array) => value !== -1 && array.indexOf(value) === index
    );
  };

  const getStartPositions = (counter, workedMaze) => {
    const startPositions = [];
    workedMaze.forEach((value, index) => {
      if (value.value === counter) {
        startPositions.push(index);
      }
    });
    return startPositions;
  };

  const wavePropagation = (counter, workedMaze) => {
    if (counter > setting.maxIterations) {
      console.log("counter > maxIterations");
      return false;
    } else {
      const startPositions = getStartPositions(counter, workedMaze);
      if (!startPositions.length) {
        getResult(workedMaze, startIndex);
        console.log("empty startPositions");
        return false;
      } else {
        const neighbors = getNeighbors(startPositions);

        const updatedMaze = workedMaze.map((value, index) => {
          if (neighbors.includes(index) && value.value === setting.finish) {
            return { ...value, flag: "finish" };
          }
          if (
            neighbors.includes(startIndex) &&
            index === startIndex &&
            value.value === setting.start
          ) {
            return { ...value, value: counter + 1, flag: "start" };
          } else if (
            neighbors.includes(index) &&
            value.value === setting.open
          ) {
            return { ...value, value: counter + 1, flag: "path" };
          } else return value;
        });

        setMaze(updatedMaze);
        wavePropagation(counter + 1, updatedMaze);
      }
    }
  };

  const buildMaze = (selectedIndex) => {
    if (buildParams === null) {
      return false;
    }
    if (buildParams.name === "start") {
      const prevStart = maze.findIndex(
        (value) => value.value === setting.start
      );
      const updatedMaze = maze.map((value, index) => {
        if (index === prevStart) {
          return { ...value, value: setting.wall, flag: "build" };
        }
        if (index === selectedIndex) {
          setStartIndex(selectedIndex);
          return { ...value, value: buildParams.value, flag: buildParams.name };
        } else return value;
      });
      setMaze(updatedMaze);
    } else {
      const updatedMaze = maze.map((value, index) => {
        if (index === selectedIndex) {
          if (
            getNeighbors([selectedIndex]).length !== 4 &&
            buildParams.name !== "wall"
          ) {
            return { ...value, flag: "finish", value: setting.finish };
          } else
            return {
              ...value,
              value: buildParams.value,
              flag: buildParams.name,
            };
        } else return value;
      });
      setMaze(updatedMaze);
    }
  };

  const getResult = (workedMaze, startIndex) => {
    if (startIndex === null) {
      setError({
        message: "You need RESTART maze and to set the starting position",
      });
    } else if (workedMaze[startIndex].value === setting.finish) {
      setError({
        message: "Finish! RESTART maze",
      });
    } else {
      const neighbors = getNeighborsFlag(
        workedMaze,
        [startIndex],
        ["path", "finish"]
      );
      if (neighbors.length === 0) {
        setError({ message: "No exit" });
      } else {
        const minElement = neighbors.reduce(function (first, second) {
          return workedMaze[first].value < workedMaze[second].value
            ? first
            : second;
        });

        const updatedMaze = workedMaze.map((value, index) => {
          if (minElement === index) {
            return { ...value, flag: "openStart" };
          } else return value;
        });
        setMaze(updatedMaze);
        getResult(updatedMaze, minElement);
      }
    }
    setBuildParams(null);
  };

  const restartMaze = () => {
    setMaze(() => createCleanMaze(setting.x, setting.y, setting.wall));
    setBuildParams({
      name: "start",
      value: setting.start,
    });
    setStartIndex(null);
    setError(null);
  };

  const navbar = ["start", "open", "wall"].map((value, index) => {
    const cls = [classes[value]];
    if (buildParams && buildParams.name === value) {
      cls.push(classes.selected);
    }
    return (
      <button
        className={cls.join(" ")}
        key={index}
        disabled={!!!buildParams}
        onClick={() => setBuildParams({ name: value, value: setting[value] })}
      >
        {value}
      </button>
    );
  });

  return (
    <div className={classes.MazeContainer}>
      <div className={classes.errors}>{error && error.message}</div>
      <div className={classes.manegeButtons}>
        {navbar}
        <div></div>
        <button
          className={classes.manage}
          onClick={() => wavePropagation(0, maze)}
        >
          RUN
        </button>
        <button className={classes.manage} onClick={() => restartMaze()}>
          CLEAN
        </button>
      </div>

      <div
        className={classes.maze}
        style={{
          gridTemplateColumns: `repeat(${setting.x}, 70px)`,
          gridTemplateRows: `repeat(${setting.y}, 70px)`,
        }}
      >
        {maze.map((item, index) => (
          <div
            key={index}
            className={classes[item.flag]}
            onClick={() => buildMaze(index)}
          >
            {item.flag === "openStart" ? item.value : null}
            {item.flag === "start" ? "START" : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maze;
