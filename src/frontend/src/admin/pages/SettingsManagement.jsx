import React, { useEffect, useState } from 'react'
import { settingsApi } from '../services/adminService'

const TABS = [
  'Store Profile',
  'Tax Settings',
  'Payment Settings',
  'Delivery Settings',
  'Notifications',
  'Inventory',
  'Orders',
  'Prescriptions',
  'Security',
  'Backup',
]

function FieldRow({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  )
}

export default function SettingsManagement() {
  const [settings, setSettings] = useState(null)
  const [active, setActive] = useState('Store Profile')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await settingsApi.get()
      setSettings(res.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const update = async (sectionPayload) => {
    setSaving(true)
    try {
      const payload = sectionPayload
      await settingsApi.update(payload)
      alert('Settings saved')
      fetch()
    } catch (err) {
      console.error(err)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) return <div className='admin-card'>Loading settings…</div>

  // helpers to render sections
  const StoreProfile = () => (
    <div>
      <FieldRow label='Store Name'>
        <input defaultValue={settings.store?.store_name || settings.store_name || ''} id='store_name' />
      </FieldRow>
      <FieldRow label='Email'>
        <input defaultValue={settings.store?.store_email || settings.store_email || ''} id='store_email' />
      </FieldRow>
      <FieldRow label='Customer Support Number'>
        <input defaultValue={settings.store?.support_phone || settings.support_phone || ''} id='support_phone' />
      </FieldRow>
      <FieldRow label='GST Number'>
        <input defaultValue={settings.store?.gst_number || settings.gst_number || ''} id='gst_number' />
      </FieldRow>
      <FieldRow label='PAN Number'>
        <input defaultValue={settings.store?.pan_number || settings.pan_number || ''} id='pan_number' />
      </FieldRow>
      <FieldRow label='Address'>
        <textarea defaultValue={settings.store?.address || settings.address || ''} id='address' rows={3} />
      </FieldRow>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <FieldRow label='City'>
            <input defaultValue={settings.store?.city || settings.city || ''} id='city' />
          </FieldRow>
        </div>
        <div style={{ flex: 1 }}>
          <FieldRow label='State'>
            <input defaultValue={settings.store?.state || settings.state || ''} id='state' />
          </FieldRow>
        </div>
        <div style={{ width: 120 }}>
          <FieldRow label='Pincode'>
            <input defaultValue={settings.store?.pincode || settings.pincode || ''} id='pincode' />
          </FieldRow>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const payload = { store: {
            store_name: document.getElementById('store_name').value,
            store_email: document.getElementById('store_email').value,
            support_phone: document.getElementById('support_phone').value,
            gst_number: document.getElementById('gst_number').value,
            pan_number: document.getElementById('pan_number').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
          }}
          if (!window.confirm('Save Store Profile changes?')) return
          update(payload)
        }} disabled={saving}>Save Changes</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const TaxSettings = () => (
    <div>
      <FieldRow label='GST Enabled'>
        <input type='checkbox' defaultChecked={settings.tax?.gst_enabled ?? settings.gst_enabled} id='gst_enabled' />
      </FieldRow>
      <FieldRow label='GST Percentage'>
        <input type='number' step='0.01' defaultValue={(settings.tax?.gst_percentage ?? settings.gst_percentage) || 0} id='gst_percentage' />
      </FieldRow>
      <FieldRow label='Apply Tax Before Discount'>
        <input type='checkbox' defaultChecked={settings.tax?.apply_tax_before_discount ?? settings.apply_tax_before_discount} id='apply_tax_before_discount' />
      </FieldRow>
      <FieldRow label='Apply Tax After Discount'>
        <input type='checkbox' defaultChecked={settings.tax?.apply_tax_after_discount ?? settings.apply_tax_after_discount} id='apply_tax_after_discount' />
      </FieldRow>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const payload = { tax: {
            gst_enabled: document.getElementById('gst_enabled').checked,
            gst_percentage: parseFloat(document.getElementById('gst_percentage').value || 0),
            apply_tax_before_discount: document.getElementById('apply_tax_before_discount').checked,
            apply_tax_after_discount: document.getElementById('apply_tax_after_discount').checked,
          }}
          if (!window.confirm('Save Tax Settings?')) return
          update(payload)
        }} disabled={saving}>Save</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const PaymentSettings = () => (
    <div>
      <h4>Razorpay</h4>
      <FieldRow label='Enable Razorpay'>
        <input type='checkbox' defaultChecked={settings.payment_razorpay?.enabled ?? settings.razorpay_enabled} id='rp_enabled' />
      </FieldRow>
      <FieldRow label='Merchant Key'>
        <input defaultValue={(settings.payment_razorpay?.key ?? settings.razorpay_key) || ''} id='rp_key' />
      </FieldRow>
      <FieldRow label='Secret Key (hidden)'>
        <input defaultValue={''} placeholder={settings.payment_razorpay?.secret ? '••••••' : ''} id='rp_secret' />
      </FieldRow>
      <FieldRow label='Environment'>
        <select defaultValue={(settings.payment_razorpay?.env ?? settings.razorpay_env) || 'sandbox'} id='rp_env'>
          <option value='sandbox'>Sandbox</option>
          <option value='production'>Production</option>
        </select>
      </FieldRow>

      <h4>Stripe</h4>
      <FieldRow label='Enable Stripe'>
        <input type='checkbox' defaultChecked={settings.payment_stripe?.enabled ?? settings.stripe_enabled} id='st_enabled' />
      </FieldRow>
      <FieldRow label='Publishable Key'>
        <input defaultValue={(settings.payment_stripe?.key ?? settings.stripe_key) || ''} id='st_key' />
      </FieldRow>
      <FieldRow label='Secret Key (hidden)'>
        <input defaultValue={''} placeholder={settings.payment_stripe?.secret ? '••••••' : ''} id='st_secret' />
      </FieldRow>
      <FieldRow label='Environment'>
        <select defaultValue={(settings.payment_stripe?.env ?? settings.stripe_env) || 'sandbox'} id='st_env'>
          <option value='sandbox'>Sandbox</option>
          <option value='production'>Production</option>
        </select>
      </FieldRow>

      <div style={{ marginTop: 12 }}>
        <button onClick={async () => {
          const payload = { payment_razorpay: {
            enabled: document.getElementById('rp_enabled').checked,
            key: document.getElementById('rp_key').value || null,
            secret: document.getElementById('rp_secret').value || null,
            env: document.getElementById('rp_env').value,
          }, payment_stripe: {
            enabled: document.getElementById('st_enabled').checked,
            key: document.getElementById('st_key').value || null,
            secret: document.getElementById('st_secret').value || null,
            env: document.getElementById('st_env').value,
          }, cod_enabled: settings.cod_enabled, upi_enabled: settings.upi_enabled }
          if (!window.confirm('Save Payment Settings?')) return
          update(payload)
        }} disabled={saving}>Save</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const DeliverySettings = () => (
    <div>
      <FieldRow label='Free Delivery Above ₹'>
        <input type='number' step='0.01' defaultValue={(settings.delivery?.free_delivery_above ?? settings.free_delivery_above) || 0} id='free_delivery_above' />
      </FieldRow>
      <FieldRow label='Default Delivery Charge'>
        <input type='number' step='0.01' defaultValue={(settings.delivery?.default_delivery_charge ?? settings.default_delivery_charge) || 0} id='default_delivery_charge' />
      </FieldRow>
      <FieldRow label='Express Delivery Charge'>
        <input type='number' step='0.01' defaultValue={(settings.delivery?.express_delivery_charge ?? settings.express_delivery_charge) || 0} id='express_delivery_charge' />
      </FieldRow>
      <FieldRow label='Estimated Delivery Days'>
        <input type='number' defaultValue={(settings.delivery?.estimated_delivery_days ?? settings.estimated_delivery_days) || 3} id='estimated_delivery_days' />
      </FieldRow>
      <FieldRow label='Enable Same Day Delivery'>
        <input type='checkbox' defaultChecked={settings.delivery?.enable_same_day_delivery ?? settings.enable_same_day_delivery} id='enable_same_day_delivery' />
      </FieldRow>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const payload = { delivery: {
            free_delivery_above: parseFloat(document.getElementById('free_delivery_above').value || 0),
            default_delivery_charge: parseFloat(document.getElementById('default_delivery_charge').value || 0),
            express_delivery_charge: parseFloat(document.getElementById('express_delivery_charge').value || 0),
            estimated_delivery_days: parseInt(document.getElementById('estimated_delivery_days').value || 3),
            enable_same_day_delivery: document.getElementById('enable_same_day_delivery').checked,
          }}
          if (!window.confirm('Save Delivery Settings?')) return
          update(payload)
        }} disabled={saving}>Save</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const Notifications = () => (
    <div>
      <FieldRow label='SMS Notifications'>
        <input type='checkbox' defaultChecked={settings.notification?.sms ?? settings.notify_sms} id='notify_sms' />
      </FieldRow>
      <FieldRow label='Email Notifications'>
        <input type='checkbox' defaultChecked={settings.notification?.email ?? settings.notify_email} id='notify_email' />
      </FieldRow>
      <FieldRow label='Push Notifications'>
        <input type='checkbox' defaultChecked={settings.notification?.push ?? settings.notify_push} id='notify_push' />
      </FieldRow>
      <FieldRow label='Order Updates'>
        <input type='checkbox' defaultChecked={settings.notification?.order_updates ?? settings.notify_order_updates} id='notify_order_updates' />
      </FieldRow>
      <FieldRow label='Promotional Notifications'>
        <input type='checkbox' defaultChecked={settings.notification?.promotional ?? settings.notify_promotional} id='notify_promotional' />
      </FieldRow>
      <FieldRow label='Prescription Notifications'>
        <input type='checkbox' defaultChecked={settings.notification?.prescription ?? settings.notify_prescription} id='notify_prescription' />
      </FieldRow>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const payload = { notification: {
            sms: document.getElementById('notify_sms').checked,
            email: document.getElementById('notify_email').checked,
            push: document.getElementById('notify_push').checked,
            order_updates: document.getElementById('notify_order_updates').checked,
            promotional: document.getElementById('notify_promotional').checked,
            prescription: document.getElementById('notify_prescription').checked,
          }}
          if (!window.confirm('Save Notification Settings?')) return
          update(payload)
        }} disabled={saving}>Save</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const Inventory = () => (
    <div>
      <FieldRow label='Low Stock Threshold'>
        <input type='number' defaultValue={(settings.inventory?.low_stock_threshold ?? settings.low_stock_threshold) || 5} id='low_stock_threshold' />
      </FieldRow>
      <FieldRow label='Auto Hide Out of Stock Products'>
        <input type='checkbox' defaultChecked={settings.inventory?.auto_hide_oos ?? settings.auto_hide_oos} id='auto_hide_oos' />
      </FieldRow>
      <FieldRow label='Allow Back Orders'>
        <input type='checkbox' defaultChecked={settings.inventory?.allow_back_orders ?? settings.allow_back_orders} id='allow_back_orders' />
      </FieldRow>
      <FieldRow label='Enable Stock Alerts'>
        <input type='checkbox' defaultChecked={settings.inventory?.enable_stock_alerts ?? settings.enable_stock_alerts} id='enable_stock_alerts' />
      </FieldRow>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const payload = { inventory: {
            low_stock_threshold: parseInt(document.getElementById('low_stock_threshold').value || 5),
            auto_hide_oos: document.getElementById('auto_hide_oos').checked,
            allow_back_orders: document.getElementById('allow_back_orders').checked,
            enable_stock_alerts: document.getElementById('enable_stock_alerts').checked,
          }}
          if (!window.confirm('Save Inventory Settings?')) return
          update(payload)
        }} disabled={saving}>Save</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const Orders = () => (
    <div>
      <FieldRow label='Auto Cancel Pending Orders After (Hours)'>
        <input type='number' defaultValue={(settings.order?.auto_cancel_hours ?? settings.auto_cancel_hours) || 48} id='auto_cancel_hours' />
      </FieldRow>
      <FieldRow label='Allow Order Cancellation'>
        <input type='checkbox' defaultChecked={settings.order?.allow_order_cancellation ?? settings.allow_order_cancellation} id='allow_order_cancellation' />
      </FieldRow>
      <FieldRow label='Allow Return Requests'>
        <input type='checkbox' defaultChecked={settings.order?.allow_return_requests ?? settings.allow_return_requests} id='allow_return_requests' />
      </FieldRow>
      <FieldRow label='Return Window (Days)'>
        <input type='number' defaultValue={(settings.order?.return_window_days ?? settings.return_window_days) || 7} id='return_window_days' />
      </FieldRow>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const payload = { order: {
            auto_cancel_hours: parseInt(document.getElementById('auto_cancel_hours').value || 48),
            allow_order_cancellation: document.getElementById('allow_order_cancellation').checked,
            allow_return_requests: document.getElementById('allow_return_requests').checked,
            return_window_days: parseInt(document.getElementById('return_window_days').value || 7),
          }}
          if (!window.confirm('Save Order Settings?')) return
          update(payload)
        }} disabled={saving}>Save</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const Prescriptions = () => (
    <div>
      <FieldRow label='Prescription Mandatory for RX Medicines'>
        <input type='checkbox' defaultChecked={settings.prescription?.prescription_mandatory ?? settings.prescription_mandatory} id='prescription_mandatory' />
      </FieldRow>
      <FieldRow label='Auto Approve Low-Risk Medicines'>
        <input type='checkbox' defaultChecked={settings.prescription?.auto_approve_low_risk ?? settings.auto_approve_low_risk} id='auto_approve_low_risk' />
      </FieldRow>
      <FieldRow label='Maximum Upload Size (MB)'>
        <input type='number' defaultValue={(settings.prescription?.max_upload_size_mb ?? settings.max_upload_size_mb) || 5} id='max_upload_size_mb' />
      </FieldRow>
      <FieldRow label='Allowed File Types (comma separated)'>
        <input defaultValue={(settings.prescription?.allowed_file_types ?? settings.allowed_file_types) || 'jpg,jpeg,png,pdf'} id='allowed_file_types' />
      </FieldRow>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const payload = { prescription: {
            prescription_mandatory: document.getElementById('prescription_mandatory').checked,
            auto_approve_low_risk: document.getElementById('auto_approve_low_risk').checked,
            max_upload_size_mb: parseInt(document.getElementById('max_upload_size_mb').value || 5),
            allowed_file_types: document.getElementById('allowed_file_types').value,
          }}
          if (!window.confirm('Save Prescription Settings?')) return
          update(payload)
        }} disabled={saving}>Save</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const Security = () => (
    <div>
      <FieldRow label='Session Timeout (minutes)'>
        <input type='number' defaultValue={(settings.security?.session_timeout_minutes ?? settings.session_timeout_minutes) || 1440} id='session_timeout_minutes' />
      </FieldRow>
      <FieldRow label='Password Expiry Days'>
        <input type='number' defaultValue={(settings.security?.password_expiry_days ?? settings.password_expiry_days) || 90} id='password_expiry_days' />
      </FieldRow>
      <FieldRow label='Two Factor Authentication'>
        <input type='checkbox' defaultChecked={settings.security?.two_factor_enabled ?? settings.two_factor_enabled} id='two_factor_enabled' />
      </FieldRow>
      <FieldRow label='Maximum Login Attempts'>
        <input type='number' defaultValue={(settings.security?.max_login_attempts ?? settings.max_login_attempts) || 5} id='max_login_attempts' />
      </FieldRow>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const payload = { security: {
            session_timeout_minutes: parseInt(document.getElementById('session_timeout_minutes').value || 1440),
            password_expiry_days: parseInt(document.getElementById('password_expiry_days').value || 90),
            two_factor_enabled: document.getElementById('two_factor_enabled').checked,
            max_login_attempts: parseInt(document.getElementById('max_login_attempts').value || 5),
          }}
          if (!window.confirm('Save Security Settings?')) return
          update(payload)
        }} disabled={saving}>Save</button>
        <button style={{ marginLeft: 8 }} onClick={fetch}>Reset</button>
      </div>
    </div>
  )

  const Backup = () => (
    <div>
      <p>Backup and Restore operations are sensitive. Use server tools or contact ops.</p>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => alert('Backup started (placeholder)')}>Backup Database</button>
        <button style={{ marginLeft: 8 }} onClick={() => alert('Restore flow (placeholder)')}>Restore Database</button>
        <button style={{ marginLeft: 8 }} onClick={() => alert('Export settings (placeholder)')}>Export Settings</button>
        <button style={{ marginLeft: 8 }} onClick={() => alert('Import settings (placeholder)')}>Import Settings</button>
      </div>
    </div>
  )

  const renderActive = () => {
    switch (active) {
      case 'Store Profile':
        return <StoreProfile />
      case 'Tax Settings':
        return <TaxSettings />
      case 'Payment Settings':
        return <PaymentSettings />
      case 'Delivery Settings':
        return <DeliverySettings />
      case 'Notifications':
        return <Notifications />
      case 'Inventory':
        return <Inventory />
      case 'Orders':
        return <Orders />
      case 'Prescriptions':
        return <Prescriptions />
      case 'Security':
        return <Security />
      case 'Backup':
        return <Backup />
      default:
        return null
    }
  }

  return (
    <div className='admin-card' style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: 220 }}>
        <input placeholder='Search settings…' style={{ width: '100%', marginBottom: 12 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setActive(t)} style={{ textAlign: 'left', padding: '8px 12px', background: active === t ? '#eef' : 'transparent' }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h2>{active}</h2>
        <div style={{ background: '#fff', padding: 16, borderRadius: 6 }}>{renderActive()}</div>
      </div>
    </div>
  )
}
