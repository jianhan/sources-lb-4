import EplLeagueScraper from './eplLeagueScraper';
import {EplHtml} from './testdata/html';

test('empty html expected error', () => {
  expect(() => {
    const els = new EplLeagueScraper('', 'http://www.football-data.co.uk');
  }).toThrow();
});

test('can not query correct links', () => {
  const els = new EplLeagueScraper(
    '<html>no links provided</html>',
    'http://www.football-data.co.uk',
  );
  els.scrape();
  expect(els.eplGames).toEqual([]);
});

test('successfuly retrieve links', () => {
  const els = new EplLeagueScraper(EplHtml, 'http://www.football-data.co.uk');
  els.scrape();
  expect(els.eplGames).toEqual([]);
});

test('download csvs', async () => {
  const els = new EplLeagueScraper(EplHtml, 'http://www.football-data.co.uk');
  await els.scrape();
});
