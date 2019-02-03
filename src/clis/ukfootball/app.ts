import {Application, BindingScope} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {EplLeagueGameRepository} from '../../repositories';
import {MongodbDataSource} from '../../datasources/mongodb.datasource';
import EplLeagueImporter from './eplLeagueImporter';

export default class App extends RepositoryMixin(Application) {
  private constructor() {
    super();
  }

  public static getInstance(): App {
    const application = new App();
    application.dataSource(MongodbDataSource);
    application.repository(EplLeagueGameRepository);
    application
      .bind('importers.eplLeague')
      .toClass(EplLeagueImporter)
      .inScope(BindingScope.SINGLETON);
    return application;
  }

  async stop() {
    console.log('application is shutting down...');
    // The superclass stop method will call stop on all servers that are
    // bound to the application.
    await super.stop();
  }
}
