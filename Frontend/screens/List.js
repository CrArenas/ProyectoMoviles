import { View, Text, FlatList, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
var api = require('../services/Api.js');

export default function List() {

    const [roles, setRoles] = useState([]);

    useEffect(function () {
        cargarDatos();
    }, [])

    cargarDatos = function () {
        api.getRoles()
        .then(function (data) {
            setRoles(data);
        })
    }

  return (
    <View>
      <Button title='Ir a crear rol' onPress={function() { navigation.navigate('Create') }} />

      <FlatList 
      data={roles}
      renderItem={function (info) {
        var item = info.item;
        return (
          <View>
            <Text>{item.name}</Text>
          </View>
        )
      }}
      keyExtractor={function (item) { return item.id.toString() }}
        />
    </View>
  )
}