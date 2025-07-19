import { glob } from 'node:fs/promises'

const files = glob(['*.svg', '*.png'])

for await (const file of files) {
  const url = `https://purge.jsdelivr.net/gh/sxzz/sponsors/${file}`
  const resp: any = await fetch(url).then((res) => res.json())
  if (resp.status !== 'finished') {
    console.error(`Failed to purge: ${file} - ${resp}`)
  } else {
    console.log(`Purged: ${file}`)
  }
}
