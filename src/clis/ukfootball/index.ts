require('dotenv').config();
import EplLeagueScraper from './eplLeagueScraper';
import Fetcher from './fetcher';
import {eplUrl, homepageUrl} from './constants';
import logger from '../../configs/winston';
import App from './app';
import {exit} from 'shelljs';
import EplLeagueImporter from './eplLeagueImporter';

const app = App.getInstance();

app.get('importers.eplLeague').then(async (importer: EplLeagueImporter) => {
  importer.import();
});

// async function process() {
//   const eplFetcher = new Fetcher(eplUrl);
//   await eplFetcher.fetchHtmlContent();
//   const eplLeagueScraper = new EplLeagueScraper(
//     eplFetcher.htmlContent,
//     homepageUrl,
//   );
//   eplLeagueScraper
//     .scrape()
//     .then(() => {
//       logger.log({
//         level: 'info',
//         message: 'epl file downloaded',
//       });
//     })
//     .catch(e => {
//       logger.log({
//         level: 'error',
//         message: 'got err while downloading epl csv' + e,
//       });
//     });
// }

// process();
// console.log(123);

// const test = app
//   .get('repositories.EplLeagueGameRepository')
//   .then((repo: EplLeagueGameRepository) => {
//     repo.create({div: 'test'});
//     console.log(repo);
//   });
// console.log(test);
