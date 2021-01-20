import React, { useState, useEffect } from "react";
import classes from "./Maze.module.scss";

const Maze = (props) => {
  const [maze, setMaze] = useState([
    {
      x: 0,
      y: 0,
      value: 16,
    },
    {
      x: 1,
      y: 0,
      value: 14,
    },
    {
      x: 2,
      y: 0,
      value: 16,
    },
    {
      x: 3,
      y: 0,
      value: 16,
    },
    {
      x: 4,
      y: 0,
      value: 16,
    },
    {
      x: 0,
      y: 1,
      value: 16,
    },
    {
      x: 1,
      y: 1,
      value: 15,
    },
    {
      x: 2,
      y: 1,
      value: 15,
    },
    {
      x: 3,
      y: 1,
      value: 15,
    },
    {
      x: 4,
      y: 1,
      value: 16,
    },
    {
      x: 0,
      y: 2,
      value: 16,
    },
    {
      x: 1,
      y: 2,
      value: 15,
    },
    {
      x: 2,
      y: 2,
      value: 16,
    },
    {
      x: 3,
      y: 2,
      value: 16,
    },
    {
      x: 4,
      y: 2,
      value: 16,
    },
    {
      x: 0,
      y: 3,
      value: 16,
    },
    {
      x: 1,
      y: 3,
      value: 15,
    },
    {
      x: 2,
      y: 3,
      value: 15,
    },
    {
      x: 3,
      y: 3,
      value: 15,
    },
    {
      x: 4,
      y: 3,
      value: 0,
    },
    {
      x: 0,
      y: 4,
      value: 16,
    },
    {
      x: 1,
      y: 4,
      value: 16,
    },
    {
      x: 2,
      y: 4,
      value: 16,
    },
    {
      x: 3,
      y: 4,
      value: 16,
    },
    {
      x: 4,
      y: 4,
      value: 16,
    },
  ]);
  const [startIndex, setStartIndex] = useState(1);
  const maxIterations = 23;

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

  useEffect(() => {});

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
    if (counter > maxIterations) {
      console.log("false counter > maxIterations");
      return false;
    }
    if (counter === 23) {
      //
      console.log("true counter");
      return true;
    } else {
      const startPositions = getStartPositions(counter, workedMaze); //===
      if (!startPositions.length) {
        console.log(workedMaze);
        console.log("false startPositions");
        return false;
      } else {
        const neighbors = getNeighbors(startPositions);

        const updatedMaze = workedMaze.map((value, index) => {
          if (
            neighbors.includes(startIndex) &&
            index === startIndex &&
            value.value === 14
          ) {
            return { ...value, value: counter + 1, flag: "start" };
          } else if (neighbors.includes(index) && value.value === 15) {
            //15
            return { ...value, value: counter + 1, flag: "opened" };
          } else return value;
        });

        setMaze(updatedMaze);
        wavePropagation(counter + 1, updatedMaze);
      }
    }
  };

  return (
    <>
      <button onClick={() => wavePropagation(0, maze)}>State</button>
      <div className={classes.Maze}>
        {maze.map((item, index) => (
          <div key={index} className={classes[item.flag]}>
            {item.value} {item.x} {item.y}
            {item.flag}
            <br />
            {index}
          </div>
        ))}
      </div>
    </>
  );
};

export default Maze;
