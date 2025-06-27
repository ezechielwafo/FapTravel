import { Text, TouchableOpacity, View } from 'react-native';

export default function VisitCard({ visit, onPress }: { visit: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10, borderBottomWidth: 1 }}>
      <Text style={{ fontWeight: 'bold' }}>{visit.lieu}</Text>
      <Text>{visit.date} à {visit.heureDebut}</Text>
      <Text>Guide : {visit.guide.nom}</Text>
    </TouchableOpacity>
  );
}