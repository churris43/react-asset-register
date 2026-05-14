import { describe, it, expect } from 'vitest'
import { prisma } from '../../lib/prisma'
import {
  getAssetTypesById,
  createAssetType,
  updateAssetType,
  deleteAssetType,
  getPaginatedAssetTypes,
} from '../../services/assetTypeServices'

describe('assetTypeServices', () => {
  describe('createAssetType', () => {
    it('creates an asset type', async () => {
      const result = await createAssetType({ asset_type_name: 'Hardware' })
      expect(result.asset_type_name).toBe('Hardware')
      expect(result.id).toBeDefined()
    })
  })

  describe('getAssetTypesById', () => {
    it('returns the asset type when found', async () => {
      const created = await prisma.asset_type.create({ data: { asset_type_name: 'Software' } })
      expect((await getAssetTypesById(created.id))?.asset_type_name).toBe('Software')
    })

    it('returns null when not found', async () => {
      expect(await getAssetTypesById(99999)).toBeNull()
    })
  })

  describe('updateAssetType', () => {
    it('updates the asset type name', async () => {
      const created = await prisma.asset_type.create({ data: { asset_type_name: 'Old' } })
      const result = await updateAssetType(created.id, { asset_type_name: 'New' })
      expect(result.asset_type_name).toBe('New')
    })
  })

  describe('deleteAssetType', () => {
    it('deletes the record and returns it', async () => {
      const created = await prisma.asset_type.create({ data: { asset_type_name: 'To Delete' } })
      const result = await deleteAssetType(created.id)
      expect(result.id).toBe(created.id)
      expect(await prisma.asset_type.findUnique({ where: { id: created.id } })).toBeNull()
    })
  })

  describe('getPaginatedAssetTypes', () => {
    it('returns the correct page and total', async () => {
      await prisma.asset_type.createMany({
        data: [{ asset_type_name: 'Hardware' }, { asset_type_name: 'Networking' }, { asset_type_name: 'Software' }],
      })
      const { data, total } = await getPaginatedAssetTypes(1, 2, 'asset_type_name', 'asc')
      expect(total).toBe(3)
      expect(data).toHaveLength(2)
      expect(data[0].asset_type_name).toBe('Hardware')
    })

    it('returns the second page', async () => {
      await prisma.asset_type.createMany({
        data: [{ asset_type_name: 'Hardware' }, { asset_type_name: 'Networking' }, { asset_type_name: 'Software' }],
      })
      const { data } = await getPaginatedAssetTypes(2, 2, 'asset_type_name', 'asc')
      expect(data).toHaveLength(1)
      expect(data[0].asset_type_name).toBe('Software')
    })

    it('sorts desc', async () => {
      await prisma.asset_type.createMany({
        data: [{ asset_type_name: 'Hardware' }, { asset_type_name: 'Software' }],
      })
      const { data } = await getPaginatedAssetTypes(1, 10, 'asset_type_name', 'desc')
      expect(data[0].asset_type_name).toBe('Software')
    })
  })
})