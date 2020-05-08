const client = require('../lib/client');
// import our seed data:
const songs = require('./songs.js');
const usersData = require('./users.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      songs.map(song => {
        return client.query(`
                    INSERT INTO songs (name, artist, length, user_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [song.name, song.artist, song.length, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
