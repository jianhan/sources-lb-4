// import {Application} from '@loopback/core';
// import {RepositoryMixin} from '@loopback/repository';
// import {EplLeagueGameRepository} from '../../repositories';
// import {MongodbDataSource} from '../../datasources/mongodb.datasource';

// // Using the Mixin
// class SourcesApplication extends RepositoryMixin(Application) {}

// const app = new SourcesApplication();
// // EplLeagueGameRepository will be bound to key `repositories.EplLeagueGameRepository`
// app.dataSource(MongodbDataSource);
// app.repository(EplLeagueGameRepository);

// const test = app
//   .get('repositories.EplLeagueGameRepository')
//   .then((repo: EplLeagueGameRepository) => {
//     repo.create({div: 'test'});
//     console.log(repo);
//   });
// console.log(test);

require('dotenv').config();
import EplLeagueScraper from './eplLeagueScraper';
import Fetcher from './fetcher';
import {eplUrl, homepageUrl} from './constants';
import logger from '../../configs/winston';

async function process() {
  const eplFetcher = new Fetcher(eplUrl);
  await eplFetcher.fetchHtmlContent();
  const eplLeagueScraper = new EplLeagueScraper(
    eplFetcher.htmlContent,
    homepageUrl,
  );
  eplLeagueScraper
    .scrape()
    .then(() => {
      logger.log({
        level: 'info',
        message: 'epl file downloaded',
      });
    })
    .catch(e => {
      logger.log({
        level: 'error',
        message: 'got err while downloading epl csv' + e,
      });
    });
}

process();
