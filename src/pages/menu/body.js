/* @flow weak */
import { COFFEE_COLOR } from '../../config/const';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {  Tab, Tabs, TabHeading } from 'native-base';



import BodyDrinks from './drinks';
import BodyFoods from './foods';
import BodyFavories from './favories';


const MenuBody = (props) => (


    <Tabs textStyle={{color:'#000'}} tabBarUnderlineStyle={{ backgroundColor: COFFEE_COLOR,height:2, }}>
        <Tab heading={
          <TabHeading>
            <Text style={{color:'#555'}}>Drinks</Text>
        </TabHeading>
        }>
            <BodyDrinks loader={props.loader} onPressItem={(data)=>{ props.onPressItem(data) }} data={ props.data } />
        </Tab>
        {/*<Tab heading="Foods">
            <BodyFoods/>
        </Tab>*/}
        <Tab heading={
          <TabHeading>
              <Text style={{color:'#555'}}>Favories</Text>
          </TabHeading>
        }>
            <BodyFavories/>
        </Tab>
    </Tabs>


);

export default MenuBody;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
