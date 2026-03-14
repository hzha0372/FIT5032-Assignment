<template>
  <div class="map-wrapper" :style="{ height: resolvedHeight }">
    <div v-if="hasToken" ref="mapContainer" class="map-container"></div>

    <div v-else class="fallback" @click="onFallbackClick" role="application" aria-label="Map fallback">
      <img class="fallback-image" :src="fallbackSrc" alt="Melbourne map" />
      <div class="fallback-pin" :style="fallbackPinStyle" aria-hidden="true"></div>
      <div class="fallback-banner">
        Mapbox token not configured. Using fallback map.
      </div>
    </div>
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
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    height: {
      type: String,
      default: '80vh',
    },
  },

  computed: {
    resolvedHeight() {
      return this.height || '80vh'
    },
    hasToken() {
      return Boolean(mapboxToken)
    },
    fallbackBounds() {
      return {
        minLat: -38.20,
        maxLat: -37.55,
        minLng: 144.55,
        maxLng: 145.45,
      }
    },
    fallbackSrc() {
      const center = this.modelValue?.center || { lng: 144.9631, lat: -37.8136 }
      const zoom = 11
      return `https://staticmap.openstreetmap.de/staticmap.php?center=${center.lat},${center.lng}&zoom=${zoom}&size=820x420&maptype=mapnik&markers=${center.lat},${center.lng},red-pushpin`
    },
    fallbackPinStyle() {
      const center = this.modelValue?.center || { lng: 144.9631, lat: -37.8136 }
      const { minLat, maxLat, minLng, maxLng } = this.fallbackBounds

      const xPct = (center.lng - minLng) / (maxLng - minLng)
      const yPct = (maxLat - center.lat) / (maxLat - minLat)

      const clampedX = Math.min(0.98, Math.max(0.02, xPct))
      const clampedY = Math.min(0.98, Math.max(0.02, yPct))

      return {
        left: `${clampedX * 100}%`,
        top: `${clampedY * 100}%`,
      }
    },
  },

  mounted() {
    if (!mapboxToken) return
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
      marker: false,
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
    geocoder.on('result', (event) => {
      const coords = event?.result?.center
      if (!coords || coords.length !== 2) return
      const [lng, lat] = coords
      this.marker.setLngLat({ lng, lat })
      this.$emit('update:modelValue', {
        center: { lng, lat },
        zoom: this.map.getZoom(),
      })
    })
    this.map = map
  },

  unmounted() {
    if (this.map) {
      this.map.remove()
    }
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
    onFallbackClick(event) {
      const target = event.currentTarget
      if (!target) return
      const rect = target.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height

      const { minLat, maxLat, minLng, maxLng } = this.fallbackBounds
      const lng = minLng + x * (maxLng - minLng)
      const lat = maxLat - y * (maxLat - minLat)

      this.$emit('update:modelValue', {
        center: { lng, lat },
        zoom: this.modelValue?.zoom || 11,
      })
    },
  },
}
</script>

<style>
.map-wrapper {
  width: 100%;
  position: relative;
}
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.fallback {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.14);
  cursor: crosshair;
}

.fallback-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fallback-pin {
  position: absolute;
  transform: translate(-50%, -100%);
  width: 16px;
  height: 16px;
  border-radius: 50% 50% 50% 0;
  background: #ef4444;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.25);
}

.fallback-banner {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.78);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
</style>
