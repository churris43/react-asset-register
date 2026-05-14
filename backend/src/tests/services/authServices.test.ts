// These tests are slower than others because bcrypt runs with SALT_ROUNDS=12
// (the correct production value). Each test that calls registerUser or loginUser
// will take ~300ms. Do not lower SALT_ROUNDS to speed them up.
import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { registerUser, loginUser, refreshAccessToken } from '../../services/authServices'

describe('authServices', () => {
  describe('registerUser', () => {
    it('creates a user and returns id and email', async () => {
      const result = await registerUser('alice@example.com', 'password123')
      expect(result.email).toBe('alice@example.com')
      expect(result.id).toBeDefined()
    })

    it('throws EMAIL_TAKEN for a duplicate email', async () => {
      await registerUser('alice@example.com', 'password123')
      await expect(registerUser('alice@example.com', 'other')).rejects.toThrow('EMAIL_TAKEN')
    })
  })

  describe('loginUser', () => {
    it('returns access and refresh tokens for valid credentials', async () => {
      await registerUser('bob@example.com', 'password123')
      const { accessToken, refreshToken } = await loginUser('bob@example.com', 'password123')
      expect(accessToken).toBeDefined()
      expect(refreshToken).toBeDefined()
    })

    it('access token has type access', async () => {
      await registerUser('bob@example.com', 'password123')
      const { accessToken } = await loginUser('bob@example.com', 'password123')
      const payload = jwt.decode(accessToken) as { type: string }
      expect(payload.type).toBe('access')
    })

    it('refresh token has type refresh', async () => {
      await registerUser('bob@example.com', 'password123')
      const { refreshToken } = await loginUser('bob@example.com', 'password123')
      const payload = jwt.decode(refreshToken) as { type: string }
      expect(payload.type).toBe('refresh')
    })

    it('throws INVALID_CREDENTIALS for wrong password', async () => {
      await registerUser('bob@example.com', 'password123')
      await expect(loginUser('bob@example.com', 'wrong')).rejects.toThrow('INVALID_CREDENTIALS')
    })

    it('throws INVALID_CREDENTIALS for unknown email', async () => {
      await expect(loginUser('nobody@example.com', 'password123')).rejects.toThrow('INVALID_CREDENTIALS')
    })
  })

  describe('refreshAccessToken', () => {
    it('returns a new access token from a valid refresh token', async () => {
      await registerUser('carol@example.com', 'password123')
      const { refreshToken } = await loginUser('carol@example.com', 'password123')
      const newToken = refreshAccessToken(refreshToken)
      const payload = jwt.decode(newToken) as { type: string }
      expect(payload.type).toBe('access')
    })

    it('throws when given an access token instead of a refresh token', async () => {
      await registerUser('carol@example.com', 'password123')
      const { accessToken } = await loginUser('carol@example.com', 'password123')
      expect(() => refreshAccessToken(accessToken)).toThrow('INVALID_TOKEN_TYPE')
    })
  })
})