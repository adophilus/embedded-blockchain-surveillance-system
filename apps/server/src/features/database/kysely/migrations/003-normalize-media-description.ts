import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add columns for normalized media description in surveillance_events
  await db.schema
    .alterTable('surveillance_events')
    .addColumn('media_source', 'text')
    .addColumn('media_id', 'text')
    .addColumn('media_url', 'text')
    .execute()

  // Update existing rows to populate the new columns
  await db.updateTable('surveillance_events')
    .set({
      media_source: 'ipfs',
      media_id: 'ipfs_cid',
      media_url: 'ipfs_url'
    })
    .where('ipfs_cid', 'is not', null)
    .execute()

  // Remove the old columns
  await db.schema
    .alterTable('surveillance_events')
    .dropColumn('ipfs_cid')
    .dropColumn('ipfs_url')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Add back the old columns
  await db.schema
    .alterTable('surveillance_events')
    .addColumn('ipfs_cid', 'text')
    .addColumn('ipfs_url', 'text')
    .execute()

  // Update existing rows to populate the old columns
  await db.updateTable('surveillance_events')
    .set({
      ipfs_cid: 'media_id',
      ipfs_url: 'media_url'
    })
    .where('media_source', '=', 'ipfs')
    .execute()

  // Remove the new columns
  await db.schema
    .alterTable('surveillance_events')
    .dropColumn('media_source')
    .dropColumn('media_id')
    .dropColumn('media_url')
    .execute()
}