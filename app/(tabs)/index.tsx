import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  FlatList,
  useWindowDimensions,
} from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Collapsible } from '@/components/Collapsible';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const [newWord, setNewWord] = useState<string>('');
  const [checkedWord, setCheckedWord] = useState('');
  const [definition, setDefinition] = useState<Array<any>>([]);
  const [example, setExample] = useState<Array<any>>([]);
  const [sound, setSound] = useState<Sound | null>(null);
  const [phonetic, setPhonetic] = useState<string | null>(null);
  const [antonyms, setAntonyms] = useState<Array<any>>([]);
  const [synonyms, setSynonyms] = useState<Array<any>>([]);

  const [data, setData] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  const [partOfSpeech, setPartOfSpeech] = useState<Array<any>>([]);

  const {width: screenWidth} = useWindowDimensions();

  let numColumns = 1;

  if(screenWidth > 1440 ) {
	numColumns = 3
  }
  else if (screenWidth > 1180) {
	numColumns = 2
  }

  const styles = StyleSheet.create({
	//Search
	searchContainer: {
	  flexDirection: 'row',
	},

	input: {
	  flex: 1,
	  padding: 15,
	  fontSize: 20,
	  backgroundColor: 'rgba(255, 255, 255, 0.8)',
	  borderRadius: 20,
	  margin: 4
	},

	//Error
	errorText: {
	  color: Colors.red,
	  fontSize: 20,
	  marginTop: 10,
	},
  
	buttonText: {
	  color: '#fff',
	  fontWeight: 'bold',
	  fontSize: 20,
	},

	//Results
	resultsContainer: {
	  alignItems: 'center',
	  borderRadius: 10,
	  padding: 20,
	  height: 600,
	},
	word: {
	  fontSize: 22,
	  fontWeight: 'bold',
	  marginBottom: 10,
	  alignSelf: 'center',
	},
	playButton: {
	  backgroundColor: Colors.secondary,
	  width: 60,
	  height: 60,
	  borderRadius: 30,
	  alignItems: 'center',
	  justifyContent: 'center',
	  margin: 20,

	},

	resultText: {
	  fontSize: 20,
	  marginBottom: 10,
	},

	card: {
	  backgroundColor: 'white',
	  borderRadius: 15,
	  padding: 15,
	  margin: 5,
	  width: screenWidth > 620 ? 550: 260,
	  height: 350,
	  overflowY: 'scroll',
	},

	//Clear
	clearButton: {
	  backgroundColor: Colors.red,
	  padding: 15,
	  marginTop: 20,
	  borderRadius: 10,
	},
  });

  const searchWord = (enteredWord: string) => {
    setNewWord(enteredWord);
  };

  const getInfo = async () => {
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + newWord;

    try {
      const response = await fetch(url);
      const fetchedData = await response.json();

      if (response.status === 200) {
        // Successful response
        setData(fetchedData);

        let word = fetchedData[0].word;
        setCheckedWord(word);

        setSound(fetchedData[0]?.phonetics[0]?.audio);

        setPhonetic(fetchedData[0]?.phonetic);

        const defArray = [];
        const exampleArray = [];
        const partOfSpeechArray = [];

        const antonymsArray = [];

        const synonymsArray = [];

        for (const x in fetchedData) {
          for (const m in fetchedData[x].meanings) {

            antonymsArray.push(
              fetchedData[x].meanings[m]?.antonyms?.length === 0
                ? null
                : [...fetchedData[x].meanings[m]?.antonyms]
            );

            synonymsArray.push(
              fetchedData[x].meanings[m]?.synonyms?.length === 0
                ? null
                : [...fetchedData[x].meanings[m]?.synonyms]
            );

            for (const d in fetchedData[x].meanings[m].definitions) {
              exampleArray.push(
                fetchedData[x].meanings[m].definitions[d]?.example
              );

              defArray.push(
                fetchedData[x].meanings[m].definitions[d]?.definition
              );

			  partOfSpeechArray.push(fetchedData[x].meanings[m]?.partOfSpeech);

            }
          }
        }

        setExample(exampleArray);
        setDefinition(defArray);
        setPartOfSpeech(partOfSpeechArray);
        setAntonyms(antonymsArray);
        setSynonyms(synonymsArray);

        setError(null);
      } else {
        setError('Word not found in the database');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching data');
    }
  };

  const playAudio = async () => {
    if (
      data &&
      data[0].phonetics &&
      data[0].phonetics[0] &&
      data[0].phonetics[0].audio
    ) {
      const audioUri = data[0].phonetics[0].audio;

      const { sound, status } = await Audio.Sound.createAsync({
        uri: audioUri,
      });

      if (status.isLoaded && sound) {
        setSound(sound);
        await sound?.playAsync();
      }
    }
  };

  const clear = async () => {
    setCheckedWord('');
    setDefinition([]);
    setExample([]);
    setPhonetic(null);
    setNewWord('');
    setSound(null);
    setPartOfSpeech([]);
  };

  return (
    <ParallaxScrollView title="Dictionary App">
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={newWord}
          onChangeText={(text) => searchWord(text)}
          placeholder="Search..."
		  autoFocus={true}
          onSubmitEditing={() => getInfo()}
        />
      </View>
      {error && <Text style={styles.errorText} >{error}</Text>}
      {checkedWord && !error && (
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <Text style={styles.word}>{checkedWord}</Text>
		  {phonetic && <Text style={styles.resultText} >{phonetic}</Text>}
          {sound && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => playAudio()}
              activeOpacity={0.7}
            >
              <IconSymbol
                name="speaker.wave.2"
                size={20}
                weight="light"
                color={Colors.white}
              />
            </TouchableOpacity>
          )}
          <View>
            <FlatList
              data={definition}
              numColumns={numColumns}
			  key={`col-${numColumns}`}
              renderItem={({ item, index }) => (
                <>
                  <View style={styles.card} accessible={true}>
                    {partOfSpeech[index] && (
                      <Text key={`pos-${index}`} style={styles.word}>
                        {partOfSpeech[index]}
                      </Text>
                    )}
                    <Text key={`def-${index}`} style={styles.resultText}>
                      Definition: {item}
                    </Text>
                    {example[index] && (
                      <Text key={`ex-${index}`} style={styles.resultText}>
                        Example: {example[index]}
                      </Text>
                    )}
                    {synonyms[index] && (
                      <Collapsible title="Synonyms">
                        {synonyms[index]?.join(', ')}
                      </Collapsible>
                    )}
                    {antonyms[index] && (
                      <Collapsible title="Antonyms">
                        {antonyms[index]?.join(', ')}
                      </Collapsible>
                    )}
                  </View>
                </>
              )}
            />
          </View>
        </ScrollView>
      )}
      {checkedWord && !error && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => clear()}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      )}
    </ParallaxScrollView>
  );
}


