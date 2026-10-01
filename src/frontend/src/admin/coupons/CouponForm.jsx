import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

export default function CouponForm({initial={}}){
  const params = useParams()
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    if(params.id){
      fetch(`/api/admin/coupons/${params.id}`).then(r=>r.json()).then(data=>setForm(data))
    }
  },[params.id])

  function handleChange(e){
    const {name, value} = e.target
    setForm(prev=>({...prev, [name]: value}))
  }

  async function save(e){
    e.preventDefault()
    setSaving(true)
    const method = form.id? 'PUT':'POST'
    const url = form.id? `/api/admin/coupons/${form.id}` : '/api/admin/coupons/'
    await fetch(url, {method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
    setSaving(false)
    window.location.href = '/admin/coupons'
  }

  return (
    <form onSubmit={save}>
      <div>
        <label>Name</label>
        <input name="name" value={form.name||''} onChange={handleChange} />
      </div>
      <div>
        <label>Code</label>
        <input name="code" value={form.code||''} onChange={handleChange} />
      </div>
      <div>
        <label>Type</label>
        <select name="coupon_type" value={form.coupon_type||'percentage'} onChange={handleChange}>
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
          <option value="free_delivery">Free Delivery</option>
        </select>
      </div>
      <div>
        <label>Discount Percentage</label>
        <input name="discount_percentage" value={form.discount_percentage||''} onChange={handleChange} />
      </div>
      <div>
        <label>Discount Amount</label>
        <input name="discount_amount" value={form.discount_amount||''} onChange={handleChange} />
      </div>
      <div>
        <button type="submit" disabled={saving}>{saving? 'Saving...':'Save'}</button>
      </div>
    </form>
  )
}
