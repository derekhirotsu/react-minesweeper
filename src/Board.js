import { useState } from "react";
import Cell from './Cell';

const testCells = Array(9).fill(null).map((e, i) => (createCellData(i)));

const testCells2 = [
  { state: 0, hasMine: true, index: 0 },
  { state: 0, hasMine: false, index: 1 },
  { state: 0, hasMine: false, index: 2 },
  { state: 0, hasMine: false, index: 3 },
  { state: 0, hasMine: false, index: 4 },
  { state: 0, hasMine: false, index: 5 },
  { state: 0, hasMine: false, index: 6 },
  { state: 0, hasMine: false, index: 7 },
  { state: 0, hasMine: false, index: 8 },
  
];

function createCellData(i) {
  return { state: 0, hasMine: false, index: i };
}

export default function Board({ rows, columns }) {
  const [cells, setCells] = useState(testCells2);

  function handleClick(i) {
    const nextCells = cells.slice();
    console.log(nextCells);
    const cellData = nextCells[i];

    if (cellData.state === 2 || cellData.state === 1) {
      return;
    }
    nextCells[i].state = 1;
    setCells(nextCells);

    // TODO: recursively setting state isn't great. Find all cells to update (recursively?) then update state once
    if (getAdjacentMineNumber(i) === 0 && !cellData.hasMine) {
      const ad = getAdjacentCells(i);
      console.log(ad)
      for (let j = 0; j < ad.length; j++) {
        handleClick(ad[j].index);
      }
    }
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
      value = cellData.hasMine ? "*" : "" + getAdjacentMineNumber(i);
    } else if (cellData.state === 2) {
      value = "F";
    }

    return value;
  }

  function numberOfMinesInCells(cellsToCheck) {
    return cellsToCheck.reduce(
      (numFound, currentCell) => {
        if (currentCell.hasMine) {
          return numFound + 1;
        }
        return numFound;
      }
      ,0
    );
  }

  function isCellInTopRow(cellIndex) {
    return cellIndex < columns;
  }

  function isCellInBottomRow(cellIndex) {
    return cellIndex >= cells.length - columns;
  }

  function isCellInLeftColumn(cellIndex) {
    return cellIndex % columns === 0;
  }

  function isCellInRightColumn(cellIndex) {
    return (cellIndex + 1) % columns === 0;
  }

  function isCellTopLeft(cellIndex) {
    return isCellInTopRow(cellIndex) && isCellInLeftColumn(cellIndex);
  }

  function isCellTopRight(cellIndex) {
    return isCellInTopRow(cellIndex) && isCellInRightColumn(cellIndex);
  }

  function isCellBottomLeft(cellIndex) {
    return isCellInBottomRow(cellIndex) && isCellInLeftColumn(cellIndex);
  }

  function isCellBottomRight(cellIndex) {
    return isCellInBottomRow(cellIndex) && isCellInRightColumn(cellIndex);
  }

  function getAdjacentCells(i) {
    const leftIndex = i - 1;
    const rightIndex = i + 1;
    const topIndex = i - columns;
    const bottomIndex = i + columns;
    const topLeftIndex = i - columns - 1;
    const topRightIndex = i - columns + 1;
    const bottomLeftIndex = i + columns - 1;
    const bottomRightIndex = i + columns + 1;

    let adjacentCellIndices = [];

    if (isCellTopLeft(i)) {
      adjacentCellIndices = [rightIndex, bottomIndex, bottomRightIndex];
    } else if (isCellTopRight(i)) {
      adjacentCellIndices = [leftIndex, bottomLeftIndex, bottomIndex];
    } else if (isCellBottomLeft(i)) {
      adjacentCellIndices = [topIndex, topRightIndex, rightIndex];
    } else if (isCellBottomRight(i)) {
      adjacentCellIndices = [leftIndex, topLeftIndex, topIndex];
    } else if (isCellInTopRow(i)) {
      adjacentCellIndices = [leftIndex, bottomLeftIndex, bottomIndex, bottomRightIndex, rightIndex];
    } else if (isCellInBottomRow(i)) {
      adjacentCellIndices = [leftIndex, topLeftIndex, topIndex, topRightIndex, rightIndex];
    } else if (isCellInLeftColumn(i)) {
      adjacentCellIndices = [topIndex, topRightIndex, rightIndex, bottomRightIndex, bottomIndex];
    } else if (isCellInRightColumn(i)) {
      adjacentCellIndices = [topIndex, topLeftIndex, leftIndex, bottomLeftIndex, bottomIndex];
    } else {
      adjacentCellIndices = [
        leftIndex,
        rightIndex,
        topIndex,
        bottomIndex,
        topLeftIndex,
        topRightIndex,
        bottomLeftIndex,
        bottomRightIndex
      ];
    }

    return adjacentCellIndices.map(value => cells[value]);
  }

  function getAdjacentMineNumber(i) {
    return numberOfMinesInCells(getAdjacentCells(i));
  }

  const r = [];
  
  for (let i = 0; i < rows; i++) {

    const c = [];
    
    for (let j = 0; j < columns; j++) {
      const cellIndex = (i * rows) + j;
      const cellValue = getCellValue(cellIndex);
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
