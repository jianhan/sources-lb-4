import {EplGame} from './eplGame';
import * as cheerio from 'cheerio';
import * as validator from 'validator';
import logger from '../../configs/winston';
import * as _ from 'lodash';
import * as download from 'download';
import * as moment from 'moment';
import * as fs from 'fs';
const appRoot = require('app-root-path');

export default class EplLeagueScraper {
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

  private async downloadFiles() {
    if (this._hrefs.length === 0) {
      logger.log({
        level: 'warn',
        message: 'empty hrefs, unable to download any files',
      });
      return;
    }
    this._hrefs.forEach(async (href: string) => {
      const fullDownloadUrl = `${this._baseUrl
        .trim()
        .replace(/\/$/, '')
        .trim()}/${href}`;
      await download(fullDownloadUrl)
        .then(data => {
          console.log('files downloaded! ' + this._downloadDir);
          fs.writeFileSync(`${this._downloadDir}/${moment().unix()}.csv`, data);
        })
        .catch(err => {
          logger.log({
            level: 'error',
            message: 'file downloaded error ' + err,
          });
        });
    });

    // const result = await BlueBirdPromise.all(
    //   fullDownloadUrls.map(x =>
    //     BlueBirdPromise.delay(3000).then(() => {
    //       console.log('start downloading');
    //       return download(x);
    //     }),
    //   ),
    // )
    //   .then(data => {
    //     console.log('files downloaded! ' + this._downloadDir);
    //     fs.writeFileSync(`${this._downloadDir}/${moment().unix()}.csv`, data);
    //   })
    //   .catch(err => {
    //     logger.log({
    //       level: 'error',
    //       message: 'file downloaded error ' + err,
    //     });
    //   });

    // const result = await Promise.all(
    //   fullDownloadUrls.map(x => download(x)),
    // ).then(data => {
    //   console.log('files downloaded! ' + this._downloadDir);
    //   fs.writeFileSync(`${this._downloadDir}/${moment().unix()}.csv`, data);
    // });

    // return result;
    // const promises: Promise<Buffer>[] = [];
    // this._hrefs.forEach((href: string) => {
    //   const delayedDownload = Promise.delay(1000).then(function() {
    //     return download(
    //       `${this._baseUrl
    //         .trim()
    //         .replace(/\/$/, '')
    //         .trim()}/${href}`,
    //       this._downloadDir,
    //     );
    //   });
    //   promises.push(delayedDownload);
    // });

    // await Promise.all(promises)
    //   .then(() => {
    //     logger.log({
    //       level: 'debug',
    //       message: 'file downloaded',
    //     });
    //   })
    //   .catch(err => {
    //     logger.log({
    //       level: 'error',
    //       message: `error while downlading file: ${err}`,
    //     });
    //     throw err;
    //   });
  }
}
