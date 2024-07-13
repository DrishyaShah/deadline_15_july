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
const hashtag = '#peace';
// Serve the HTML page
app.get('/post', (req, res) => {
  res.send(`
    <html> 
      <body>
        <h1>Instagram OAuth Login</h1>
        <a href="/auth/instagram">Login with Instagram</a>
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
     res.redirect("https://www.instagram.com/");
    //res.json({ accessToken });
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


// const getUserAccounts = async (accessToken) => {
//     try {
//       const response = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${accessToken}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch user accounts');
//       }
//       const data = await response.json();
//       console.log('User Accounts:', data);
//       return data;
//     } catch (error) {
//       console.error('Error fetching user accounts:', error.message);
//     }
//   };

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
      return null;
    }
    return posts.find(post => post.caption && post.caption.includes(hashtag));
  };

  
  const calculatePoints = (likeCount) => {
    // Define your point calculation logic here. For example, 1 like = 1 point.
    return likeCount*10;
  };

  app.get('/get-likes', async (req, res) => {
    try {
      const posts = await getUserPosts(accessToken);
      const post = findPostByHashtag(posts, hashtag);
      if (post) {
        const points = calculatePoints(post.like_count);
        res.json({ hashtag, likeCount: post.like_count, points });
      } else {
        res.status(404).json({ message: `No post found with hashtag ${hashtag}.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user posts', error: error.message });
    }
  });

  app.get('/useraccount', async (req, res) => {
    getUserAccounts(accessToken);
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
        query = `SELECT SrNo, name, img FROM outfits WHERE swipeorder=1`;
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

