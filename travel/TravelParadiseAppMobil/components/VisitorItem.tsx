export default function VisitorItem({ visitor, onToggle, onCommentChange }) {
  return (
    <View>
      <Text>{visitor.nom} {visitor.prenom}</Text>
      <Button title={`Présent: ${visitor.present ? 'Oui' : 'Non'}`} onPress={onToggle} />
      <TextInput value={visitor.commentaire} onChangeText={onCommentChange} />
    </View>
  );
}