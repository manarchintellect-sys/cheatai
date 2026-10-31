import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Пользователь', plural: 'Пользователи' },
  admin: { useAsTitle: 'email', group: 'Администрирование', defaultColumns: ['email', 'name', 'role'] },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  access: {
    // свои данные видит каждый, всех — только админ
    read: ({ req }) => {
      if (!req.user) return false
      if ((req.user as { role?: string }).role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    create: isAdmin,
    delete: isAdmin,
    update: ({ req }) => {
      if (!req.user) return false
      if ((req.user as { role?: string }).role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      saveToJWT: true,
      access: { update: isAdminField, create: isAdminField },
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Редактор (публикует)', value: 'editor' },
        { label: 'Автор (только черновики)', value: 'author' },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Публичный профиль автора',
    },
  ],
}
