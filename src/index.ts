import { version } from '../package.json'
import { app } from './app'
import { hello } from './helloMessage'
import { db } from './repositories'
import { SETTINGS } from './settings'

hello()

app.listen(SETTINGS.PORT, () => {
  console.log(`Version: ${version}`)
  console.log(`Server running on http://localhost:${SETTINGS.PORT}/.`)
})

process.on('exit', async () => {
  await db.disconnect()
})
