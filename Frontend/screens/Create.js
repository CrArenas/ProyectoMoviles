import { View, Text, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
var api = require('../services/Api.js');

export default function Create() {
    // Aquí van todas las variables que se enviarán desde el frontend, si hubiese algo mas que el name,
    // se colocaría aquí también. Por ejemplo, si el rol tuviese una descripción, se colocaría una variable 
    // description y un setDescription.


    // Lo mismo para para los TextInput, se colocaría un TextInput para cada variable que se vaya a enviar al backend. En este caso, solo
    const [name, setName] = useState('');

    function guardarRol() {
        var role = {
            name: name
        }
        api.postRoles(role)
        .then(function (response) {
            Navigation.goBack();
        })
    }
  return (
    <View>
      <TextInput
        placeholder='Ingrese el nombre del rol: '
        onChangeText={function (text) {
            setName(text);
        }}
        value={name}
      />
      <Button title='Crear rol' onPress={guardarRol} />
    </View>
  )
}