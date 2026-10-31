import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'author'

const roleOf = (req: PayloadRequest): Role | null =>
  ((req.user as { role?: Role } | null)?.role as Role) ?? null

export const isAdmin: Access = ({ req }) => roleOf(req) === 'admin'
export const isAdminField: FieldAccess = ({ req }) => roleOf(req) === 'admin'
export const isEditorOrAdmin: Access = ({ req }) => ['admin', 'editor'].includes(roleOf(req) ?? '')
export const isStaff: Access = ({ req }) => Boolean(req.user)

/**
 * Публичное чтение: гости видят только опубликованное.
 * Сотрудники редакции видят всё, включая черновики.
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

export const anyone: Access = () => true
export const nobody: Access = () => false
