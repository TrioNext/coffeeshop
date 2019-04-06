/* @flow */

import USER  from '../../config/user';


import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard
} from 'react-native';


import { Container,  Content, Icon } from 'native-base';
import { GREY_COLOR, COFFEE_COLOR, BLACK_COLOR, GOOGLE_MAP_KEY } from '../../config/const' ;

import MyHeader from './header';
import BenStatusBar from '../../components/BenStatusBar';
import BenLoader from '../../components/BenLoader';





function Item(props){

  const data = props.data ;

  return(
    <TouchableOpacity onPress={()=>{ props.onPress(data)  }} style={s.items}>
        <View style={{
          flexDirection: 'row'
        }}>
          <View style={{ justifyContent: 'center'}}>
            <Icon style={s.icon}  name={data.icon} />
          </View>
          <View style={{marginLeft: 10}}>
              <Text style={s.txt}> {data.label} </Text>
              <Text style={s.title}>  { data.name  }   </Text>
          </View>
        </View>
    </TouchableOpacity>
  )
}

export default class DeliveryPage extends Component {

  constructor(props){
    super(props)

    this.store = props.screenProps;

    this.state = {

      loader:false,
      typeAction:'',
      onAction:'',
      tab:'delivery',

      mode:'none',
      userInfo: this.store.getState().user.userInfo ,

      personalItems:[
        {
          code:'home',
          icon:'home',
          label:'Home',
          name: this.store.getState().user.userInfo['home_address'] || '',
          isEmpty: this.store.getState().user.userInfo['home_address'] || ''
        },
        {
          code:'office',
          icon:'briefcase',
          label:'Work place',
          name:this.store.getState().user.userInfo['work_address'] || '',
          isEmpty:this.store.getState().user.userInfo['work_address'] || ''
        },
        /*{
          code:'current',
          icon:'navigate',
          label:'Current location',
          name:'..'
        },*/
        {
          code:'recent',
          icon:'time',
          label:'Recent search',
          name:this.store.getState().user.userInfo.recent_address || '...'
        },

      ]

    }

    this.data = [];


  }

  componentWillReceiveProps(newProps){

    this.state.personalItems[3]['name'] = newProps.userInfo.recent_address;
    this.setState({
      userInfo:newProps.userInfo
    });

  }

  addressAutoComplete(key){



    let uri = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+key+'&key='+GOOGLE_MAP_KEY;
    fetch(uri)
    .then((response) => response.json())
    .then((responseJson) => {

      const locations = responseJson.predictions;
      let data = [];
      locations.map((item)=>{
        data.push({
          code:'search',
          icon:'pin',
          label:'',
          name:item.description
        });
      })
      this.data = data ;


      this.setState({
        typeAction:'get',
        onAction:'search',
      })
      //console.log(responseJson.predictions);



    })
    .catch((error) => {
      console.error(error);
    });


  }

  _onCloseSearch(){
    this.data = [] ;
    this.setState({
      onAction:'',
    })
  }

  //
  async _onItemPress(data){

    if(data.isEmpty!=='' || data.name !=='...'){


      const userInfo = this.state.userInfo;
      this.setState({loader:true})
      const msg = await USER.update(userInfo.id,{
          name:userInfo.name,
          recent_address:data.name
      });

      this.setState({loader:false})
      Keyboard.dismiss();


      if(msg==='Update success'){

        setTimeout(()=>{
          this._whereStateChange({
            onAction:'goBack',
          });

        },500)

      }else{ alert(msg); }



    }


  }

  _whereStateChange(newState){
    switch(newState.onAction){
      case 'goBack':
        this.props.navigation.goBack();
      break;
    }
  }
  _onTextChange(text){

    this.addressAutoComplete(text);
  }



  render() {


    //console.log(this.state.userInfo);


    return (
      <Container>

        <BenStatusBar/>

        <MyHeader onBackBtnPress={()=>{  this.props.navigation.goBack()  }}  onAction={ this.state.onAction } onCloseSearch={ ()=>{  this._onCloseSearch() } } onChangeText={(text)=>{ this._onTextChange(text)  }} />

        <BenLoader visible={ this.state.loader } />

        <Content>

          <View style={[s.block]}>


              {
                this.data.map((item,index)=>{
                  return(
                    <Item onPress={ (data)=>{ this._onItemPress(data) } } key={index}  data={item} />
                  )
                })
              }
          </View>
          <View style={[s.block]}>
            {
              this.state.personalItems.map((item,index)=>{
                if(item.name!==''){
                  return(
                    <Item onPress={ (data)=>{ this._onItemPress(data) } } key={index}  data={item} />
                  )
                }

              })
            }

          </View>

        </Content>

      </Container>
    );
  }
}

const s = StyleSheet.create({

  icon:{
    color: COFFEE_COLOR
  },
  txt:{
    fontFamily:'Roboto',
    fontSize: 11,
    color: COFFEE_COLOR
  },
  title:{
    fontFamily:'Roboto',
    fontSize: 15,
    fontWeight: 'bold',
    color: BLACK_COLOR,
    marginLeft: -5
  },
  items:{
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 0.5
  },
  block:{
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: '100%',
    marginTop: 10
  }
})
