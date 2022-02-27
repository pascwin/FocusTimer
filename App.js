import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Focus from './src/features/Focus/Focus';
import { FocusHistory } from './src/features/Focus/FocusHistory';
import { colors } from './src/utils/colors';
import { Timer } from './src/features/timer/Timer';
import { spacing } from './src/utils/sizes';

const STATUSES = {
  COMPLETE: 1,
  CANCELLED: 2
}

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null)
  const [focusHistory, setFocusHistory] = useState([])

  const addFocusHistorySubjectWithState = (subject, status) => {
    setFocusHistory([...focusHistory, { key: String(focusHistory.length + 1) ,subject, status }])
  }

  const onClear = () => {
    setFocusHistory([])
  }

  const saveFocusHistory = async() => {
    try {
      AsyncStorage.setItem("focusHistory", JSON.stringify(focusHistory))
    } catch (err) {
      console.log(err)
    }
  }

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("focusHistory")

      if (history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history))
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadFocusHistory()
  }, [])

  useEffect(() => {
    saveFocusHistory();
  }, [focusHistory])

  console.log(focusHistory)
  return (
    <View style={styles.container}>
      {focusSubject ?
        (<Timer focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUSES.COMPLETE)
            setFocusSubject(null)
          }}
          clearSubject={() => {
            setFocusSubject(null)
            addFocusHistorySubjectWithState(focusSubject, STATUSES.CANCELLED)
          }}

        />)
        : (
          <>
            <Focus addSubject={setFocusSubject} />
            <FocusHistory focusHistory={focusHistory} onClear={onClear}/>
          </>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.lg,
    backgroundColor: colors.darkBlue,
  },
});
