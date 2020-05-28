import { GOOGLE_MAPS_KEY } from '../config/apiKey'

export const getLatLongByAddress = async stringAddress => {
  const address = encodeURIComponent(stringAddress)

  const latLong = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_KEY}`
  )
    .then(res => res.json())
    .then(res => {
      const result = res.results
      const geo = result[0] && result[0].geometry
      const location = geo && geo.location
      return location ? location : {}
    })

  if (latLong) return latLong
}

export const getDistance = async (srcLatLong, desLatLong) => {
  const distance = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${
      srcLatLong.lat
    },${srcLatLong.lng}&destinations=${desLatLong.lat},${
      desLatLong.lng
    }&key=${GOOGLE_MAPS_KEY}`
  )
    .then(res => res.json())
    .then(res => {
      const distanceRows = res.rows && res.rows[0]
      const elements = distanceRows && distanceRows.elements
      const selectedElement = elements && elements[0]
      const distance = selectedElement.distance
      return distance
        ? {
            ...distance,
            origin_addresses: res.origin_addresses[0],
            destination_addresses: res.destination_addresses[0]
          }
        : {}
    })

  if (distance) return distance
}
