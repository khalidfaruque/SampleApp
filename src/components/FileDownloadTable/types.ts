export interface FileItem {
  name: string
  device: string
  path: string
  status: 'available' | 'scheduled'
}
