import { spawn } from 'child_process'
import express from 'express'

const PORT = process.env.PORT || 8080
const CMD_DIR = process.env.CMD_DIR

if (!PORT || !CMD_DIR) {
  throw new Error('Forgot to initialize some variables')
}

const app = express()

app.get('/', (_, res) => {
  res.send('webhook server')
})

app.post('/push', express.json(), (req, res) => {
  res.sendStatus(200)

  if (!req.body?.repository.full_name || !req.body?.pusher) return

  const cmd = spawn('git', ['pull', 'origin', 'main'], {
    cwd: CMD_DIR,
  })
  cmd.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })
  cmd.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })
  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
