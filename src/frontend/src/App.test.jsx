import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
    configurable: true,
  })
})

describe('admin routing', () => {
  it('loads the admin login experience at the /admin entry route', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    )

    expect(markup).toContain('admin-auth-shell')
  })

  it('renders an identifier-oriented login screen for the admin endpoint', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/admin/login']}>
        <App />
      </MemoryRouter>
    )

    expect(markup).toContain('Identifier')
  })
})
