import { useState } from "react";
import Cell from './Cell';

const testCells = Array(9).fill(null).map((e, i) => (createCellData(i)));

const testCells2 = [
  { state: 0, hasBomb: false, index: 0 },
  { state: 0, hasBomb: true, index: 1 },
  { state: 0, hasBomb: false, index: 2 },
  { state: 0, hasBomb: true, index: 3 },
  { state: 0, hasBomb: true, index: 4 },
  { state: 0, hasBomb: false, index: 5 },
  { state: 0, hasBomb: true, index: 6 },
  { state: 0, hasBomb: false, index: 7 },
  { state: 0, hasBomb: false, index: 8 },
  
];

function createCellData(i) {
  return { state: 0, hasBomb: false, index: i };
}

export default function Board({ rows, columns }) {
  const [cells, setCells] = useState(testCells2);

  function handleClick(i) {
    const nextCells = cells.slice();
    const cellData = nextCells[i];

    if (cellData.state === 2 || cellData.state === 1) {
      return;
    }
    nextCells[i].state = 1;
    setCells(nextCells);
  }

  function handleRightClick(event, i) {
    event.preventDefault();

    const nextCells = cells.slice();
    const cellData = nextCells[i];

    if (cellData.state === 1) {
      return;
    }
    if (cellData.state === 0) {
      nextCells[i].state = 2;
      setCells(nextCells);
    } else if (cellData.state === 2) {
      nextCells[i].state = 0;
      setCells(nextCells);
    }
  }

  function getCellValue(i) {
    const cellData = cells[i];
    let value = "-";

    if (cellData.state === 1) {
      value = "#";
    } else if (cellData.state === 2) {
      value = "F";
    }

    return value;
  }

  function numberOfBombsInCells(cellsToCheck) {
    return cellsToCheck.reduce(
      (numFound, currentCell) => {
        if (currentCell.hasBomb) {
          return numFound + 1;
        }
        return numFound;
      }
      ,0
    );
  }

  function getAdjacentBombNumber(i) {
    // edge cases for getting adjacent cells
    if (i < columns && i % columns === 0) {
      // top left corner
      const adjCells = [cells[i + 1], cells[columns], cells[columns + 1]];
      console.log(adjCells);
      const numAdj = numberOfBombsInCells(adjCells);
      console.log(numAdj);
      return "top left";
    } else if (i < columns && (i + 1) % columns === 0) {
      // top right corner
      return "top right";
    } else if (i >= cells.length - columns && i % columns === 0) {
      // bottom left corner
      return "bottom left";
    } else if (i > cells.length - columns && (i + 1) % columns === 0) {
      // bottom right corner
      return "bottom right";
    } else if (i < columns) {
      // top row
      return "top";
    } else if (i > cells.length - columns) {
      // bottom row
      return "bottom";
    } else if (i % columns === 0) {
      // left most column
      return "left";
    } else if ((i + 1) % columns === 0) {
      // right most column
      return "right";
    }
    return "middle"
  }

  const r = [];
  
  for (let i = 0; i < rows; i++) {

    const c = [];
    
    for (let j = 0; j < columns; j++) {
      const cellIndex = (i * rows) + j;
      const cellValue = getCellValue(cellIndex);
      const cn = getAdjacentBombNumber(cellIndex);
      c.push(
        <Cell
          // cn={cn}
          key={cellIndex}
          value={cellValue}
          onCellClick={() => handleClick(cellIndex)}
          onCellRightClick={(e) => handleRightClick(e, cellIndex)}
        />
      );
    }

    r.push(<div key={i}>{c}</div>);
  }
      
  return (
    <div>
      {r}
    </div>
  );
}
