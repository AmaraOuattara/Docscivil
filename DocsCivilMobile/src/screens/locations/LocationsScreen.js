import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/config';
import ApiService from '../../services/apiService';

const LocationsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('communes');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'communes', title: 'Communes', icon: 'business-outline' },
    { id: 'localites', title: 'Localités', icon: 'location-outline' },
    { id: 'zones', title: 'Zones', icon: 'map-outline' },
    { id: 'juridictions', title: 'Juridictions', icon: 'library-outline' },
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'communes':
          response = await ApiService.getCommunes();
          break;
        case 'localites':
          response = await ApiService.getLocalites();
          break;
        case 'zones':
          response = await ApiService.getZones();
          break;
        case 'juridictions':
          response = await ApiService.getJuridictions();
          break;
        default:
          response = { data: [] };
      }
      setData(response.data || []);
    } catch (error) {
      console.log('Error loading data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const LocationCard = ({ item }) => {
    const getDisplayFields = () => {
      switch (activeTab) {
        case 'communes':
          return {
            title: item.Com_libelle,
            reference: item.Com_reference,
            subtitle: item.Com_description || 'Commune',
          };
        case 'localites':
          return {
            title: item.Loc_libelle,
            reference: item.Loc_reference,
            subtitle: item.Loc_description || 'Localité',
          };
        case 'zones':
          return {
            title: item.Zon_libelle,
            reference: item.Zon_reference,
            subtitle: item.Zon_description || 'Zone',
          };
        case 'juridictions':
          return {
            title: item.Jur_libelle,
            reference: item.Jur_reference,
            subtitle: item.Jur_description || 'Juridiction',
          };
        default:
          return { title: 'Unknown', reference: 'N/A', subtitle: '' };
      }
    };

    const { title, reference, subtitle } = getDisplayFields();

    return (
      <TouchableOpacity style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Ionicons
            name={tabs.find(tab => tab.id === activeTab)?.icon || 'location-outline'}
            size={24}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>{title}</Text>
          <Text style={styles.locationReference}>Réf: {reference}</Text>
          <Text style={styles.locationSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name={tabs.find(tab => tab.id === activeTab)?.icon || 'location-outline'}
        size={64}
        color={COLORS.textSecondary}
      />
      <Text style={styles.emptyStateTitle}>Aucune donnée disponible</Text>
      <Text style={styles.emptyStateText}>
        Aucun(e) {tabs.find(tab => tab.id === activeTab)?.title.toLowerCase()} trouvé(e)
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? COLORS.surface : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.length}</Text>
          <Text style={styles.statLabel}>
            {tabs.find(tab => tab.id === activeTab)?.title}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            Chargement des {tabs.find(tab => tab.id === activeTab)?.title.toLowerCase()}...
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${activeTab}-${index}`}
          renderItem={({ item }) => <LocationCard item={item} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabsContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginHorizontal: SPACING.xs,
    backgroundColor: COLORS.background,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: TYPOGRAPHY.fontWeights.medium,
  },
  activeTabText: {
    color: COLORS.surface,
  },
  statsContainer: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSizes.xxxl,
    fontWeight: TYPOGRAPHY.fontWeights.bold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  listContainer: {
    padding: SPACING.lg,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: TYPOGRAPHY.fontSizes.lg,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  locationReference: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  locationSubtitle: {
    fontSize: TYPOGRAPHY.fontSizes.sm,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.fontSizes.xl,
    fontWeight: TYPOGRAPHY.fontWeights.semibold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default LocationsScreen;