/*
MAIN TAB ON SHOP
*/
import moFire from '../model/moFirebase';
import Api from '../model/api';
import socket from '../config/socket'


import React, { Component } from 'react';
import {  Notifications, Permissions } from 'expo';



import BenTabs  from "../components/BenTabs";
import BenStatusBar  from "../components/BenStatusBar";
import BenLoader from '../components/BenLoader';


/* TABS : 5 tab items */
import FeedTab from './feedTab/';
import MissionTab from './missionTab/';
import OrderTab from './orderTab';
import StoreTab from './storeTab/';
import AccountTab from './userTab/';


/* NOTIFICATIONS  */
async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

function listenForNotifications(){
  Notifications.addListener(notification => {
    if (notification.origin === 'received') {
       alert(JSON.stringify(notification))
    }
  });
}

function sendLocalNotification(json){
  const localnotification = {
    title: json.title,
    body: json.body,
    android: {
      sound: true,
    },
    ios: {
      sound: true,
    },
  };

  let afterOneSecond = Date.now();
  afterOneSecond += 1000;

  const schedulingOptions = { time: afterOneSecond };
  Notifications.scheduleLocalNotificationAsync(
    localnotification,
    schedulingOptions
  );
}

/* END NOTIFICATION */




class shop extends Component {

    _isMounted = false;

    constructor(props){
      super(props);

      this.store = props.screenProps;

      this.state = state = {
        loader:false,
        onAction:'',
        navigation:props.navigation,
        tabs:[
          { tab:'feed',icon:'paper',name:'Feeds' },
          { tab:'mission',icon:'aperture',name:'Missions' },
          { tab:'order',icon:'cafe',name:'Orders' },
          { tab:'store',icon:'pin',name:'Stores' },
          { tab:'account',icon:'person',name:'Account' },
        ],
        onTab:'order',
        tab:{},
        userInfo:props.screenProps.getState().user.userInfo

      }

      this.data = {
        categories:[],
        orders:[]
      };

      this.poll = '';
      this.time_id = 2000 ;

      this._setup() ;



    }

    _poll(type){
      this.poll = type ;
      if(this.poll==='start'){

          console.log('poll on running');
          clearInterval(this.time_id);

          this.time_id = setInterval(()=>{
            socket.emit('find','notifications',{
              is_read:0,
              belong_uid:15
            },(err,data)=>{

              if(data.total>0){
                sendLocalNotification({
                  title:'Test Noti',
                  body:` Just test localnotification  `
                });
              }

              console.log(data);


              this._poll(type);
            });
          },30000);

      }else{
        console.log('poll stop!');
        clearInterval(this.time_id);
      }

    }

    _setup(){

      // START LISTEN REDUX - SOCKJET
      this._listenUserInfo();
      this._listenSocket();


      this.moCate = new moFire('categories');
      this.moOrder = new Api('orders');

      this.moOrder.set('method',{
        name:'listAll',
        params:'all?creator_id='+this.state.userInfo.id+'&status=lt2'
      });


    }



    _listenSocket(){

      /* LISTENING ORDERS ON created */
      socket.on('connect',()=>{

        console.log('connect socket me');
        this._poll('start');

      })

      socket.on('disconnect',()=>{
        console.log('disconnect me');
        socket.open();

      })





    }

    _listenUserInfo(){
      this.unsubscribe = this.store.subscribe(()=>{

        const userInfo = this.store.getState().user.userInfo;


        this.setState({
          userInfo:userInfo
        });

      })
    }

    componentWillUnmount(){
      this._isMounted = false;
      this.unsubscribe();

    }

    _readOrders(){
      this.moOrder.fetch((res)=>{
        res = res.data ;
        if(res.name==='success'){
          this.data.orders = res.rows ;
          this.setState({onAction:'_readOrders'}) ;
        }
      })
    }


    _initNotification(){
      getiOSNotificationPermission();
      listenForNotifications();

    }

    componentDidMount(){

      this._initNotification();

      this._isMounted = true;
      this.setState({loader:true});
      this.moCate.read((data)=>{

        this.data.categories = data;

        if(this._isMounted){
          this.setState({
            loader:false,
            onAction:'fetch_categories'
          })
        }

      });

      // READ ORDERS
      this._readOrders();


    }


    _onChangeTab(data){

      this._isMounted = false;
      this.unsubscribe();

      this.setState({
        onTab:data.tab,
        tab:data
      });

      if(data.tab==='order'){


        this.moCate.read((data)=>{
          this.setState({
            onAction:'fetch_categories'
          })
        });

        // READ AGAIN ;
        this._readOrders();

        // LISTENNING AGAIN ;
        this._listenUserInfo();


      }

    }

    onStateChange(newState){

       switch (newState.onAction) {
         case 'change_tab' :

            let combineState = Object.assign(this.state,newState);
            combineState.onTab = newState.toTab

            this.setState( combineState );

         break;
         default:

       }

    }
    render() {


        return (
            <BenTabs
              onPress={(data)=>{ this._onChangeTab(data) }}
              onTab={ this.state.onTab }
              data={ this.state.tabs }
              notiOrder={ this.data.orders.length }
            >
              <BenLoader visible={this.state.loader} />

              <BenStatusBar/>

              <FeedTab onPressChangeTab={ (data)=>{ this._onChangeTab(data) } } { ...this.state } />
              <MissionTab { ...this.state } />
              <OrderTab  data={this.data} { ...this.state } />
              <StoreTab { ...this.state } />
              <AccountTab { ...this.state } />



            </BenTabs>
        );
    }
}
export default shop;
