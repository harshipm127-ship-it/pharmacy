import React, {useEffect, useState} from 'react'

export default function CouponsAnalytics(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    load()
  },[])

  async function load(){
    setLoading(true)
    try{
      const r = await fetch('/api/admin/coupons/analytics')
      const j = await r.json()
      setData(j)
    }catch(e){ setData(null) }
    setLoading(false)
  }

  if(loading) return <div>Loading analytics...</div>
  if(!data) return <div>Unable to load analytics</div>

  return (
    <div>
      <h2>Coupons Analytics</h2>
      <div style={{display:'flex', gap:20}}>
        <div>
          <strong>Total coupons</strong>
          <div>{data.total_coupons}</div>
        </div>
        <div>
          <strong>Active</strong>
          <div>{data.active_coupons}</div>
        </div>
        <div>
          <strong>Scheduled</strong>
          <div>{data.scheduled_coupons}</div>
        </div>
        <div>
          <strong>Expired</strong>
          <div>{data.expired_coupons}</div>
        </div>
        <div>
          <strong>Total redemptions</strong>
          <div>{data.total_redemptions}</div>
        </div>
        <div>
          <strong>Total discount</strong>
          <div>{data.total_discount}</div>
        </div>
      </div>

      <div style={{marginTop:20}}>
        <strong>Most used coupon</strong>
        <div>ID: {data.most_used_coupon_id} — Uses: {data.most_used_count}</div>
      </div>

      <div style={{marginTop:20}}>
        <button onClick={load}>Refresh</button>
      </div>
    </div>
  )
}
