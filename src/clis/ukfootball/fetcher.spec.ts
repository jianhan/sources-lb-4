import Fetcher from './fetcher';
import {RequestError} from 'request-promise/errors';

test('url do not exists expected error', async () => {
  // expect(async () => {
  //   const f = new Fetcher('http://test.test');
  //   await f.fetchHtmlContent();
  // }).toThrow();
  const f = new Fetcher('http://test.test');
  await expect(f.fetchHtmlContent()).rejects.toBeInstanceOf(RequestError);
});
