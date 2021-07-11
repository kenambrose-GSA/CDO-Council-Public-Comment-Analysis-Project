import React from 'react'

export default function User({user}) {
  return (
    <div>
      <h1>{user.email}</h1>
      <p><b>uid: </b>{user.uid}</p>
    </div>
  )
}
