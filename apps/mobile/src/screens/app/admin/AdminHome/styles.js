import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f9', // Um cinza claro, como no AdminLTE
  },
  container: {
    padding: 16,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: (width / 2) - 24, // Metade da tela, menos o padding
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Para o footer
  },
  statBoxInner: {
    padding: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.3,
  },
  statIcon: {
    fontSize: 40,
  },
  statFooter: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  statFooterText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  logoutButton: {
    marginTop: 32,
  }
});

export default styles;
