import { Timestamp } from 'firebase/firestore'

export type HeistFinalStatus = 'success' | 'failure'

export interface Heist {
  id: string
  title: string
  description: string
  createdBy: string
  createdByCodename: string
  assignedTo: string
  assignedToCodename: string
  deadline: Timestamp
  finalStatus: HeistFinalStatus | null
  createdAt: Timestamp
}
