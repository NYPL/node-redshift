import express from 'express';
import axios from 'axios';
import redShift from 'redshift-sql';
import {
  each as _each,
} from 'underscore';
import appConfig from '../../../appConfig';

const router = express.Router();

function MainApp(req, res, next) {
  const config = appConfig.redshift;
  const rssql = redShift(config);
  const query = ``;

  rssql(query, (err, result) => {
    if (err) {
      return console.error(err);
    }
    const redShiftRows = result.rows;

    axios
      .get('http://refinery.nypl.org/api/nypl/ndo/v0.1/locations/libraries')
      .then(libraries => {
        const libraryData = libraries.data.data;
        const data = [];
        let nameToUse;
        let librarySymbol;
        let address;

        _each(libraryData, lib => {
          _each(redShiftRows, row => {
            const name = row['13eb3a51-c359-4f94-a8c6-331a4015ca9a.location_name'] || '';

            if (lib.attributes['full-name'].indexOf(name.replace(/Branch|Building|,/, '')) !== -1) {
              // console.log(lib.attributes['full-name'], name);
              nameToUse = lib.attributes['short-name'];
              librarySymbol = lib.attributes.symbol;
              address = lib.attributes.address;

              data.push({
                name: nameToUse,
                icode1Sum: row['61f90a21-9b52-4947-b5b4-70d03c91f321.icode1_sum'],
                id: librarySymbol,
                address,
              });
            }
          });
        });

        // do stuff
        res.locals.data = {
          Store: {
            data,
          },
        };

        return next();
      });
  });
}

router
  .route('/')
  .get(MainApp);

export default router;
