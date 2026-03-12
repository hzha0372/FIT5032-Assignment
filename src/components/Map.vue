<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || ''
mapboxgl.accessToken = mapboxToken

export default {
  props: ['modelValue'],

  mounted() {
    if (!mapboxToken) {
      return
    }
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

    this.marker = new mapboxgl.Marker({ color: '#ff7a59' })
      .setLngLat(center)
      .addTo(map)

    const updateLocation = () => this.$emit('update:modelValue', this.getLocation())
    map.on('move', updateLocation)
    map.on('zoom', updateLocation)
    map.on('click', (event) => {
      this.marker.setLngLat(event.lngLat)
      this.$emit('update:modelValue', {
        center: event.lngLat,
        zoom: this.map.getZoom(),
      })
    })
    this.map = map
  },

  unmounted() {
    this.map.remove()
    this.marker = null
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
        if (this.marker) {
          this.marker.setLngLat(next.center)
        }
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
