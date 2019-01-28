import {EplGame} from './eplGame';
import * as cheerio from 'cheerio';
import * as validator from 'validator';
import logger from '../../configs/winston';
import * as _ from 'lodash';
import * as download from 'download';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as slug from 'slug';
import * as BlueBirdPromise from 'bluebird';
import LeagueScraperInterface from './leagueScraperInterface';
const appRoot = require('app-root-path');

export default class EplLeagueScraper implements LeagueScraperInterface {
  private _html: string;

  private _eplGames: EplGame[];

  private _hrefs: string[];

  private _downloadDir: string;

  private _baseUrl: string;

  constructor(html: string, baseUrl: string) {
    if (validator.isEmpty(html)) {
      throw new Error(`empty html : ${html}`);
    }

    if (!validator.isURL(baseUrl)) {
      throw new Error(`invalid base url : ${baseUrl}`);
    }

    this._html = html;
    this._eplGames = [];
    this._downloadDir =
      appRoot + '/csvs/ukfootball/epl/' + moment().format('YYYY-MM-DD');
    if (!fs.existsSync(this._downloadDir)) {
      fs.mkdirSync(this._downloadDir);
    }
    this._baseUrl = baseUrl;
  }

  get eplGames(): EplGame[] {
    return this._eplGames;
  }

  get hrefs(): string[] {
    return this._hrefs;
  }

  public async scrape() {
    this.generateDownloadLinks();
    await this.downloadFiles();
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
          if (text === 'Premier League' && _.endsWith(href, '.csv')) {
            return $(this).attr('href');
          }
        })
        .get();
      logger.log({
        level: 'debug',
        message: {hrefs: this._hrefs, length: this._hrefs.length},
      });
    } catch (err) {
      logger.log({
        level: 'warn',
        message: err,
      });
      throw err;
    }
  }

  private async downloadFiles() {
    fs.readdir(this._downloadDir, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(this._downloadDir, file), e => {
          if (e) throw e;
        });
      }
    });

    if (this._hrefs.length === 0) {
      logger.log({
        level: 'warn',
        message: 'empty hrefs, unable to download any files',
      });
      return;
    }

    this._hrefs
      .reduce((promise, href) => {
        const fullDownloadUrl = `${this._baseUrl
          .trim()
          .replace(/\/$/, '')
          .trim()}/${href}`;
        const rand = Math.floor(Math.random() * 8000) + 2000;
        return BlueBirdPromise.delay(rand).then(() => {
          return download(fullDownloadUrl)
            .then(data => {
              fs.writeFileSync(`${this._downloadDir}/${slug(href)}.csv`, data);
            })
            .catch(e => {
              logger.log({
                level: 'error',
                message: 'got err while downloading ' + e,
              });
            });
        });
      }, BlueBirdPromise.delay(5000).then(() => Promise.resolve()))
      .then(() => {
        logger.log({
          level: 'info',
          message: 'finished all downloads ',
        });
      })
      .catch((err: Error) => {
        logger.log({
          level: 'error',
          message: 'finished all, got error ' + err,
        });
      });
  }
}
