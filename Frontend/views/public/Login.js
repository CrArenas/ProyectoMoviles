import { View, Text, TextInput, Pressable } from 'react-native'
import React, {useState} from 'react'
import * as SecureStore from 'expo-secure-store';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(){
        const data ={
            email:email,
            password:password
        }
        fetch('http://10.158.87.60:8000/api/login', {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(data)
        })
            .then(function(response){
                return response.json()
            })
            .then(function (data){
                console.log(data)
                SecureStore.setItemAsync('token',data.access_token)
            })

    }
  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder='Ingrese el correo' onChangeText={function(t){
        setEmail(t)
      }}></TextInput>
      <TextInput placeholder='Ingrese la contraseña' onChange={function(t){
        setPassword(t)
      }}></TextInput>
      <Pressable onPress={handleLogin}>
        <Text>
            Login
        </Text>
      </Pressable>
    </View>
  )
}