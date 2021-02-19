import React from 'react';
import {connect} from 'react-redux';
import {CometChatAvatar} from '../../react-native-chat-ui-kit';
import {COMETCHAT_CONSTANTS} from '../../CONSTS';
import style from './style';
import * as actions from '../../store/action';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ActivityIndicator} from 'react-native';

class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
    };
  }

  login = (uid) => {
    if (!uid) {
      uid = this.state.uid;
    }
    this.uid = uid;
    this.props.dispatch(actions.auth(this.uid, COMETCHAT_CONSTANTS.AUTH_KEY)); //dispatch( actions.auth( uid, authKey ) )
  };

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      this.props.navigation.navigate('HomePage');
    }
  }

  render() {
    let loader = null;

    if (this.props.loading) {
      loader = (
        <View style={style.loaderContainer}>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      );
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <Text style={style.errorStyle}>{this.props.error.message}</Text>
      );
    }

    return (
      <SafeAreaView>
        {loader}
        <View style={style.wrapperStyle}>
          {errorMessage}
          <Text style={style.titleStyle}>CometChat App</Text>
          <Text style={style.subtitleStyle}>
            Login with one of our sample users
          </Text>
          <View style={style.userContainerStyle}>
            <TouchableOpacity
              style={style.userWrapperStyle}
              onPress={() => this.login('superhero1')}>
              <View style={style.thumbnailWrapperStyle}>
                <CometChatAvatar
                  image={{
                    uri:
                      'https://data-us.cometchat.io/assets/images/avatars/ironman.png',
                  }}
                />
              </View>
              <Text style={style.btnText}>superhero1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.userWrapperStyle}
              onPress={() => this.login('superhero2')}>
              <View style={style.thumbnailWrapperStyle}>
                <CometChatAvatar
                  image={{
                    uri:
                      'https://data-us.cometchat.io/assets/images/avatars/captainamerica.png',
                  }}
                />
              </View>
              <Text style={style.btnText}>superhero2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.userWrapperStyle}
              onPress={() => this.login('superhero3')}>
              <View style={style.thumbnailWrapperStyle}>
                <CometChatAvatar
                  image={{
                    uri:
                      'https://data-us.cometchat.io/assets/images/avatars/spiderman.png',
                  }}
                />
              </View>
              <Text style={style.btnText}>superhero3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.userWrapperStyle}
              onPress={() => this.login('superhero4')}>
              <View style={style.thumbnailWrapperStyle}>
                <CometChatAvatar
                  image={{
                    uri:
                      'https://data-us.cometchat.io/assets/images/avatars/wolverine.png',
                  }}
                />
              </View>
              <Text style={style.btnText}>superhero4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.userWrapperStyle}
              onPress={() => this.login('superhero5')}>
              <View style={style.thumbnailWrapperStyle}>
                <CometChatAvatar
                  image={{
                    uri:
                      'https://data-us.cometchat.io/assets/images/avatars/cyclops.png',
                  }}
                />
              </View>
              <Text style={style.btnText}>superhero5</Text>
            </TouchableOpacity>
          </View>
          <View style={style.uidWrapperStyle}>
            <View>
              <Text style={style.subtitleStyle}> Login with UID</Text>
            </View>
            <View style={style.inputWrapperStyle}>
              <TextInput
                style={style.textInput}
                // ref={this.myRef}
                onChangeText={(value) => {
                  this.setState({uid: value});
                }}
                placeholder="Enter your UID here"
              />
            </View>
            <TouchableOpacity
              style={style.loginBtn}
              onPress={() => this.login()}>
              <Text style={style.btnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({reducer}) => {
  return {
    loading: reducer.loading,
    error: reducer.error,
    isLoggedIn: reducer.isLoggedIn,
  };
};

export default connect(mapStateToProps)(LoginPage);
