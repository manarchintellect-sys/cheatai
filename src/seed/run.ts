import config from '@payload-config'
import { getPayload } from 'payload'
import { seed } from './index'

try {
  await seed(await getPayload({ config }))
  process.exit(0)
} catch (e) {
  console.error(e)
  process.exit(1)
}
