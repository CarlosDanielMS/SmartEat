import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1, 
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between', 
  },
  progressContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  title2: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
    color: '#555',
  },
  legal: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
  listContainer: {
    marginVertical: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  listText: {
    fontSize: 16,
    lineHeight: 22,
  },
  listItemText: {
    flex: 1, 
  },
  textDefault: {
    color: '#555',
  },
  textGood: {
    color: '#28a745', 
    fontWeight: 'bold',
  },
  textBad: {
    color: '#dc3545', 
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30, 
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
});

export default styles;