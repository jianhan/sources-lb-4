import {Entity, model, property} from '@loopback/repository';

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
  ftr: string;

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
  htr: string;

  constructor(data?: Partial<EplLeagueGame>) {
    super(data);
  }
}
