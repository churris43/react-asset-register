import { describe, it, expect } from 'vitest'
import { prisma } from '../../lib/prisma'
import {
  getAssetsById,
  createAsset,
  updateAsset,
  deleteAsset,
  getPaginatedAssets,
} from '../../services/assetServices'

describe('assetServices', () => {
  describe('createAsset', () => {
    it('creates an asset with no relations', async () => {
      const result = await createAsset({ asset_name: 'Laptop', role_id: null, asset_type_id: null })
      expect(result.asset_name).toBe('Laptop')
      expect(result.role_id).toBeNull()
      expect(result.asset_type_id).toBeNull()
    })

    it('creates an asset linked to a role and asset type', async () => {
      const role = await prisma.role.create({ data: { role_name: 'Engineer' } })
      const assetType = await prisma.asset_type.create({ data: { asset_type_name: 'Hardware' } })
      const result = await createAsset({ asset_name: 'Laptop', role_id: role.id, asset_type_id: assetType.id })
      expect(result.role_id).toBe(role.id)
      expect(result.asset_type_id).toBe(assetType.id)
    })
  })

  describe('getAssetsById', () => {
    it('returns the asset when found', async () => {
      const created = await prisma.asset.create({ data: { asset_name: 'Monitor' } })
      expect((await getAssetsById(created.id))?.asset_name).toBe('Monitor')
    })

    it('returns null when not found', async () => {
      expect(await getAssetsById(99999)).toBeNull()
    })
  })

  describe('updateAsset', () => {
    it('updates the asset name', async () => {
      const created = await prisma.asset.create({ data: { asset_name: 'Old Name' } })
      const result = await updateAsset(created.id, { asset_name: 'New Name', role_id: null, asset_type_id: null })
      expect(result.asset_name).toBe('New Name')
    })
  })

  describe('deleteAsset', () => {
    it('deletes the record and returns it', async () => {
      const created = await prisma.asset.create({ data: { asset_name: 'To Delete' } })
      const result = await deleteAsset(created.id)
      expect(result.id).toBe(created.id)
      expect(await prisma.asset.findUnique({ where: { id: created.id } })).toBeNull()
    })
  })

  describe('getPaginatedAssets', () => {
    it('returns the correct page and total', async () => {
      await prisma.asset.createMany({
        data: [{ asset_name: 'Asset A' }, { asset_name: 'Asset B' }, { asset_name: 'Asset C' }],
      })
      const { data, total } = await getPaginatedAssets(1, 2, 'asset_name', 'asc')
      expect(total).toBe(3)
      expect(data).toHaveLength(2)
      expect(data[0].asset_name).toBe('Asset A')
    })

    it('returns the second page', async () => {
      await prisma.asset.createMany({
        data: [{ asset_name: 'Asset A' }, { asset_name: 'Asset B' }, { asset_name: 'Asset C' }],
      })
      const { data } = await getPaginatedAssets(2, 2, 'asset_name', 'asc')
      expect(data).toHaveLength(1)
      expect(data[0].asset_name).toBe('Asset C')
    })

    it('sorts by nested relation field role_name', async () => {
      const roleA = await prisma.role.create({ data: { role_name: 'Admin' } })
      const roleB = await prisma.role.create({ data: { role_name: 'Viewer' } })
      await prisma.asset.create({ data: { asset_name: 'Asset 1', role_id: roleB.id } })
      await prisma.asset.create({ data: { asset_name: 'Asset 2', role_id: roleA.id } })
      const { data } = await getPaginatedAssets(1, 10, 'role_name', 'asc')
      expect(data[0].role?.role_name).toBe('Admin')
      expect(data[1].role?.role_name).toBe('Viewer')
    })

    it('sorts by nested relation field asset_type_name', async () => {
      const typeA = await prisma.asset_type.create({ data: { asset_type_name: 'Hardware' } })
      const typeB = await prisma.asset_type.create({ data: { asset_type_name: 'Software' } })
      await prisma.asset.create({ data: { asset_name: 'Asset 1', asset_type_id: typeB.id } })
      await prisma.asset.create({ data: { asset_name: 'Asset 2', asset_type_id: typeA.id } })
      const { data } = await getPaginatedAssets(1, 10, 'asset_type_name', 'asc')
      expect(data[0].asset_type?.asset_type_name).toBe('Hardware')
      expect(data[1].asset_type?.asset_type_name).toBe('Software')
    })
  })
})