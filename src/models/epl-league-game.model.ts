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
    description: 'Division',
  })
  div: string;

  constructor(data?: Partial<EplLeagueGame>) {
    super(data);
  }
}
