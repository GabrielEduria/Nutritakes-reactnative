// import React from "react";
// import { Button, Modal, StyleSheet, Text, View } from "react-native";

// type AppModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   title: string;
//   children?: React.ReactNode;
// };

// export default function AppModal({ visible, onClose, title, children }: AppModalProps) {
//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.centeredView}>
//         <View style={styles.modalView}>
//           <Text style={styles.title}>{title}</Text>
//           {children}
//           <Button title="Close" onPress={onClose} />
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.3)",
//   },
//   modalView: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//     width: "80%",
//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 18,
//     marginBottom: 10,
//     fontWeight: "bold",
//   },
// });
