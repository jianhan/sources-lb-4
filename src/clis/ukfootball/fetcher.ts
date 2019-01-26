import * as rp from 'request-promise';

export default class Fetcher {
  private htmlContent: string;

  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public fetchHtmlContent(): void {
    rp(this.url)
      .then((htmlContent: string) => {
        this.htmlContent = htmlContent;
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }
}
