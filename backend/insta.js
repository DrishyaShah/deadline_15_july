import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import pool from './config/db.js';
import cors from 'cors';
import axios from 'axios';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}))

pool.getConnection((err, conn) => 
{
if (err) throw err;
});

const clientId = '1013257733143791'; // Replace with your actual client ID
const clientSecret = '187f5e04b8724218a54af4fc10055553'; // Replace with your actual client secret
const redirectUri = 'http://localhost:5001/auth/instagram/callback'; // Replace with your actual redirect URI
const user_id="17841468108461063"
const page_id="345383718665007" 
let accessToken=null;
const hashtag = '#myntrafandomlook';
// Serve the HTML page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            width:350px;
            text-align: center;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333333;
            margin-bottom: 20px;
            text-align:center;
          }
            .input-container {
        margin-bottom: 15px;
        text-align: left;
      }
      .input-container label {
        display: block;
        margin-bottom: 5px;
        color: #333333;
      }
      .input-container input {
        width: calc(100% - 22px);
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .or-divider {
        margin: 20px 0;
        font-weight: bold;
        color: #333333;
      }
          a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #405de6;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }
          a:hover {
            background-color: #3b55c5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Login</h1>
          <div class="input-container">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username">
      </div>
      <div class="input-container">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password">
      </div>
      <div class="or-divider">or</div>
          <a href="/auth/instagram">Login with Instagram</a>
        </div>
      </body>
    </html>
  `);
});

// Redirect to Instagram OAuth
app.get('/auth/instagram', (req, res) => {
  const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=instagram_basic,instagram_manage_insights,pages_read_engagement,pages_show_list`;
  res.redirect(authUrl);
});

// Handle the redirect from Instagram
app.get('/auth/instagram/callback', async (req, res) => {
  console.log('Query parameters:', req.query);
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send('Authorization code not found');
  }

  try {
     accessToken = await getAccessToken(authorizationCode);
     console.log(`Access Token: ${accessToken}`)
     const userDetails = await getUserDetails(accessToken);

     //Save user details to database
     pool.query(
      'INSERT INTO UsersInsta (UserId, UserName) VALUES (?, ?) ON DUPLICATE KEY UPDATE UserName = VALUES(UserName)',
      [userDetails.id, userDetails.name],
      (err, results) => {
        if (err) {
          console.error('Error saving user details:', err);
          return res.status(500).send('Error saving user details');
        }
        console.log('User details saved:', results);
        //res.redirect("https://www.instagram.com/diyashah28292024/");
        //res.redirect("http://localhost:5173");
      }
    );

     // Update swipeorder and tag columns
     pool.query(
      'UPDATE Outfits SET swipeorder = 0, tag = NULL',
      (err, results) => {
        if (err) {
          console.error('Error updating outfits:', err);
          return res.status(500).send('Error updating outfits');
        }
        console.log('Outfits updated:', results);
        
        // Redirect user after successful login and update
        res.redirect("http://localhost:5173");
      }
    );
  } catch (error) {
    res.status(500).send('Error exchanging authorization code for access token');
  }
});

// Function to exchange authorization code for access token
const getAccessToken = async (code) => {
  const response = await fetch(`https://graph.facebook.com/v20.0/oauth/access_token`, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange authorization code for access token');
  }

  const data = await response.json();
  return data.access_token;
};


const getUserDetails = async (accessToken) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/me?fields=id,name&access_token=${accessToken}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user accounts');
      }
      const data = await response.json();
      console.log('User Details:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user accounts:', error.message);
    }
  };

const getUserPosts=async(accessToken)=>{
  try{
    const response=await fetch(`https://graph.facebook.com/${user_id}/media?fields=like_count,caption&access_token=${accessToken}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user posts');
    }
    const data = await response.json();
      console.log('User Posts:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching user posts:', error.message);
      return null;
    }
  };
  const findPostByHashtag = (posts, hashtag) => {
    if (!Array.isArray(posts)) {
      console.error('Expected posts to be an array, got:', typeof posts);
      return [];
    }
    return posts.filter(post => post.caption && post.caption.includes(hashtag));
  };

  
  const calculatePoints = (likeCount) => {
    // Define your point calculation logic here. For example, 1 like = 1 point.
    return likeCount*10;
  };

  app.get('/get-likes', async (req, res) => {
    try {
      const userDetails = await getUserDetails(accessToken);
      const posts = await getUserPosts(accessToken);
      const filteredPosts = findPostByHashtag(posts, hashtag);
      console.log(filteredPosts.length)
      if (filteredPosts.length > 0) {
        const totalLikes = filteredPosts.reduce((sum, post) => sum + post.like_count, 0);
        const points = calculatePoints(totalLikes);

        //Update user points in database
        pool.query(
          'UPDATE UsersInsta SET points = ? WHERE UserId= ?',
          [points, userDetails.id],
          (err, results) => {
            if (err) {
              console.error('Error updating points:', err);
              return res.status(500).json({ message: 'Error updating points', error: err.message });
            }
            console.log('Points updated:', results);
            res.json({ hashtag, totalLikes, points });
          }
        );
      } else {
        res.status(404).json({ message: `No post found with hashtag ${hashtag}.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user posts', error: error.message });
    }
  });

  // Add this endpoint in your backend
app.get('/userpoints/:username', (req, res) => {
  const username = req.params.username;
  pool.query('SELECT points FROM UsersInsta WHERE UserName = ?', [username], (err, results) => {
    if (err) {
      console.error('Error fetching user points:', err);
      return res.status(500).send('Error fetching user points');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json({ points: results[0].points });
  });
});

  app.get('/userdetails', async (req, res) => {
    getUserDetails(accessToken);
  });

  app.get('/userpost',async(req,res)=>{
    getUserPosts(accessToken);
  })

  app.post('/outfits', async (req, res) => {
    const { isToggleOn } = req.body;
    console.log('Received isToggleOn:', isToggleOn);
    try {
      let query;
      if (isToggleOn) {
        query = `SELECT SrNo, name, img, tag, tagimg FROM outfits WHERE swipeorder=1`;
      } else {
        query = `SELECT SrNo, name, img FROM outfits WHERE swipeorder = 0`;
      }
      
      pool.query(query, (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send('Database query failed');
         return;
        }
  
        if (results.length > 0) {
          
          const randomItem = results[Math.floor(Math.random() * results.length)];
          console.log(randomItem);
          res.json(randomItem);

          
          // else
          // {
          // const randomItem = results[0];
          // console.log(randomItem);
          // res.json(randomItem);
          // }
          
        } else {
          res.json(null);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
     
// app.get('/outfits', (req, res) => {
//     const sql = 'SELECT img, name, SrNo FROM outfits';
//     pool.query(sql, (err, results) => {
//         if (err) {
//             res.status(500).send('Database query failed');
//             throw err;
//         }
//         res.json(results);
//     });
// });

app.get('/outfits/:index', (req, res) => {
    const { index } = req.params;
    const sql = 'SELECT img, name, SrNo FROM outfits WHERE `SrNo` = ?';
    pool.query(sql, [index], (err, results) => {
        if (err) {
            res.status(500).send('Database query failed');
            throw err;
        }
        if (results.length === 0) {
            res.status(404).send('Outfit not found');
        } else {
            res.json(results[0]);
        }
    });
});

// interaction with flask api
app.post('/get-recommendations', async (req, res) => {
  const { item } = req.body;
  try {
      const response = await axios.post('http://localhost:5000/recommend', { item });
      res.json(response.data);

  } catch (error) {
      res.status(500).send('Error getting recommendations');
  }
});

app.post('/update-swipeorder', (req, res) => {
  const { SrNo, swipeorder } = req.body;

  const query = 'UPDATE outfits SET swipeorder = ? WHERE SrNo IN (?)';
  pool.query(query, [swipeorder, SrNo], (err, result) => {
    if (err) {
      res.status(500).send('Error updating swipe order');
      return;
    }
    res.send('Swipe orders updated successfully');
  });
});

app.post('/update-swipeorder-tag', (req, res) => {
  const { SrNo, swipeorder, tag ,tagimg} = req.body;

  const query = 'UPDATE outfits SET swipeorder = ?, tag = ?,tagimg=? WHERE SrNo IN (?)';
  pool.query(query, [swipeorder, tag, tagimg, SrNo], (err, result) => {
    if (err) {
      res.status(500).send('Error updating swipe order and tag');
      return;
    }
    res.send('Swipe orders and tags updated successfully');
  });
});


app.get('/fandomoutfits', (req, res) => {
    pool.query('SELECT * FROM FandomOutfit ORDER BY uploaddate DESC', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});
app.listen(5001, () => {
  console.log('Server running on port 5001');
});

