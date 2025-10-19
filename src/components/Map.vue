<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken =
  'pk.eyJ1IjoiaHpoYTAzNzIiLCJhIjoiY21ndzdoNTEwMGNsczJzcHJ4a3J0czZxdyJ9.CCr0Z2lwroR2PyhJTR41Kg'

export default {
  props: ['modelValue'],

  mounted() {
    const { center, zoom } = this.modelValue
    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/standard',
      center,
      zoom,
    })

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: 'Search for a place...',
    })
    map.addControl(geocoder, 'top-left')

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
    })
    map.addControl(directions, 'top-right')

    const updateLocation = () => this.$emit('update:modelValue', this.getLocation())
    map.on('move', updateLocation)
    map.on('zoom', updateLocation)
    this.map = map
  },

  unmounted() {
    this.map.remove()
    this.map = null
  },

  watch: {
    modelValue(next) {
      if (!this.map) return
      const curr = this.getLocation()
      if (
        curr.center.lng !== next.center.lng ||
        curr.center.lat !== next.center.lat ||
        curr.zoom !== next.zoom
      ) {
        this.map.flyTo({
          center: next.center,
          zoom: next.zoom,
        })
      }
    },
  },

  methods: {
    getLocation() {
      return {
        center: this.map.getCenter(),
        zoom: this.map.getZoom(),
      }
    },
  },
}
</script>

<style>
.map-wrapper {
  width: 100%;
  height: 80vh;
  position: relative;
}
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}
</style>
