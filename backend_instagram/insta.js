import express from 'express';
import fetch from 'node-fetch';
const app = express();

const clientId = '1013257733143791'; // Replace with your actual client ID
const clientSecret = '187f5e04b8724218a54af4fc10055553'; // Replace with your actual client secret
const redirectUri = 'http://localhost:5001/auth/instagram/callback'; // Replace with your actual redirect URI
const user_id="17841468108461063"
const page_id="345383718665007" 
let accessToken=null;
const hashtag = '#peace';
// Serve the HTML page
app.get('/', (req, res) => {
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


const getUserAccounts = async (accessToken) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/me/accounts?access_token=${accessToken}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user accounts');
      }
      const data = await response.json();
      console.log('User Accounts:', data);
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

app.listen(5001, () => {
  console.log('Server running on port 5001');
});

