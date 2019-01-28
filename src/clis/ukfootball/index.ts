import EplLeagueScraper from './eplLeagueScraper';
import Fetcher from './fetcher';
import {eplUrl, homepageUrl} from './constants';

async function test() {
  const eplFetcher = new Fetcher(eplUrl);
  await eplFetcher.fetchHtmlContent();
  const eplLeagueScraper = new EplLeagueScraper(
    eplFetcher.htmlContent,
    homepageUrl,
  );
  await eplLeagueScraper.scrape();
  // const els = new EplLeagueScraper(EplHtml, 'http://www.football-data.co.uk');
  // await els.scrape();
  // console.log(els.hrefs);
}

test();
