import AnimatedBackground from '@/components/AnimatedBackground';
import CustomHeader from '@/components/CustomHeader';
import GateCard from '@/components/GateCard';
import { borderRadius, colors, spacing } from '@/constants/theme';
import { api } from '@/services/api';
import { Gate } from '@/types/api';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Gates() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [filteredGates, setFilteredGates] = useState<Gate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGates();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGates(gates);
    } else {
      const filtered = gates.filter((gate) =>
        gate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gate.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGates(filtered);
    }
  }, [searchQuery, gates]);

  const loadGates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getGates();
      setGates(data);
      setFilteredGates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gates');
      console.error('Error loading gates:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <CustomHeader />
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search gates..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.text.tertiary}
            style={styles.clearIcon}
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>
      
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.accent.lavender} />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredGates}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => <GateCard gate={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(49, 61, 110, 0.4)',
    borderWidth: 1,
    borderColor: colors.accent.lavender,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    paddingVertical: spacing.md,
  },
  clearIcon: {
    marginLeft: spacing.sm,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
