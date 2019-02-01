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
import {exit} from 'shelljs';
const appRoot = require('app-root-path');

/**
 * EplLeagueScraper will download all EPL data into csvs.
 *
 * @export
 * @class EplLeagueScraper
 * @implements {LeagueScraperInterface}
 */
export default class EplLeagueScraper implements LeagueScraperInterface {
  /**
   * _html is html page content will be passed in.
   *
   * @private
   * @type {string}
   * @memberof EplLeagueScraper
   */
  private _html: string;

  /**
   * _hrefs is all the links which represent csvs.
   *
   * @private
   * @type {string[]}
   * @memberof EplLeagueScraper
   */
  private _hrefs: string[];

  /**
   * _downloadDir specify where csvs will be stored.
   *
   * @private
   * @type {string}
   * @memberof EplLeagueScraper
   */
  private _downloadDir: string;

  /**
   * _baseUrl specify the domain/homepage url, since hrefs got back
   * are relative ones.
   *
   * @private
   * @type {string}
   * @memberof EplLeagueScraper
   */
  private _baseUrl: string;

  /**
   * Creates an instance of EplLeagueScraper.
   *
   * @param {string} html
   * @param {string} baseUrl
   * @memberof EplLeagueScraper
   */
  constructor(html: string, baseUrl: string) {
    if (validator.isEmpty(html)) {
      throw new Error(`empty html : ${html}`);
    }

    if (!validator.isURL(baseUrl)) {
      throw new Error(`invalid base url : ${baseUrl}`);
    }

    const dir = process.env.UKFOOTBALL_CSV_DIR;
    if (!dir) {
      throw new Error('UKFOOTBALL_CSV_DIR not set');
    }

    this._html = html;
    this._downloadDir = appRoot + dir + 'epl/' + moment().format('YYYY-MM-DD');

    if (!fs.existsSync(this._downloadDir)) {
      fs.mkdirSync(this._downloadDir);
    }
    this._baseUrl = baseUrl;
  }

  /**
   * hrefs is a getter for hrefs.
   *
   * @readonly
   * @type {string[]}
   * @memberof EplLeagueScraper
   */
  get hrefs(): string[] {
    return this._hrefs;
  }

  /**
   * scrape is the main function which will download all csvs.
   *
   * @memberof EplLeagueScraper
   */
  public async scrape() {
    this.generateDownloadLinks();
    await this.downloadFiles();
  }

  /**
   * generateDownloadLinks read html content and extract all hrefs which
   * contain csvs.
   *
   * @private
   * @memberof EplLeagueScraper
   */
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

  /**
   * downloadFiles will download csvs into specifie dir.
   *
   * @private
   * @returns
   * @memberof EplLeagueScraper
   */
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
      }, BlueBirdPromise.resolve())
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
