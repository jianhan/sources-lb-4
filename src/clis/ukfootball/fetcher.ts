import * as rp from 'request-promise';
import * as validator from 'validator';
import logger from '../../configs/winston';

export default class Fetcher {
  private _htmlContent: string;

  private _url: string;

  constructor(url: string) {
    if (!validator.isURL(url)) {
      throw new Error('not a valid url :' + url);
    }

    this._url = url;
  }

  get htmlContent(): string {
    return this._htmlContent;
  }

  get url(): string {
    return this._url;
  }

  public async fetchHtmlContent() {
    await rp(this._url)
      .then((htmlContent: string) => {
        logger.log({
          level: 'debug',
          message: htmlContent,
        });
        this._htmlContent = htmlContent;
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
