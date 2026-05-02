import React, {useState } from 'react'
import {post} from '../services/post'


export function RegisterH () {
  const [name, setName]= useState('')
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')

  function handleSubmit(){
    const data ={
      name,
      email,
      password
    }
    return post(data)
  }

  return {

    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  }
}