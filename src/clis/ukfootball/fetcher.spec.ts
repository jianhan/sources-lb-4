import Fetcher from './fetcher';
import {RequestError} from 'request-promise/errors';

test('url do not exists expected error', async () => {
  const f = new Fetcher('http://test.test');
  await expect(f.fetchHtmlContent()).rejects.toBeInstanceOf(RequestError);
});

test('successful retrieve html', async () => {
  const f = new Fetcher('http://www.football-data.co.uk/englandm.php');
  await f.fetchHtmlContent();
  expect(f.htmlContent).not.toBe('');
});
