import React from 'react'

function ModulePlaceholderPage({ title, description, features = [] }) {
  return (
    <div className='placeholder-page'>
      <div className='placeholder-card'>
        <div className='placeholder-kicker'>Admin Module</div>
        <h1>{title}</h1>
        <p>{description}</p>

        <div className='placeholder-list'>
          <h3>Features coming soon</h3>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ModulePlaceholderPage
