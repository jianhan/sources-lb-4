import {EplGame} from './eplGame';
import * as cheerio from 'cheerio';
import * as validator from 'validator';
import logger from '../../configs/winston';
import * as _ from 'lodash';

export default class EplLeagueScraper {
  private _html: string;

  private _eplGames: EplGame[];

  private _hrefs: string[];

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

  get hrefs(): string[] {
    return this._hrefs;
  }

  public scrape(): void {
    this.generateDownloadLinks();
    this.downloadFiles();
  }

  private generateDownloadLinks(): void {
    const $ = cheerio.load(this._html);
    try {
      this._hrefs = $('a')
        .map(function(i, el) {
          const text = $(this)
            .text()
            .trim();
          const href = $(this).attr('href');
          console.log(text);
          if (text === 'Premier League' && _.endsWith(href, '.csv')) {
            return $(this).attr('href');
          }
        })
        .get();
      logger.log({
        level: 'debug',
        message: {hrefs: this._hrefs},
      });
    } catch (err) {
      logger.log({
        level: 'warn',
        message: err,
      });
      throw err;
    }
  }

  private downloadFiles(): void {
    if (this._hrefs.length === 0) {
      logger.log({
        level: 'warn',
        message: 'empty hrefs, unable to download any files',
      });
      return;
    }
  }
}
