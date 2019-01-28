import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {EplLeagueGame} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EplLeagueGameRepository extends DefaultCrudRepository<
  EplLeagueGame,
  typeof EplLeagueGame.prototype.id
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(EplLeagueGame, dataSource);
  }
}
