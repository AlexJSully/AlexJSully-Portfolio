import { render, screen } from '@testing-library/react'
import Contact from './contact'

test('renders learn react link', () => {
  render(<Contact key='Contact-section' />)

  // Check if Twitter, GitHub and LinkedIn buttons still exist
  const twitterButton = screen.getByTitle('Twitter')
  expect(twitterButton).toBeInTheDocument()
  const githubButton = screen.getByTitle('GitHub')
  expect(githubButton).toBeInTheDocument()
  const linkedinButton = screen.getByTitle('LinkedIn')
  expect(linkedinButton).toBeInTheDocument()
})
