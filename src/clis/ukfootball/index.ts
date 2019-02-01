import {Application} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {EplLeagueGameRepository} from '../../repositories';
import {MongodbDataSource} from '../../datasources/mongodb.datasource';

// Using the Mixin
class SourcesApplication extends RepositoryMixin(Application) {}

const app = new SourcesApplication();
// EplLeagueGameRepository will be bound to key `repositories.EplLeagueGameRepository`
app.dataSource(MongodbDataSource);
app.repository(EplLeagueGameRepository);

const test = app
  .get('repositories.EplLeagueGameRepository')
  .then((repo: EplLeagueGameRepository) => {
    repo.create({div: 'test'});
    console.log(repo);
  });
console.log(test);
// import EplLeagueScraper from './eplLeagueScraper';
// import Fetcher from './fetcher';
// import {eplUrl, homepageUrl} from './constants';
// import {MysqlDataSource} from '../../datasources/mysql.datasource';

// async function test() {
//   const eplFetcher = new Fetcher(eplUrl);
//   await eplFetcher.fetchHtmlContent();
//   const eplLeagueScraper = new EplLeagueScraper(
//     eplFetcher.htmlContent,
//     homepageUrl,
//   );
//   await eplLeagueScraper.scrape();
//   // const els = new EplLeagueScraper(EplHtml, 'http://www.football-data.co.uk');
//   // await els.scrape();
//   // console.log(els.hrefs);
// }

// test();
