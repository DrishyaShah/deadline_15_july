# About: 
With the rise in so many shopping platforms these days, Gen Z tends to be less loyal to a single shopping platform. With so many choices and decreasing attention spans, it is important for shopping platforms to have unique selling points to attract customers. 
For that, we propose two brand new features
1.) Fashionable Swipe
2.) Fandom Page
# Fashionable Swipe: 

Fashionable Swipe is a tinder-inspired feature wherein users can browse outfits by swiping them left or right, much like they would on a dating site. 
This mechanism mimics browsing through a rack of clothes, creating a touch-and-feel experience.  


The swiping mechanism is developed in Reactjs, the outfits are being fetched from a MySQL database through express framework. When the similarity toggle is off, a random index value is generated and the outfit is fetched, they are fetched one at a time, upon swiping to ensure that overloading is prevented. 

Our recommender system leverages Natural Language Processing (NLP) model ‘Bag of n grams’.
The name of the apparel in the dataset that we used includes various characteristics such as colour, brand, outfit type etc. Using the Bag of n grams model we find text similarity among names of outfits. Reason to use text similarity- We believe that every user has different choices and different reasons to why they right swiped an apparel. A user may have right swiped because he liked the color, or brand, or the prints, or the style(cropped or baggy). By using text similarity, we try to balance out all these fields and present recommendations which is the right balance of similarity and distinctiveness, because no one wants to see the same outfits over and over.

The similar outfit fetching from the database was implemented by having a column called swipe_order in the database. The swipe order of -1 is assigned to outfits already displayed, 0 is for outfits not yet displayed, and 1 is for outfits similar to the user swiped right on. 
We are also fetching the name and img url of the original outfit through which the currently  displayed outfit was recommended when the toggle is on and displaying it.


## Fandom Page: 

The Fandom Page is a collection of merchandise inspired by trending web series, or movies or even viral memes, and beloved characters from across the entertainment spectrum. In order to keep the GenZ community engaged, we encourage users to post a picture of themselves on Instagram using the hashtag #myntrafandomlook. Get rewarded with points for every post you make using the hashtag. Redeem points to avail discounts on the fandom merchandise.

We have used Instagram Graph api to achieve this. First, we created an app on Meta for Developers and using the app id and app secret, we enable users to login through Instagram OAuth. When the user logs in, we receive an authorization code from which we can retrieve the access token and use it to find number of posts and likes of the user as well as find a post by caption. When the user clicks on the post button, they get redirected right to their Instagram account from where they can make the post. The likes are fetched using the access token and the points get calculated based on that. We have created a Users table in our MySQL database where all of this information is stored and is retrieved back in frontend. 
Additionally these points are used to offer personalised discounts to the users on each apparel.


#Dataset
We used the Myntra Fashion Product text dataset from Kaggle and preprocessed it to apply NLP's bag of n grams model. 
Find the link below:
https://www.kaggle.com/datasets/hiteshsuthar101/myntra-fashion-product-dataset










# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
