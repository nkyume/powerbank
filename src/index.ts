import { config } from 'dotenv'

import { app } from './app'
import { hello } from './helloMessage'
import { dbDisconnect } from './repositories'
import { SETTINGS } from './settings'

config()
hello()

app.listen(SETTINGS.PORT, () => {
  console.log(`Server running on http://localhost:${SETTINGS.PORT}/.`)
})

process.on('exit', async () => {
  await dbDisconnect()
})
