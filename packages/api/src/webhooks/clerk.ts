import { verifyWebhook } from '@clerk/express/webhooks'
import { db } from '@overbook/db'
import type { Request, Response } from 'express'

export async function clerkWebhookHandler(req: Request, res: Response) {
  try {
    const evt = await verifyWebhook(req)

    switch (evt.type) {
      case 'user.created':
      case 'user.updated': {
        const { id, email_addresses, first_name, last_name } = evt.data
        const email = email_addresses[0]?.email_address ?? ''
        const name = [first_name, last_name].filter(Boolean).join(' ') || null
        await db.user.upsert({
          where: { clerkId: id },
          update: { email, name },
          create: { clerkId: id, email, name },
        })
        break
      }

      case 'user.deleted': {
        const { id } = evt.data
        if (id) {
          await db.user.delete({ where: { clerkId: id } }).catch(() => {})
        }
        break
      }

      case 'organization.created':
      case 'organization.updated': {
        const { id, name, slug } = evt.data
        await db.organization.upsert({
          where: { clerkOrgId: id },
          update: { name, slug: slug ?? id },
          create: { clerkOrgId: id, name, slug: slug ?? id },
        })
        break
      }

      case 'organizationMembership.created': {
        const { organization, public_user_data, role } = evt.data
        const orgRecord = await db.organization.findUnique({
          where: { clerkOrgId: organization.id },
        })
        const userRecord = await db.user.findUnique({
          where: { clerkId: public_user_data.user_id },
        })
        if (orgRecord && userRecord) {
          await db.membership.upsert({
            where: {
              organizationId_userId: {
                organizationId: orgRecord.id,
                userId: userRecord.id,
              },
            },
            update: { role: mapClerkRole(role) },
            create: {
              organizationId: orgRecord.id,
              userId: userRecord.id,
              role: mapClerkRole(role),
            },
          })
        }
        break
      }

      case 'organizationMembership.deleted': {
        const { organization, public_user_data } = evt.data
        const orgRecord = await db.organization.findUnique({
          where: { clerkOrgId: organization.id },
        })
        const userRecord = await db.user.findUnique({
          where: { clerkId: public_user_data.user_id },
        })
        if (orgRecord && userRecord) {
          await db.membership
            .delete({
              where: {
                organizationId_userId: {
                  organizationId: orgRecord.id,
                  userId: userRecord.id,
                },
              },
            })
            .catch(() => {})
        }
        break
      }
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Clerk webhook failed:', err)
    res.status(400).json({ error: 'Invalid webhook' })
  }
}

function mapClerkRole(clerkRole: string) {
  switch (clerkRole) {
    case 'org:admin':
      return 'OWNER' as const
    default:
      return 'AGENT' as const
  }
}
