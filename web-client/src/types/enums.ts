export enum DeliveryStatus {
  open = 'open',
  picked_up = 'picked-up',
  in_transit = 'in-transit',
  delivered = 'delivered',
  failed = 'failed',
}

export enum ListeningEvents {
  location_changed = 'location_changed',
  status_changed = 'status_changed',
}
