# SchedulesDirect Node Module

This is an unofficial [SchedulesDirect](http://schedulesdirect.org/)'s [API](https://github.com/SchedulesDirect/JSON-Service/wiki/API-20141201) Node client.

Test live at https://codesandbox.io/s/github/maddog986/node-schedulesdirect

## Installation

```
npm install node-schedulesdirect
```

## Usage

First you need to instantiate it.

```javascript
const SchedulesDirect = require('node-schedulesdirect');

const sdClient = new SchedulesDirect({
  username: 'your_username',
  password: 'your_password'
  //token: 'YOUR TOKEN' //OR you can just pass in a VALID token (username/password not required)
});
```

Using the created client, call the methods you need, example:

```javascript
//get status, also includes lineups on your account
sdClient
  .get('status')
  .then(response => {
    console.log('systemStatus::', response.systemStatus);

    //look through the lineups
    response.lineups.forEach(async lineup => {
      //get the entire lineup that consits of the channel maps and stations
      sdClient.get(`lineups/${lineup.lineup}`).then(lineupData => {
        console.log(lineup.name);

        //console.log('lineupData', lineupData);
        console.log('\ttotal maps', lineupData.map.length);
        console.log('\ttotal stations', lineupData.stations.length);
      });
    });
  })
  .catch(err => console.error(err));
```

## License

[See License](https://github.com/maddog986/node-schedulesdirect/blob/master/LICENSE)

## Release Notes

[See Changelog](https://github.com/maddog986/node-schedulesdirect/blob/master/CHANGELOG.md)
