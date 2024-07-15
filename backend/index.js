// import express from 'express'; 
// import dotenv from 'dotenv';
// import pool from './config/db.js';
// import cors from 'cors';
// dotenv.config();

// const app = express()
// app.use(cors({
//     origin: 'http://localhost:5173'
// }))

// pool.getConnection((err, conn) => 
// {
// if (err) throw err;
// });

// app.get('/outfits', (req, res) => {
//     const sql = 'SELECT img FROM outfits';
//     pool.query(sql, (err, results) => {
//         if (err) {
//             res.status(500).send('Database query failed');
//             throw err;
//         }
//         res.json(results);
//     });
// });

// app.get('/outfits/:index', (req, res) => {
//     const { index } = req.params;
//     const sql = 'SELECT img FROM outfits WHERE `index` = ?';
//     pool.query(sql, [index], (err, results) => {
//         if (err) {
//             res.status(500).send('Database query failed');
//             throw err;
//         }
//         if (results.length === 0) {
//             res.status(404).send('Outfit not found');
//         } else {
//             res.json(results[0]);
//         }
//     });
// });

// app.listen(5001, () =>
//     {
//         console.log('Server started at  http://localhost:5001')
    
//     })
    
//     export default app;