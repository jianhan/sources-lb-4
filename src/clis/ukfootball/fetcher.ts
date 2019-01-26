import * as rp from 'request-promise';
import * as validator from 'validator';
import logger from '../../configs/winston';

export default class Fetcher {
  private htmlContent: string;

  private url: string;

  constructor(url: string) {
    if (!validator.isURL(url)) {
      throw new Error('not a valid url :' + url);
    }

    this.url = url;
  }

  public async fetchHtmlContent() {
    await rp(this.url)
      .then((htmlContent: string) => {
        logger.log({
          level: 'debug',
          message: htmlContent,
        });
        this.htmlContent = htmlContent;
      })
      .catch((err: Error) => {
        logger.log({
          level: 'warn',
          message: err,
        });
        throw err;
      });
  }
}
