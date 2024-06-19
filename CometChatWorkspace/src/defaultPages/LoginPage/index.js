import React from 'react';
import {connect} from 'react-redux';
import {CometChatAvatar} from '../../cometchat-chat-uikit-react-native/CometChatWorkspace/src/index';
import {COMETCHAT_CONSTANTS} from '../../../src/CONSTS';
import style from './style';
import * as actions from '../../store/action';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {ActivityIndicator} from 'react-native';
import DropDownAlert from '../../cometchat-chat-uikit-react-native/CometChatWorkspace/src/components/Shared/DropDownAlert';
import { users } from '../../utils/usersList';
class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      showError: false,
      usersList: []
    };
  }

  login = (uid, createUser = false) => {
    if (!uid) {
      uid = this.state.uid;
    }
    this.uid = uid;
    this.setState({showError: true});
    this.props.dispatch(
      actions.auth(this.uid, COMETCHAT_CONSTANTS.AUTH_KEY, createUser),
    ); 
  };

  componentDidUpdate() {
    if (this.props.isLoggedIn) {
      this.props.navigation.navigate('HomePage');
    }
  }

  componentDidMount() {
    fetch("https://assets.cometchat.io/sampleapp/sampledata.json")
    .then((response) => {
      if (response.status === 200) return response.json();
      else {
        this.setState({usersList: users});
        return {};
      }
    })
    .then((res) => {
      if (res.users)
        this.setState({
          usersList: res.users.map((item) => ({
              ...item,
              avatar: { uri: item.avatar },
            }))
          }
        );

    });
  }

  render() {
    let loader = null;
    let {usersList} = this.state;
    if (this.props.loading) {
      loader = (
        <View style={style.loaderContainer}>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      );
    }

    let errorMessage = null;
    if (this.props.error && this.state.showError) {
      this.dropDownAlertRef?.showMessage('error', this.props.error.message);
    }

    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        {loader}

        <ScrollView>
          <View style={style.wrapperStyle}>
            {errorMessage}
            <Text style={style.titleStyle}>CometChat App</Text>
            <Text style={style.subtitleStyle}>
              Login with one of our sample users
            </Text>
            <View style={style.userContainerStyle}>
              {Boolean(this.state.usersList.length) &&
                this.state.usersList.map((user) => (
                  <TouchableOpacity
                    style={style.userWrapperStyle}
                    onPress={() => this.login(user.uid)}
                  >
                    <View style={style.thumbnailWrapperStyle}>
                      <CometChatAvatar image={user.avatar} />
                    </View>
                    <Text style={style.btnText}>{user.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <View style={style.uidWrapperStyle}>
              <View>
                <Text style={style.subtitleStyle}> Login with UID</Text>
              </View>
              <View style={style.inputWrapperStyle}>
                <TextInput
                  style={style.textInput}
                  onSubmitEditing={() => this.login('', true)}
                  onChangeText={(value) => {
                    this.setState({uid: value});
                  }}
                  placeholder="Enter your UID here"
                />
              </View>
              <TouchableOpacity
                style={style.loginBtn}
                onPress={() => this.login('', true)}>
                <Text style={style.btnText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          <DropDownAlert
            onClose={() => this.setState({showError: false})}
            ref={(ref) => (this.dropDownAlertRef = ref)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
