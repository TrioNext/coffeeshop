import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { Container, Icon, Header, Tab, Tabs, ScrollableTab, Content, Button } from 'native-base';

import { GREY_COLOR, COFFEE_COLOR } from '../../config/const' ;

import OrderHeader from './Header';
import OrderBody from './Body';

import DrinkCates from './categories.json';

export default class OrderPage extends Component{

  constructor(props){
    super(props)

    this.state = {

      typeAction:'',
      onAction:'',
      tab:'order',

      categories:DrinkCates

    }
  }


  render(){

    
    return(
      <Container style={{
        backgroundColor:GREY_COLOR,
        display:  this.props.onTab === this.state.tab ? 'block':'none'
      }}>

        <OrderHeader />

        <Content>

            <OrderBody>
                <Text style={s.h4}> King Kong Menu list </Text>

                <View style={{
                     justifyContent: 'space-between',
                     flexWrap: 'wrap',
                     flexDirection:'row'

                  }}>

                  {
                    this.state.categories.map((item)=>{

                      console.log(item.uri);

                      const uri = '../../../assets/milktea.jpg';
                       return(
                         <TouchableOpacity key={item.id} style={{
                             width: '48%',
                             borderRadius: 6,
                             marginBottom: 14

                           }}>
                           <Image source={{uri:item.uri}}
                           style={{height: 140, width: '100%', flex: 1, borderRadius: 6, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.2)'}}
                           />
                         <View style={{
                             width: '100%',
                             height: 140,
                             position: 'absolute',
                             top:0,
                             alignItems: 'center',
                             justifyContent: 'center',
                             borderRadius: 6,
                             backgroundColor:'rgba(0,0,0,0.4)'
                           }}>
                           <Text style={{
                               fontFamily: 'Roboto',
                               color:'#fff',
                               fontSize: 20

                             }}> { item.name } </Text>
                         </View>


                         </TouchableOpacity>
                       )

                    })
                  }





                </View>


            </OrderBody>


        </Content>
      </Container>

    )
  }
}

const s = StyleSheet.create({
  h4:{
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Roboto',
    marginTop: 10,
    marginBottom: 10

  }
})
