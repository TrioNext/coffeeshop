/* @flow weak */
import {RED_COLOR, COFFEE_COLOR, BLACK_COLOR, GREY_COLOR } from '../../config/const';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';


import {  Icon, Content } from 'native-base';
import BenBody from '../../components/BenBody';

import NoData from '../../components/NoData';


const w = Dimensions.get('window');
export default class BodyDrinks extends Component{


  constructor(props){
    super(props);

    this.data = props.data ;

  }


  _onPressItem(data){

    this.props.onPressItem(data);

  }
  render(){


    const data = this.props.data ;


    return(
      <Content style={{
          backgroundColor: GREY_COLOR
        }}>

        <BenBody>

            {
              data.map((item, index)=>{

                const photo = item.photo.replace(/ /g,'%20');
                return (
                  <View key={index} style={{
                    marginTop: 15,
                    flexDirection: 'row',
                    borderBottomColor: 'rgba(0,0,0,0.1)',
                    borderBottomWidth: 0,

                  }}>

                    <TouchableOpacity style={{
                      backgroundColor:'rgba(0,0,0,0.1)'
                      }} onPress={()=>{ this._onPressItem(item) }} >
                      <Image resizeMode="cover" style={{width:120,height: 120}}  source={{uri: photo+`&w=120&buster=${Math.random()}` }}  />
                    </TouchableOpacity>

                    <View style={{
                      paddingLeft: 10,
                      justifyContent: 'center',

                      width: '66%',
                      backgroundColor:'#fff'


                    }}>
                       <TouchableOpacity onPress={()=>{ this._onPressItem(item) }}>
                          <Text style={[s.txt,s.h4]}> { item.name }  </Text>
                       </TouchableOpacity>

                       <Text style={s.txt}> Size L  </Text>
                       <Text style={s.txt,s.price }> { item.price_m } $ </Text>

                    </View>

                  </View>
                )
              })
            }
            { data.length == 0 ? <NoData visible={ !this.props.loader } icon="cafe" message=" On update data .. " /> : null }


        </BenBody>

      </Content>
    )
  }
}

const s =  StyleSheet.create({
  h4:{
    color: COFFEE_COLOR,
    fontSize: 16,
    fontWeight: '500',

  },
  price:{
    color:RED_COLOR,
    fontSize: 16,
    fontWeight: '500'
  },
  txt:{
    fontSize: 16,
    color: BLACK_COLOR,
    marginBottom:10,
    fontFamily: 'Roboto',

  }
})
