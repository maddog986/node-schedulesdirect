const SchedulesDirect = require('../schedulesdirect.js');

if (!process.env.USERNAME || !process.env.PASSWORD) {
  throw new Error('SETUP YOUR ENVIRONMENT VARIABLES');
}

const sdClient = new SchedulesDirect({
  username: process.env.USERNAME,
  password: process.env.PASSWORD
  //token: 'YOUR TOKEN' //OR you can just pass in a VALID token (username/password not required)
});

//get status, also includes lineups on your account
sdClient
  .get('status')
  .then(response => {
    console.log('systemStatus:', response.systemStatus);

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
