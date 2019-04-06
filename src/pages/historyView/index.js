//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Container, Content } from 'native-base';

import BenStatusBar from '../../components/BenStatusBar';
import BenHeader from '../../components/BenHeader';
import BackButton from '../../components/BackButton';
import BenBody from '../../components/BenBody' ;


import CartBody from './CartBody';

// create a component
class HistoryPageView extends Component {


    constructor(props){
        super(props);

        this.store = props.screenProps;
        this.state = {}
        this.userInfo = this.store.getState().user.userInfo;

    }
    render() {

        const data = this.props.navigation.getParam('data');

        return (
            <Container>
                <BenStatusBar/>
                <BenHeader type="flex-start">
                <BackButton onPress={()=>{ this.props.navigation.goBack() }} />
                <View>
                    <Text style={s.title}>  { data.code } </Text>
                </View>
                <View></View>
                </BenHeader>


                <Content>
                    <BenBody>
                        <CartBody data={data} />
                    </BenBody>
                </Content>

            </Container>
        );
    }
}

// define your styles
const s = StyleSheet.create({
    title: {
    fontFamily: 'Roboto',
    fontSize:16,
    color:'#666',
    textTransform:'uppercase'
  },
});

//make this component available to the app
export default HistoryPageView;
