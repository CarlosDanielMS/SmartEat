import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';

import { supabase } from '../lib/supabase';

export default function TacoFoodsScreen() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('taco_micros')
        .select('*')
        .order('nome_do_alimento', { ascending: true });


      console.log('Supabase error:', error);
      console.log('Rows:', data?.length);

      if (error) throw error;
      setFoods(data ?? []);
    } catch (e) {
      console.error('Erro ao buscar alimentos:', e);
      Alert.alert('Erro', 'Não foi possível carregar os alimentos do banco.');
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter((food) =>
      String(food.nome_do_alimento ?? '').toLowerCase().includes(q)
    );
  }, [foods, search]);

  const handleAddFood = (food) => {
    // aqui você integra com sua lógica (ex.: salvar no diário)
    Alert.alert('Adicionado', food.nome_do_alimento);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleAddFood(item)}>
      <Text style={styles.foodName}>{item.nome_do_alimento}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Macronutrientes (por 100g)</Text>
        <Text style={styles.nutrient}>Energia: {item.energia_kcal ?? '-'} kcal</Text>
        <Text style={styles.nutrient}>Proteína: {item.proteina_g ?? '-'} g</Text>
        <Text style={styles.nutrient}>Lipídeos: {item.lipideos_g ?? '-'} g</Text>
        <Text style={styles.nutrient}>Carboidratos: {item.carboidrato_g ?? '-'} g</Text>
        <Text style={styles.nutrient}>Fibra: {item.fibra_g ?? '-'} g</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Micronutrientes</Text>
        <Text style={styles.nutrient}>Cálcio: {item.calcio_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Magnésio: {item.magnesio_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Ferro: {item.ferro_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Sódio: {item.sodio_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Potássio: {item.potassio_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Vit. B1: {item.vitamina_b1_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Vit. B2: {item.vitamina_b2_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Vit. B6: {item.vitamina_b6_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Vit. B3: {item.vitamina_b3_mg ?? '-'} mg</Text>
        <Text style={styles.nutrient}>Vit. C: {item.vitamina_c_mg ?? '-'} mg</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar alimento..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum alimento encontrado (ou tabela sem dados).
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  searchInput: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  list: { padding: 16 },

  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },

  section: { marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#4CAF50', marginBottom: 4 },
  nutrient: { fontSize: 13, color: '#666', marginLeft: 8 },
});
