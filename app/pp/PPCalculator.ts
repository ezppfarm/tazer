import {Beatmap, Calculator, Score} from 'rosu-pp';

export const calculate = (beatmapFile: string, score: Score) => {
  return new Calculator(score).performance(
    new Beatmap({
      path: beatmapFile,
    })
  );
};
