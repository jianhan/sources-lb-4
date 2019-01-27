export enum GameResult {
  H = 'H',
  D = 'D',
  A = 'A',
}

export interface EplGame {
  Div: string;
  Date: Date;
  HomeTeam: string;
  AwayTeam: string;
  FTHG: number;
  FTAG: number;
  FTR: GameResult;
  HTHG: number;
  HTAG: number;
  HTR: GameResult;
  B365H: number;
  B365D: number;
  B365A: number;
  BWH: number;
  BWD: number;
  BWA: number;
  IWH: number;
  IWD: number;
  IWA: number;
  PSH: number;
  PSD: number;
  PSA: number;
  WHH: number;
  WHD: number;
  WHA: number;
  VCH: number;
  VCD: number;
  VCA: number;
  Bb1X2: number;
  BbMxH: number;
  BbAvH: number;
  BbMxD: number;
  BbAvD: number;
  BbMxA: number;
  BbAvA: number;
  BbOU: number;
  BbMxOverTwoAndHalf: number;
  BbAvOverTwoAndHalf: number;
  BbMxUnderTwoAndHalf: number;
  BbAvUnderTwoAndHalf: number;
  BbAH: number;
  BbAHh: number;
  BbMxAHH: number;
  BbAvAHH: number;
  BbMxAHA: number;
  BbAvAH: number;
}
