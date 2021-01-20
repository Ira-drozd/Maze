import React, { useState, useEffect } from "react";
import classes from "./Maze.module.scss";

const Maze = (props) => {
  const [startIndex, setStartIndex] = useState(null); //
  // const [finishIndex, setFinishIndex] = useState([]); //
  const [buildParams, setBuildParams] = useState({
    name: "start",
    value: 14,
  });
  const maxIterations = 23;

  const createCleanMaze = () => {
    const x = 10;
    const y = 10;
    const sizeX = [
      ...Array.from(Array(x).fill([...Array.from(Array(x).keys())])),
    ].flat();

    const sizeY = [...Array.from(Array(y))]
      .map((value, index) => {
        return (value = [...Array.from(Array(y).fill(index))]);
      })
      .flat();

    // const test = [
    //   ...Array.from(
    //     Array(y).fill([
    //       ...Array.from(Array(y).fill(0)),
    //       ...Array.from(Array(y).fill(1)),
    //       ...Array.from(Array(y).fill(2)),
    //       ...Array.from(Array(y).fill(3)),
    //       ...Array.from(Array(y).fill(4)),
    //     ])
    //   ),
    // ].flat();
    //console.log("ttttest", test1);

    // const sizeY = [
    //   ...Array.from(Array(5).fill(0)),
    //   ...Array.from(Array(5).fill(1)),
    //   ...Array.from(Array(5).fill(2)),
    //   ...Array.from(Array(5).fill(3)),
    //   ...Array.from(Array(5).fill(4)),
    // ];

    console.log(sizeX);
    const cleanMaze = [...Array.from(Array(x * y).keys())].map((key) => ({
      x: sizeX[key],
      y: sizeY[key],
      value: 16,
      flag: "wall",
    }));
    return cleanMaze;
  };

  const [maze, setMaze] = useState(createCleanMaze());
  // useEffect(() => {
  //   setMaze(() => createCleanMaze());
  // }, []);

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

  // const getA

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
    } else {
      /*if (counter === 23) {
      //
      console.log("true counter");
      return true;
    }*/
      const startPositions = getStartPositions(counter, workedMaze); //===
      if (!startPositions.length) {
        getResult(workedMaze, startIndex);
        console.log("false startPositions");
        return false;
      } else {
        const neighbors = getNeighbors(startPositions);

        const updatedMaze = workedMaze.map((value, index) => {
          if (neighbors.includes(index) && value.value === 0) {
            return { ...value, flag: "finish" };
          }
          if (
            neighbors.includes(startIndex) &&
            index === startIndex &&
            value.value === 14
          ) {
            return { ...value, value: counter + 1, flag: "start" };
          } else if (neighbors.includes(index) && value.value === 15) {
            //15
            return { ...value, value: counter + 1, flag: "path" };
          } else return value;
        });

        setMaze(updatedMaze);
        wavePropagation(counter + 1, updatedMaze);
      }
    }
  };

  const buildMaze = (selectedIndex) => {
    if (buildParams.name === "start") {
      const prevStart = maze.findIndex((value) => value.value === 14);
      console.log(prevStart);
      const updatedMaze = maze.map((value, index) => {
        if (index === prevStart) {
          return { ...value, value: 16, flag: "build" };
        }
        if (index === selectedIndex) {
          setStartIndex(selectedIndex);
          return { ...value, value: 14, flag: "start" };
        } else return value;
      });
      setMaze(updatedMaze);
    } else {
      const updatedMaze = maze.map((value, index) => {
        if (index === selectedIndex) {
          // if (buildParams.name === "finish") {
          //   //setFinishIndex((prevState) => prevState.push(5)); //////////
          //   console.log("dddddddddd", index);
          // }
          return { ...value, value: buildParams.value, flag: buildParams.name };
        } else return value;
      });

      setMaze(updatedMaze);
    }
  };

  // useEffect(() => {
  //   console.log("finishIndex", finishIndex);
  // }, [finishIndex]);

  const getResult = (workedMaze, startIndex) => {
    if (startIndex === null || workedMaze[startIndex].value === 0) {
      //////////////////////
      console.log("yuy need set start position");
    } else {
      const startElement = workedMaze[startIndex];
      console.log(startElement);
      const neighbors = getNeighborsFlag(
        workedMaze,
        [startIndex],
        ["path", "finish"]
      );

      /* const finish = neighbors.filter((pathIndex) => {
        return workedMaze[pathIndex].flag === "finish";
      });

      console.log("finish", finish);*/
      if (neighbors.length === 0) {
        console.log("not neighbors");
      } else {
        const minElement = neighbors.reduce(function (p, v) {
          return workedMaze[p].value < workedMaze[v].value ? p : v;
        });

        const updatedMaze = workedMaze.map((value, index) => {
          if (minElement === index) {
            return { ...value, flag: "openStart" };
          } else return value;
        });

        setMaze(updatedMaze);
        getResult(updatedMaze, minElement);

        //     .reduce((pathIndex) => {
        //   return {
        //     value: workedMaze[pathIndex].value,
        //     flag: workedMaze[pathIndex].flag,
        //     index: pathIndex,
        //   };
        // });
        console.log("minElement", minElement);
      }

      console.log("neighbors end", neighbors);
    }
    console.log(workedMaze);

    //const startElement = workedMaze[startIndex];
    // console.log("startIndexes", startElement);
  };

  return (
    <div className={classes.MazeContainer}>
      <div className={classes.manegeButtons}>
        {startIndex}
        <div
          className={classes.start}
          onClick={() => setBuildParams({ name: "start", value: 14 })}
        >
          start
        </div>
        <div
          className={classes.finish}
          onClick={() => setBuildParams({ name: "finish", value: 0 })}
        >
          finish
        </div>
        <div
          className={classes.open}
          onClick={() => setBuildParams({ name: "open", value: 15 })}
        >
          open
        </div>
        <div
          className={classes.wall}
          onClick={() => setBuildParams({ name: "wall", value: 16 })}
        >
          wall
        </div>
      </div>
      <button onClick={() => wavePropagation(0, maze)}>Start</button>
      <button onClick={() => setMaze(() => createCleanMaze())}>Clean</button>
      <div className={classes.maze}>
        {maze.map((item, index) => (
          <div
            key={index}
            className={classes[item.flag]}
            onClick={() => buildMaze(index)}
          >
            {item.value} {item.x} {item.y}
            {item.flag}
            <br />
            {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maze;
