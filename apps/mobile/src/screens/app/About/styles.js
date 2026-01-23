import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 8 },
  version: { fontSize: 13, color: '#777', marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 6 },
  text: { fontSize: 13, color: '#555', marginBottom: 4 },
});

export default styles;