import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
    fontSize: 14,
  },
  goalRow: { flexDirection: 'row', marginTop: 8 },
  goalChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  goalChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  goalChipText: { fontSize: 12, color: '#555' },
  goalChipTextActive: { color: '#fff', fontWeight: '600' },
  saveButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveText: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 8 },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
});

export default styles;