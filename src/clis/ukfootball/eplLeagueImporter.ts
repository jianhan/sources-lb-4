import {inject} from '@loopback/context';
import {EplLeagueGameRepository} from '../../repositories/epl-league-game.repository';
import * as fs from 'fs';
import * as parse from 'csv-parse';
import logger from '../../configs/winston';
import {EplLeagueGame} from '../../models/epl-league-game.model';
import {exit} from 'shelljs';
import {resolve} from 'bluebird';
import moment = require('moment');
const appRoot = require('app-root-path');

export default class EplLeagueImporter {
  private _repo: EplLeagueGameRepository;
  private _downloadDir: string;
  public constructor(
    @inject('repositories.EplLeagueGameRepository')
    repo: EplLeagueGameRepository,
  ) {
    this._repo = repo;
    const dir = process.env.UKFOOTBALL_CSV_DIR;
    if (!dir) {
      throw new Error('UKFOOTBALL_CSV_DIR not set');
    }

    this._downloadDir = appRoot + dir + 'epl';
  }

  public import() {
    // fs.readdir(this._downloadDir, (err: Error, csvs: string[]) => {
    //   const csvCombined = csvs.reduce((combinedContent, csv) => {
    //     const fileContent = fs.readFileSync(
    //       this._downloadDir + '/' + csv,
    //       'utf8',
    //     );
    //     return combinedContent + fileContent;
    //   });
    //   console.log(csvCombined);
    // });
    // return false;
    // .then(
    //   function(filenames) {
    //     filenames = filenames.filter(isDataFile);
    //     console.log(filenames);
    //     return Promise.all(filenames.map(getFile));
    //   },
    // );
    const files = fs.readdirSync(this._downloadDir);
    const games: EplLeagueGame[] = [];
    files.forEach(file => {
      const fileContent = fs.readFileSync(
        this._downloadDir + '/' + file,
        'utf8',
      );
      parse(fileContent, {
        trim: true,
        skip_empty_lines: true,
        columns: true,
        relax_column_count: true,
      })
        // Use the readable stream api
        .on('readable', function() {
          let record;
          while ((record = this.read())) {
            const eplLeagueGame = new EplLeagueGame();
            eplLeagueGame.div = record.Div;
            const dateObj: Date = moment(record.Date, [
              'DD/MM/YY',
              'DD/MM/YYYY',
            ]).toDate();
            eplLeagueGame.date = dateObj;
            eplLeagueGame.homeTeam = record.HomeTeam;
            eplLeagueGame.awayTeam = record.AwayTeam;
            eplLeagueGame.fthg = record.FTHG;
            eplLeagueGame.ftag = record.FTAG;
            eplLeagueGame.ftr = record.FTR;
            eplLeagueGame.hthg = record.HTHG;
            eplLeagueGame.htag = record.HTAG;
            eplLeagueGame.htr = record.HTR;

            games.push(eplLeagueGame);
          }
        })
        // When we are done, test that the parsed output matched what expected
        .on('end', () => {
          logger.log({
            level: 'info',
            message: 'finished read: ' + file + ' len ' + games.length,
          });
          console.log(games[0]);
        })
        .on('error', err => {
          logger.log({
            level: 'error',
            message: 'error while reading csv : ' + err.message,
          });
        });
      // fs.createReadStream(this._downloadDir + '/' + file)
      //   .pipe(csv())
      //   .on('data', (data: any) => results.push(data))
      //   .on('end', () => {
      //     console.log(results);
      //     // [
      //     //   { NAME: 'Daffy Duck', AGE: '24' },
      //     //   { NAME: 'Bugs Bunny', AGE: '22' }
      //     // ]
      //   });
    });
  }
}
