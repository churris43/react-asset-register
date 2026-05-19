import { describe, it, expect } from 'vitest'
import { prisma } from '../../lib/prisma'
import {
  getRolesById,
  createRole,
  updateRole,
  deleteRole,
  getPaginatedRoles,
} from '../../services/roleServices'

describe('roleServices', () => {
  describe('createRole', () => {
    it('creates a role', async () => {
      const result = await createRole({ role_name: 'Engineer' })
      expect(result.role_name).toBe('Engineer')
    })
  })

  describe('getRolesById', () => {
    it('returns the role when found', async () => {
      const created = await prisma.role.create({ data: { role_name: 'Manager' } })
      expect((await getRolesById(created.id))?.role_name).toBe('Manager')
    })

    it('returns null when not found', async () => {
      expect(await getRolesById(99999)).toBeNull()
    })
  })

  describe('updateRole', () => {
    it('updates role fields', async () => {
      const created = await prisma.role.create({ data: { role_name: 'Old' } })
      const result = await updateRole(created.id, { role_name: 'New' })
      expect(result?.role_name).toBe('New')
    })
  })

  describe('deleteRole', () => {
    it('deletes the record and returns it', async () => {
      const created = await prisma.role.create({ data: { role_name: 'To Delete' } })
      const result = await deleteRole(created.id)
      expect(result.id).toBe(created.id)
      expect(await prisma.role.findUnique({ where: { id: created.id } })).toBeNull()
    })
  })

  describe('getPaginatedRoles', () => {
    it('returns the correct page and total', async () => {
      await prisma.role.createMany({
        data: [{ role_name: 'Admin' }, { role_name: 'Manager' }, { role_name: 'Viewer' }],
      })
      const { data, total } = await getPaginatedRoles(1, 2, 'role_name', 'asc')
      expect(total).toBe(3)
      expect(data).toHaveLength(2)
      expect(data[0].role_name).toBe('Admin')
    })
  })
})