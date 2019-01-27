import EplLeagueScraper from './eplLeagueScraper';
import {EplHtml} from './testdata/html';

async function test() {
  const els = new EplLeagueScraper(EplHtml, 'http://www.football-data.co.uk');
  await els.scrape();
}

test();
