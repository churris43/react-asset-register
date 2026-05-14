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
    it('creates a role with staff_name', async () => {
      const result = await createRole({ role_name: 'Engineer', staff_name: 'Alice' })
      expect(result.role_name).toBe('Engineer')
      expect(result.staff_name).toBe('Alice')
    })

    it('creates a role without staff_name', async () => {
      const result = await createRole({ role_name: 'Engineer', staff_name: null })
      expect(result.staff_name).toBeNull()
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
      const created = await prisma.role.create({ data: { role_name: 'Old', staff_name: 'Alice' } })
      const result = await updateRole(created.id, { role_name: 'New', staff_name: 'Bob' })
      expect(result?.role_name).toBe('New')
      expect(result?.staff_name).toBe('Bob')
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