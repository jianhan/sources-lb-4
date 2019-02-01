require('dotenv').config();
import EplLeagueScraper from './eplLeagueScraper';
import Fetcher from './fetcher';
import {eplUrl, homepageUrl} from './constants';

async function scrape() {
  const eplFetcher = new Fetcher(eplUrl);
  await eplFetcher.fetchHtmlContent();
  const eplLeagueScraper = new EplLeagueScraper(
    eplFetcher.htmlContent,
    homepageUrl,
  );
  await eplLeagueScraper.scrape();
}

scrape();
