/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { IFriend } from "../interfaces/IFriend"
import { gql, useMutation, ApolloClient } from "@apollo/client"

const ADD_FRIEND = gql`
mutation 
createFriend($friend : FriendInput){
  createFriend(input:$friend){
   firstName
    lastName
    email
    role
    id
  }
}`

const ALL_FRIENDS = gql`
{
  getAllFriends{
    id
    firstName
    lastName
    email
    role
  }
}
`

type AddFriendProps = {
  initialFriend?: IFriend,
  allowEdit: true
}

interface IKeyableFriend extends IFriend {
  [key: string]: any
}

interface FriendData {
  getAllFriends: IFriend[]
}

const AddFriend = ({ initialFriend, allowEdit }: AddFriendProps) => {
  const EMPTY_FRIEND: IFriend = { firstName: "", lastName: "", password: "", email: "" }
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND }

  const [addFriend, { data }] = useMutation(
    ADD_FRIEND,
    {
      update(cache, { data }) {
        const addedFriend = data.createFriend;
        const d: any = cache.readQuery({ query: ALL_FRIENDS })
        let allFriends = d.getAllFriends || []
        cache.writeQuery({ query: ALL_FRIENDS, data: { getAllFriends: [...allFriends, addedFriend] } })
      }
    })

  const [friend, setFriend] = useState({ ...newFriend })
  const [readOnly, setReadOnly] = useState(!allowEdit)

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const id = event.currentTarget.id;
    var friendToChange: IKeyableFriend = { ...friend };
    friendToChange[id] = event.currentTarget.value;
    setFriend({ ...friendToChange })
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addFriend({
      variables: {
        friend: { ...friend }
      }
    })
    setFriend({ ...EMPTY_FRIEND })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        FirstName<br />
        <input type="text" readOnly={readOnly} id="firstName" value={friend.firstName} onChange={handleChange} />
      </label>
      <br />
      <label>
        LastName <br />
        <input readOnly={readOnly} type="text" id="lastName" value={friend.lastName} onChange={handleChange} />
      </label>
      <br />
      <label>
        Email <br />
        <input readOnly={readOnly} type="email" id="email" value={friend.email} onChange={handleChange} />
      </label>
      <br />
      <label>
        Password <br />
        <input readOnly={readOnly} type="password" id="password" value={friend.password} onChange={handleChange} />
      </label>
      <br /><br />
      {!readOnly && <input type="submit" value="Submit" />}
    </form>
  );
}

export default AddFriend;