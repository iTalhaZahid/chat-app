import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/context/authContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import Avatar from '@/components/Avatar';
import Typo from '@/components/Typo';
import * as Icons from 'phosphor-react-native';
import MessageItem from '@/components/MessageItem';
import Input from '@/components/Input';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import Loading from '@/components/Loading';
import { uploadImagetoCloudinary } from '@/services/imageService';
import { getMessages, newMessage } from '@/socket/socketEvents';
import { MessageProps, ResponseProps } from '@/types';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Conversation = () => {

  // const dummyMessages = [
  //   {
  //     id: 'msg1',
  //     sender: {
  //       id: 'me',
  //       name: 'Me',
  //       avatar: null,
  //     },
  //     content: 'Hello! How are you?',
  //     createdAt: '10:38 AM',
  //     isMe: true
  //   },
  //   {
  //     id: 'msg2',
  //     sender: {
  //       id: 'user1',
  //       name: 'John Doe',
  //       avatar: null,
  //     },
  //     content: 'I am good, thanks! How about you?',
  //     createdAt: '10:40 AM',
  //     isMe: false
  //   },
  // ]



  const { user: currentUser } = useAuth();
  const {
    id: conversationId,
    name,
    participants: stringifiedParticipants,
    avatar,
    type
  } = useLocalSearchParams();

  const [message, setMessage] = useState('');

  const participants = JSON.parse(stringifiedParticipants as string);

  let conversationAvatar = avatar;

  let isDirect = type == 'direct';

  const otherParticipants = isDirect ? participants.find((p: any) => p._id != currentUser?.id) : null;

  if (isDirect && otherParticipants) {
    conversationAvatar = otherParticipants.avatar;
  }

  let conversationName = isDirect ? otherParticipants.name : name;


  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(null);
  const onPickFile = async () => {
    // Pick image from gallery

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      setSelectedFile(result.assets[0]);
    }

  };



  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const newMessageHandler = (res: any) => {
    setLoading(false);
    // if (!res?.success || !res.data) return;
    // const msg = res.data as MessageProps & { conversationId: string };
    // if (msg.conversationId !== conversationId) return;
    // setMessages(prev => [msg, ...prev]);
    if (res.success) {
      if(res.data.conversationId === conversationId) {
        setMessages(prev => [res.data as MessageProps, ...prev]);
      }
      else{
        Alert.alert("New Message", res.msg);
      }
    }
  };



  const messageHandler = (res: ResponseProps) => {
    if (res.success) setMessages(res.data);
  }

  const onSend = async () => {
    if (!message.trim() && !selectedFile) return;

    if (!currentUser) return;

    setLoading(true);
    try {
      let attachment: string | null = null;

      if (selectedFile) {
        const uploadResult = await uploadImagetoCloudinary(selectedFile, "message-attachments");
        if (!uploadResult.success) {
          setLoading(false);
          Alert.alert("Error", "Could not upload image!");
          return;
        }
        attachment = uploadResult.data; // URL from Cloudinary
      }

      newMessage({
        conversationId,
        sender: {
          id: currentUser?.id,
          name: currentUser.name,
          avatar: currentUser.avatar
        },
        content: message.trim(),
        attachment
      });
      setMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.log("error sending message:", error)
      Alert.alert("Error", "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    newMessage(newMessageHandler);
    getMessages(messageHandler);
    getMessages({ conversationId });
    return () => {
      newMessage(newMessageHandler, true); //turn off listener on unmount
      getMessages(messageHandler, true); //turn off listener on unmount
    }
  }, []);
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.5}>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? "padding" : 'height'} style={styles.container}>
        {/* Header */}
        <Header style={styles.header} leftIcon={
          <View style={styles.headerLeft}>
            <BackButton />
            {/* Avatar */}
            <Avatar uri={conversationAvatar as string} size={40} isGroup={type == 'group'} />
            {/* Name */}
            <Typo color={colors.white} fontWeight={'500'} size={22}>{conversationName}</Typo>
          </View>
        } rightIcon={
          <TouchableOpacity style={{ marginBottom: verticalScale(7) }}>

            <Icons.DotsThreeOutlineVertical weight='fill' color={colors.white} />
          </TouchableOpacity>
        } />

        {/* Messages */}
        <View style={styles.content}>
          <FlatList
            data={messages}
            inverted={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageContent}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageItem item={item} isDirect={isDirect} />
            )}
          />


          {/* Input */}
          <View style={styles.footer}>
            <Input
              value={message}
              onChangeText={setMessage}
              containerStyle={{
                paddingLeft: spacingX._10,
                paddingRight: scale(65),
                borderWidth: 1
              }}
              placeholder='Type Message'
              icon={
                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                  <Icons.Plus
                    color={colors.black}
                    weight='bold'
                    size={verticalScale(22)}
                  />
                  {selectedFile && (
                    <Image source={{ uri: selectedFile.uri }}
                      style={styles.selectedFile} />
                  )}

                </TouchableOpacity>
              }
            />
            <View style={styles.inputRightIcon}>
              <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                {loading ?
                  (<Loading size='small' color={colors.black} />) :
                  (<Icons.PaperPlaneTilt
                    color={colors.black}
                    weight='fill'
                    size={verticalScale(22)}
                  />)}
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default Conversation

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._12,
  },
  inputRightIcon: {
    position: 'absolute',
    right: scale(10),
    top: verticalScale(16),
    paddingLeft: spacingX._12,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.neutral300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFile: {
    position: 'absolute',
    top: verticalScale(-4),
    height: verticalScale(40),
    width: verticalScale(40),
    borderRadius: radius.full,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: 'continuous',
    overflow: 'hidden',
    paddingHorizontal: spacingX._15,
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 6,
  },
  footer: {
    paddingTop: spacingY._5,
    paddingBottom: verticalScale(22),
  },
  messageConatiner: {
    flex: 1,
  },
  messageContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12,
  },
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 0,
  }
})