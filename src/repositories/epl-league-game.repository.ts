import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {EplLeagueGame} from '../models';
import {MongodbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EplLeagueGameRepository extends DefaultCrudRepository<
  EplLeagueGame,
  typeof EplLeagueGame.prototype.id
> {
  constructor(@inject('datasources.mongodb') dataSource: MongodbDataSource) {
    super(EplLeagueGame, dataSource);
  }
}
