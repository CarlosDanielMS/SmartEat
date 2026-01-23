import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, paddingBottom: 32 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#555' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  monthCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
  },
  monthTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  line: { fontSize: 13, color: '#555', marginBottom: 2 },
  value: { fontWeight: '600', color: '#2E7D32' },
  empty: { fontSize: 12, color: '#999', fontStyle: 'italic' },
});

export default styles;