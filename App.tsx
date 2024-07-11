import * as React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerAsset } from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export default function App() {
  const handlePress = async () => {
    console.log("handlePress");
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });
    if (result.canceled === false) {
      const assets: DocumentPickerAsset[] = result.assets;
      for (const asset of assets) {
        console.log("-------------------- DocumentPickerAsset: ");
        console.log(asset);
        await handleOneDocument(asset, 1024 * 64, async (fileData, partseq) => {
          console.log("partseq: ", partseq);
        })
      }
    } else {
      console.log("cancelled");
    }
  };

  return (
    <View>
      <Pressable style={styles.container} onPress={handlePress}>
        <Text>Open Document</Text>
      </Pressable>
    </View>
  );
}

async function handleOneDocument(
  asset: DocumentPickerAsset,
  chunkSize: number,
  asyncCb: (fileData: string, partseq: number) => Promise<void>
) {
  console.log("handleOneDocument start");
  let readingOption: FileSystem.ReadingOptions = {
    encoding: FileSystem.EncodingType.Base64,
    position: 0,
    length: chunkSize,
  };
  let partseq = 0;
  console.log("asset.size: ", asset.size);
  while (readingOption.position < asset.size) {
    console.log("readingOption.position: ", readingOption.position);
    const fileData = await FileSystem.readAsStringAsync(asset.uri, readingOption);
    await asyncCb(fileData, partseq);
    partseq++;
    readingOption.position += chunkSize;
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: 400,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: "#2196F3",
    margin: 10,
    minWidth: 50,
  },
});
