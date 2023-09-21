import { Beatmap, Calculator, Score } from "rosu-pp";

export const calculate = (beatmapFile: string, score: Score) => {
  const mapData = new Beatmap({
    path: beatmapFile,
  });
  const performanceCalc = new Calculator(score).performance(mapData);
  return performanceCalc;
};
