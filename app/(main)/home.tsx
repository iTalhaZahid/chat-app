import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { useAuth } from '@/context/authContext'
import Button from '@/components/Button'
import { verticalScale } from '@/utils/styling'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import * as Icons from 'phosphor-react-native';
import { useRouter } from 'expo-router'
import ConversationItem from '@/components/ConversationItem'
import Loading from '@/components/Loading'
import { getConversations, newConversation, newMessage } from '@/socket/socketEvents'
import { ConversationProps, ResponseProps } from '@/types'

const Home = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);


  // const processConversations = (res: ResponseProps) => {
  //   console.log('Response', res)

  //   if (res.success && res.data?.isNew) {
  //     // setConversations(prev => [...prev, res.data]);
  //     setConversations(res.data);
  //   }

  // }

  const processConversations = (res: ResponseProps) => {
    console.log('Response', res);

    if (!res?.success) return;
    if (res.success) {
      setConversations(res.data)
    }

    // If backend returns an array (initial fetch)
    // if (Array.isArray(res.data)) {
    //   setConversations(res.data);
    //   return;
    // }

    // If, in some case, backend sends a single conversation object
    // if (res.data) {
    //   setConversations(prev => {
    //     const exists = prev.find(c => c._id === res.data._id);
    //     if (exists) return prev;
    //     return [res.data, ...prev];
    //   });
    // }
  };


  const newConversationHandler = (res: ResponseProps) => {
    console.log('New Conversation Created', res)
    if (res.success && res.data?.isNew) {
      setConversations(prev => [...prev, res.data,]);
    }
  }

  const newMessageHandler = (res: ResponseProps) => {
    if (res.success) {
      let conversationId = res.data.conversationId;
      setConversations(prev => {
        let updatedConversations = prev.map(c => {
          if (c._id === conversationId) {
           c.lastMessage=res.data;
          }
          return c;
        });
        return updatedConversations;
      });
    }
  }

  useEffect(() => {
    getConversations(processConversations);
    getConversations(null);
    newMessage(newMessageHandler);
    newConversation(newConversationHandler);

    return () => {
      getConversations(processConversations, true); //turn off listener on unmount
      newConversation(newConversationHandler, true); //turn off listener on unmount
      newMessage(newMessageHandler, true); //turn off listener on unmount
    }
  }, []);

  let directConversations = conversations.filter((c: ConversationProps) => c.type == 'direct').sort((a: ConversationProps, b: ConversationProps) => {
    const aDate = a?.lastMessage?.createdAt || a.createdAt;
    const bDate = b?.lastMessage?.createdAt || b.createdAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
  let groupConversations = conversations.filter((c: ConversationProps) => c.type == 'group').sort((a: ConversationProps, b: ConversationProps) => {
    const aDate = a?.lastMessage?.createdAt || a.createdAt;
    const bDate = b?.lastMessage?.createdAt || b.createdAt;
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });


  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <ScreenWrapper showPattern={true} bgOpacity={0.4}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo color={colors.neutral200} size={19} textProps={{ numberOfLines: 1 }}>
              Welcome back,{" "}
              <Typo color={colors.white} size={20} fontWeight={'800'}>
                {user?.name}
              </Typo>
            </Typo>
          </View>
          <TouchableOpacity style={styles.settingIcon} onPress={() => router.push('/(main)/settings')}>
            <Icons.GearSix color={colors.white} size={verticalScale(22)} weight='fill' />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingY._20 }}
          >
            <View style={styles.navBar}>
              <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setSelectedTab(0)} style={[styles.tabStyle, selectedTab === 0 && styles.activeTabStyle]}>
                  <Typo >Direct Messages</Typo>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab(1)} style={[styles.tabStyle, selectedTab === 1 && styles.activeTabStyle]}>
                  <Typo >Groups</Typo>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.conversationList}>
              {
                selectedTab == 0 && directConversations.map((item: ConversationProps, index) => {
                  return (
                    <ConversationItem item={item} key={index}
                      router={router}
                      showDivider={directConversations.length != index + 1} //hide divider for last item
                    />
                  )
                })
              }
              {
                selectedTab == 1 && groupConversations.map((item: ConversationProps, index) => {
                  return (
                    <ConversationItem item={item} key={index}
                      router={router}
                      showDivider={groupConversations.length != index + 1} //hide divider for last item
                    />
                  )
                })
              }
            </View>

            {
              !loading && selectedTab == 0 && directConversations.length == 0 && (
                <Typo style={{ textAlign: 'center' }} >
                  No Direct Messages Found.
                </Typo>)
            }
            {
              !loading && selectedTab == 1 && groupConversations.length == 0 && (
                <Typo style={{ textAlign: 'center' }} >
                  You are not part of any group!
                </Typo>)
            }
            {
              loading && <Loading />
            }

          </ScrollView>

        </View>
      </View>
      <Button
        style={styles.floatingButton} onPress={() => router.push({
          pathname: '/(main)/newConversationModal',
          params: { isGroup: selectedTab }
        })}>
        <Icons.Plus size={verticalScale(24)} color={colors.white} weight='bold' />
      </Button>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activeTabStyle: {
    backgroundColor: colors.primaryLight,
  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: 'absolute',
    bottom: verticalScale(40),
    right: verticalScale(20),
  },
  tabs: {
    flexDirection: 'row',
    gap: spacingX._10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    gap: spacingX._15,
    alignItems: 'center',
    paddingHorizontal: spacingX._10,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    borderCurve: 'continuous',
    overflow: 'hidden',
    paddingHorizontal: spacingX._20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    paddingTop: spacingY._15,
    paddingBottom: spacingY._20,
  },
  tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  }


})