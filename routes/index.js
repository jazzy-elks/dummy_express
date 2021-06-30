const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/*
Note that this route should not be available unless someone
requests with a valid key for security reasons.
*/

router.get('/ruleset', function (req, res, next) {
  // here we need to be able to get the updated ruleset
  // when the SDK demands. this could be from a cache.

  // for now, there's a static ruleset.json file
  // in the lib dir.

  res.sendFile(path.join(__dirname, '../lib', '/ruleset.json'));
});

module.exports = router;

/*
Tested above route in postman:
{
  "flags": {
    "1234": {
      "toggledOn": true,
      "title": "flag 1",
      "createdOn": "2021-06-28"
    },
    "5678": {
      "toggledOn": false,
      "title": "flag 2",
      "createdOn": "2021-06-29"
    },
    "9101112": {
      "toggledOn": false,
      "title": "flag 3",
      "createdOn": "2021-06-30"
    }
  }
}
*/
