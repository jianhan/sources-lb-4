import Fetcher from './fetcher';

test('invalid url expect error', () => {
  expect(() => {
    const f = new Fetcher('abcdef');
    f.fetchHtmlContent();
  }).toThrow();
});
