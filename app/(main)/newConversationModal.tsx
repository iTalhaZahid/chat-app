import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import Avatar from '@/components/Avatar';
import * as ImagePicker from 'expo-image-picker';
import Input from '@/components/Input';
import Typo from '@/components/Typo';
import { useAuth } from '@/context/authContext';
import { verticalScale } from '@/utils/styling';
import Button from '@/components/Button';
import { getContacts } from '@/socket/socketEvents';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const NewConversationModal = () => {
  const { user: currentUser } = useAuth();
  const { isGroup } = useLocalSearchParams();
  const isGroupMode = isGroup == '1';
  const router = useRouter();
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const [groupName, setGroupName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const createGroup = async () => {
    // Logic to create group conversation
    if (!groupName.trim()) {
      Alert.alert("Validation Error", "Group name cannot be empty.");
      return;
    }
  }

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const toggleParticipantSelection = (user: any) => {
    setSelectedParticipants((prev: any) => {
      if (prev.includes(user.id)) {
        return prev.filter((id: string) => id !== user.id);
      } else {
        return [...prev, user.id];
      }
    })
  }

  const onSelectUser = (user: any) => {
    if (!currentUser) {
      Alert.alert("Authentication Error", "Please log in to start a conversation.");
      return;
    }

    if (isGroupMode) {
      toggleParticipantSelection(user);

    } else {
      // Direct conversation logic
    }
  }

  // Pick image from gallery
  const pickImage = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    // console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      setGroupAvatar({ uri: result.assets[0].uri });
    }
  };

  // const contacts = [
  //   { id: '1', name: 'John Doe', avatar: "https://i.pravatar.cc/150?img=11" },
  //   { id: '2', name: 'Jane Smith', avatar: "https://i.pravatar.cc/150?img=12" },
  //   { id: '3', name: 'Alice Johnson', avatar: "https://i.pravatar.cc/150?img=13" },
  //   { id: '4', name: 'Bob Brown', avatar: "https://i.pravatar.cc/150?img=14" },
  //   { id: '5', name: 'Charlie Davis', avatar: "https://i.pravatar.cc/150?img=15" },
  //   { id: '6', name: 'Diana Evans', avatar: "https://i.pravatar.cc/150?img=16" },
  // ]

  const [contacts, setContacts] = useState([]);
  const processGetContacts = (res: any) => {
    console.log("Received contacts:", res);
    if (res?.success) {
      setContacts(res.contacts);
    }
  }

  useEffect(() => {
    //fetch contacts from socket
    getContacts(processGetContacts);
    getContacts(null); //emit event to request contacts

    return () => {
      getContacts(processGetContacts, true);
    }
  }, [])

  return (
    <ScreenWrapper isModal={true}>
      <View style={styles.container}>
        <Header
          title={isGroupMode ? "New Group" : "Select User"}
          leftIcon={<BackButton color={colors.black} />}
        />
        {isGroupMode && (
          <View style={styles.goupInfoContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage}>
                <Avatar uri={groupAvatar?.uri || null} isGroup={true} size={100} />
              </TouchableOpacity>
            </View>
            <View style={styles.groupNameContainer}>
              <Input
                placeholder='Group Name'
                value={groupName}
                onChangeText={setGroupName} />
            </View>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contactList}>
          {

            contacts.map((user: any, index) => {
              const isSelected = selectedParticipants.includes(user.id)
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.contactRow, isSelected && styles.selectedContact]}
                  onPress={() => onSelectUser(user)}>
                  <Avatar uri={user.avatar} size={45} />
                  <Typo fontWeight={'500'}>{user.name}</Typo>
                  {isGroupMode &&
                    <View style={styles.selectionIndicator}>
                      <View style={[styles.checkbox, isSelected && styles.checked]} />
                    </View>
                  }
                </TouchableOpacity>
              );
            })}

        </ScrollView>

        {isGroupMode && selectedParticipants.length >= 2 && (
          <View style={styles.createGroupButton}>
            <Button
              onPress={createGroup}
              disabled={!groupName.trim()}
              loading={isLoading}
            >
              <Typo fontWeight={'bold'} size={17}>Create Group</Typo>
            </Button>
          </View>
        )}
      </View>
    </ScreenWrapper>
  )
}

export default NewConversationModal

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacingX._15,
    flex: 1,
  },
  goupInfoContainer: {
    alignItems: 'center',
    marginTop: spacingY._10,
  },
  avatarContainer: {
    marginBottom: spacingY._10,
  },
  groupNameContainer: {
    width: '100%'
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
    paddingVertical: spacingY._5,
  },
  selectedContact: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
  },
  contactList: {
    gap: spacingY._12,
    marginTop: spacingY._10,
    marginBottom: spacingY._10,
    paddingBottom: verticalScale(140),
  },
  selectionIndicator: {
    marginLeft: 'auto',
    marginRight: spacingX._10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  createGroupButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  }
})