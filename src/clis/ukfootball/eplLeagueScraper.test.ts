import EplLeagueScraper from './eplLeagueScraper';

test('empty html expected error', () => {
  expect(() => {
    const els = new EplLeagueScraper('');
  }).toThrow();
});

test('can not query correct links', () => {
  const els = new EplLeagueScraper('<html>no links provided</html>');
  els.scrape();
  expect(els.eplGames()).toBe([]);
});
