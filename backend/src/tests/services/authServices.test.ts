// These tests are slower than others because bcrypt runs with SALT_ROUNDS=12
// (the correct production value). Each test that calls loginUser will take ~300ms.
// Do not lower SALT_ROUNDS to speed them up.
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { loginUser, refreshAccessToken } from '../../services/authServices'
import { createUser } from '../../services/userServices'

describe('authServices', () => {
  describe('loginUser', () => {
    it('returns access and refresh tokens for valid credentials', async () => {
      await createUser({ email: 'bob@example.com', password_hash: 'password123', name: 'Bob', isAdmin: false })
      const { accessToken, refreshToken } = await loginUser('bob@example.com', 'password123')
      expect(accessToken).toBeDefined()
      expect(refreshToken).toBeDefined()
    })

    it('access token has type access', async () => {
      await createUser({ email: 'bob2@example.com', password_hash: 'password123', name: 'Bob', isAdmin: false })
      const { accessToken } = await loginUser('bob2@example.com', 'password123')
      const payload = jwt.decode(accessToken) as { type: string }
      expect(payload.type).toBe('access')
    })

    it('refresh token has type refresh', async () => {
      await createUser({ email: 'bob3@example.com', password_hash: 'password123', name: 'Bob', isAdmin: false })
      const { refreshToken } = await loginUser('bob3@example.com', 'password123')
      const payload = jwt.decode(refreshToken) as { type: string }
      expect(payload.type).toBe('refresh')
    })

    it('throws INVALID_CREDENTIALS for wrong password', async () => {
      await createUser({ email: 'bob4@example.com', password_hash: 'password123', name: 'Bob', isAdmin: false })
      await expect(loginUser('bob4@example.com', 'wrong')).rejects.toThrow('INVALID_CREDENTIALS')
    })

    it('throws INVALID_CREDENTIALS for unknown email', async () => {
      await expect(loginUser('nobody@example.com', 'password123')).rejects.toThrow('INVALID_CREDENTIALS')
    })
  })

  describe('refreshAccessToken', () => {
    it('returns a new access token from a valid refresh token', async () => {
      await createUser({ email: 'carol@example.com', password_hash: 'password123', name: 'Carol', isAdmin: false })
      const { refreshToken } = await loginUser('carol@example.com', 'password123')
      const newToken = refreshAccessToken(refreshToken)
      const payload = jwt.decode(newToken) as { type: string }
      expect(payload.type).toBe('access')
    })

    it('throws when given an access token instead of a refresh token', async () => {
      await createUser({ email: 'carol2@example.com', password_hash: 'password123', name: 'Carol', isAdmin: false })
      const { accessToken } = await loginUser('carol2@example.com', 'password123')
      expect(() => refreshAccessToken(accessToken)).toThrow('INVALID_TOKEN_TYPE')
    })
  })
})