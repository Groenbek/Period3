/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery,gql } from "@apollo/client"


const GET_FRIEND = gql`
  query getOneFriend($id:ID!){
  getOneFriend(id:$id){
    id
    firstName
    lastName
    language
    gender
    age
    email
  }
}
`

export default function FindFriend() {
  const [id, setId] = useState("")
  const [getFriend, { loading, error, data }] = useLazyQuery(GET_FRIEND);

  const fetchFriend = () => {
     alert(`Find friend with id: ${id}`)
  }

  return (
    <div>
      ID:<input type="txt" value={id} onChange={e => { setId(e.target.value) }} />
      &nbsp; <button onClick={fetchFriend}>Find Friend</button>
      <br/>
      <br/>
      <h2>Fetch a friend using the provided id</h2>
    </div>)
}