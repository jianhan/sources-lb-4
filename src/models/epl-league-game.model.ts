import {Entity, model, property} from '@loopback/repository';
import {GameResult} from './constants';

@model({
  name: 'epl_league_games',
})
export class EplLeagueGame extends Entity {
  @property({
    id: true,
    description: 'The unique identifier for a game',
  })
  id: number;

  @property({
    description: 'League Division',
  })
  div: string;

  @property({
    description: 'Match Date',
  })
  date: Date;

  @property({
    description: 'Home Team',
  })
  homeTeam: string;

  @property({
    description: 'Away Team',
  })
  awayTeam: string;

  @property({
    description: 'FTHG - Full Time Home Team Goals',
  })
  fthg: number;

  @property({
    description: 'FTHG - Full Time Away Team Goals',
  })
  ftag: number;

  @property({
    description: 'FTR - Full Time Result',
  })
  ftr: GameResult;

  @property({
    description: 'HTHG - Half Time Home Team Goals',
  })
  hthg: number;

  @property({
    description: 'HTAG - Half Time Away Team Goals',
  })
  htag: number;

  @property({
    description: 'HTR - Half Time Result',
  })
  htr: GameResult;

  @property({
    description: 'Referee',
  })
  referee: string;

  @property({
    description: 'Home Team Shots',
  })
  hs: number;

  @property({
    description: 'Away Team Shots',
  })
  as: number;

  @property({
    description: 'Home Team Shots on Target',
  })
  hst: number;

  @property({
    description: 'Away Team Shots on Target',
  })
  ast: number;

  @property({
    description: 'Home Team Hit Woodwork',
  })
  hhw: number;

  @property({
    description: 'Away Team Hit Woodwork',
  })
  ahw: number;

  @property({
    description: 'Home Team Corners',
  })
  hc: number;

  @property({
    description: 'Away Team Corners',
  })
  ac: number;

  @property({
    description: 'Home Team Fouls Committed',
  })
  hf: number;

  @property({
    description: 'Away Team Fouls Committed',
  })
  af: number;

  @property({
    description: 'Home Team Free Kicks Conceded',
  })
  hfkc: number;

  @property({
    description: 'Away Team Free Kicks Conceded',
  })
  afkc: number;

  @property({
    description: 'Home Team Offsides',
  })
  ho: number;

  @property({
    description: 'Away Team Offsides',
  })
  ao: number;

  @property({
    description: 'Home Team Yellow Cards',
  })
  hy: number;

  @property({
    description: 'Away Team Yellow Cards',
  })
  ay: number;

  @property({
    description: 'Home Team Red Card',
  })
  hr: number;

  @property({
    description: 'Away Team Red Cards',
  })
  ar: number;

  @property({
    description: 'Home Team Bookings Points (10 = yellow, 25 = red)',
  })
  hbp: number;

  @property({
    description: 'Away Team Bookings Points (10 = yellow, 25 = red)',
  })
  abp: number;

  constructor(data?: Partial<EplLeagueGame>) {
    super(data);
  }
}
