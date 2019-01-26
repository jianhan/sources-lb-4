import Fetcher from './fetcher';

test('basic', () => {
  const fetcher = new Fetcher(
    // 'http://www.football-data.co.uk/englandm.php1221',
    'saddass',
  );
  fetcher.fetchHtmlContent();
});
