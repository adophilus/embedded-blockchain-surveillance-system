import type { ColumnType } from 'kysely'

type MediaDescription = {
  source: 'ipfs'
  id: string
  url: string
}

type TimestampModel = {
  created_at: ColumnType<string, never, never>
  updated_at: ColumnType<string | null, never, string>
}

type UsersTable = TimestampModel & {
  id: string
  full_name: string
  email: string
  password_hash: string
  role: 'ADMIN' | 'OFFICIAL' | 'SYSTEM'
}

type TokensTable = TimestampModel & {
  id: string
  user_id: string
  purpose: string
  token: string
  expires_at: string
  used_at: string | null
}

type SurveillanceSessionsTable = TimestampModel & {
  id: string
  title: string
  description: string | null
  start_timestamp: string
  end_timestamp: string
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED'
}

type SurveillanceEventsTable = TimestampModel & {
  id: string
  session_id: string
  device_id: string
  timestamp: string
  detected: boolean
  ipfs_cid: string | null
  ipfs_url: string | null
}

type CriminalsTable = TimestampModel & {
  id: string
  name: string
  aliases: string
  offense: string | null
  mugshot: MediaDescription | null
}

type IoTDevicesTable = TimestampModel & {
  id: string
  device_code: string
  location: string
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  ip_address: string | null
  last_heartbeat: string | null
}

type FilesTable = TimestampModel & {
  id: string
  original_name: string
  file_data: Buffer
  mime_type: string
}

export type KyselyDatabaseTables = {
  users: UsersTable
  tokens: TokensTable
  surveillance_sessions: SurveillanceSessionsTable
  surveillance_events: SurveillanceEventsTable
  criminals: CriminalsTable
  iot_devices: IoTDevicesTable
  files: FilesTable
}
