import * as cheerio from 'cheerio';
import * as validator from 'validator';
import logger from '../../configs/winston';
import * as _ from 'lodash';
import * as download from 'download';
import * as fs from 'fs';
import * as BlueBirdPromise from 'bluebird';
import LeagueScraperInterface from './leagueScraperInterface';

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
    this._downloadDir = appRoot + dir + 'epl';

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
        message: {
          hrefs: this._hrefs,
          length: this._hrefs.length,
        },
      });
    } catch (err) {
      logger.log({level: 'warn', message: err});
      throw err;
    }
  }

  /**
   * downloadFiles will download csvs into specifie dir, only download the files that
   * are not already exists.
   *
   * @private
   * @returns
   * @memberof EplLeagueScraper
   */
  private async downloadFiles() {
    const fileHrefs: string[] = [];
    const files = fs.readdirSync(this._downloadDir);

    // check if file already been downloaded
    for (const href of this._hrefs) {
      let notExist: boolean = true;

      for (const file of files) {
        const hrefArr = href.split('/');
        const hrefFileName = hrefArr[hrefArr.length - 2] + '.csv';
        if (hrefFileName === file) {
          notExist = false;
          break;
        }
      }

      if (notExist) {
        fileHrefs.push(href);
      }
    }

    if (fileHrefs.length === 0) {
      logger.log({
        level: 'warn',
        message: 'empty hrefs, unable to download any files',
      });
      return;
    }

    const promises: BlueBirdPromise<Buffer>[] = [];
    fileHrefs.forEach(href => {
      const rand = Math.floor(Math.random() * 8000) + 2000;
      const fullDownloadUrl = `${this._baseUrl
        .trim()
        .replace(/\/$/, '')
        .trim()}/${href}`;
      const fileNameArr = href.split('/');
      promises.push(
        BlueBirdPromise.delay(rand).then(() =>
          download(fullDownloadUrl, this._downloadDir, {
            filename: `${fileNameArr[fileNameArr.length - 2]}.csv`,
          }),
        ),
      );
    });

    return Promise.all(promises);
  }
}
