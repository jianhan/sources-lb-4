import {EplGame} from './eplGame';
import * as cheerio from 'cheerio';
import * as validator from 'validator';
import logger from '../../configs/winston';

export default class EplLeagueScraper {
  private _html: string;

  private _eplGames: EplGame[];

  constructor(html: string) {
    if (validator.isEmpty(html)) {
      throw new Error(`empty html : ${html}`);
    }
    this._html = html;
    this._eplGames = [];
  }

  get eplGames(): EplGame[] {
    return this._eplGames;
  }

  public scrape(): void {
    const $ = cheerio.load(this._html);
    try {
      const hrefs = $('a')
        .map(function(i, el) {
          return (
            $(this)
              .text()
              .trim() === 'Premier League'
          );
        })
        .get();
      console.log(hrefs);
    } catch (err) {
      logger.log({
        level: 'warn',
        message: err,
      });
      throw err;
    }
  }
}
