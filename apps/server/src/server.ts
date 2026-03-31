import { env } from '@repo/env';
import express from 'express'

const app = express();

app.get('/', (req, res) => {
    res.send('server running...')
})

app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`);
})
