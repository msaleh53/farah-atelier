import type { CollectionConfig } from 'payload'

/**
 * Admin users. `auth: true` gives Payload its login/session machinery; the
 * first user is created on the first visit to `/admin`. Add Farah + Maya here.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
