import EplLeagueScraper from './eplLeagueScraper';
import {EplHtml} from './testdata/html';

test('empty html expected error', () => {
  expect(() => {
    const els = new EplLeagueScraper('');
  }).toThrow();
});

test('can not query correct links', () => {
  const els = new EplLeagueScraper('<html>no links provided</html>');
  els.scrape();
  expect(els.eplGames).toEqual([]);
});

test('successfuly retrieve links', () => {
  const els = new EplLeagueScraper(EplHtml);
  els.scrape();
  expect(els.eplGames).toEqual([]);
});
