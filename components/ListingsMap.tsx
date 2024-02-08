import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useRef, memo } from "react";
import { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { FontAwesome6 } from "@expo/vector-icons";
import { ListingGeo } from "@/interfaces/listingGeo";
import { useRouter } from "expo-router";
import MapView from "react-native-map-clustering";
interface Props {
  listings: any;
}

const initialRegion = {
  latitude: 52.52,
  longitude: 13.405,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const ListingsMap = memo(({ listings }: Props) => {
  const router = useRouter();
  const onMarkerSelected = (item: ListingGeo) => {
    router.push(`/listing/${item.properties.id}`);
  };

  const mapRef = useRef<MapView | null>(null);

  const goToInitialLocation = () => {
    (mapRef.current as any)?.animateToRegion(initialRegion, 3000);
  };

  const renderCluster = (cluster: any) => {
    const { geometry, onPress, id, properties } = cluster;
    const points = properties.point_count;

    return (
      <Marker
        onPress={onPress}
        key={`cluster-${id}`}
        coordinate={{
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        }}
      >
        <View style={styles.marker}>
          <Text style={{color:'black', textAlign:"center", fontFamily:"mon-sb"}}>{points}</Text>
        </View>
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        scrollEnabled={true}
        animationEnabled={false}
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        clusterColor="white"
        clusterTextColor="black"
        clusterFontFamily="mon-sb"
        renderCluster={renderCluster}
      >
        {listings.features.map((item: ListingGeo) => (
          <Marker
            onPress={() => onMarkerSelected(item)}
            key={item.properties.id}
            coordinate={{
              latitude: +item.properties.latitude,
              longitude: +item.properties.longitude,
            }}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>€ {item.properties.price}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity style={styles.button} onPress={goToInitialLocation}>
        <FontAwesome6 name="location-crosshairs" size={24} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: 90,
    right: 20,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
  },
  marker: {
    backgroundColor: "white",
    padding: 6,
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  markerText: {
    fontSize: 16,
    fontFamily: "mon-sb",
  },
});

export default ListingsMap;
