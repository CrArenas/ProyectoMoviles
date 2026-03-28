import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import List from './screens/List.js'
import Create from './screens/Create.js'
import Edit from './screens/Edit.js'
import 'react-native-gesture-handler'

var Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={List} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="Edit" component={Edit} />  
      </Stack.Navigator>
    </NavigationContainer>
  )
}