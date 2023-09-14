/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import {Clock, LocalDateTime, ZonedDateTime, ZoneId} from '@js-joda/core';
import notifee from '@notifee/react-native';
import {
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native/src/types/Trigger';
import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [notificationIds, setNotificationIds] = useState<string[]>();

  useEffect(() => {}, []);

  useEffect(() => {
    notifee.requestPermission();
    notifee.createChannel({
      id: 'test',
      name: 'test channel',
      badge: true,
    });
    updateNotificationIds();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const updateNotificationIds = () => {
    notifee.getTriggerNotificationIds().then(setNotificationIds);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.text}>Scheduled notification ids:</Text>
          <Text style={styles.text}>
            {JSON.stringify(notificationIds, undefined, 2)}
          </Text>
          <View style={styles.button}>
            <Button
              title={'delete all notifications'}
              onPress={async () => {
                await notifee.cancelAllNotifications();
                setTimeout(updateNotificationIds, 100);
              }}
            />
          </View>

          <View style={styles.button}>
            <Button
              onPress={async () => {
                const fireDateTime = LocalDateTime.now().plusMinutes(2);
                await notifee.createTriggerNotification(
                  {
                    id: `${fireDateTime.toString()}-Daily`,
                    body: `scheduled at ${fireDateTime.toString()}`,
                    android: {
                      channelId: 'test',
                    },
                  },
                  {
                    type: TriggerType.TIMESTAMP,
                    timestamp:
                      ZonedDateTime.of(
                        fireDateTime,
                        Clock.systemDefaultZone().zone(),
                      )
                        .withZoneSameInstant(ZoneId.UTC)
                        .toEpochSecond() * 1000,
                    repeatFrequency: RepeatFrequency.DAILY,
                  },
                );
                setTimeout(updateNotificationIds, 100);
              }}
              title={'Schedule a notification in 2 minutes'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    margin: 15,
  },
  button: {
    margin: 15,
  },
});
