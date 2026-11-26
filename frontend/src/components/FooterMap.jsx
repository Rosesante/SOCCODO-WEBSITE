
import React from 'react'
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  ZoomControl,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './FooterMap.css'

const FooterMap = () => {
  // Approximate center of Songwe Region, not SOCCODO's office.
  const songweCenter = [-9.01, 32.80]

  return (
    <section className="footer-map-section">
      <div className="footer-map-heading">
        <span>WHERE WE WORK</span>
        <h2>Serving Communities in Songwe</h2>
        <p>
          SOCCODO carries out field activities and community training
          programs across Songwe Region, Tanzania.
        </p>
      </div>

      <div className="footer-map-frame">
        <MapContainer
          center={songweCenter}
          zoom={8}
          scrollWheelZoom={false}
          zoomControl={false}
          className="footer-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ZoomControl position="topright" />

          <Circle
            center={songweCenter}
            radius={18000}
            pathOptions={{
              color: '#2e5799',
              fillColor: '#597ebe',
              fillOpacity: 0.18,
              weight: 2,
            }}
          >
            <Popup>
              <strong>SOCCODO operating area</strong>
              <br />
              Approximate area in Songwe Region, Tanzania.
              This is not an office location or an official regional boundary.
            </Popup>
          </Circle>
        </MapContainer>
      </div>

      <a
        className="footer-map-link"
        href="https://www.openstreetmap.org/#map=8/-9.01/32.80"
        target="_blank"
        rel="noreferrer"
      >
        Explore Songwe on OpenStreetMap ↗
      </a>
    </section>
  )
}

export default FooterMap
