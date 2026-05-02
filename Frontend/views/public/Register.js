import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { post } from '../../services/post';
import { RegisterH } from '../../hooks/RegisterH';


export default function Register() {

  const  {
    setName,
    setEmail,
    setPassword,
    handleSubmit,
  } = RegisterH()

  function enviarDatos(){
    handleSubmit().then(function (res) {
      console.log(res);
    });
  }

  return (
    <View>
        <Text>Panel de registro</Text>
        <TextInput placeholder='Ingrese el nombre' 
          value = {name}
          onChangeText={setName}/>
        <TextInput placeholder='Ingrese un correo electrónico' 
          value = {email}
          onChangeText={setEmail}/>
        <TextInput placeholder='Ingrese una contraseña válida' 
          value = {password}
          onChangeText={setPassword}/>
        <Pressable onPress={enviarDatos()}>
            <Text>Registrarse</Text>
        </Pressable>
    </View>
  )
}