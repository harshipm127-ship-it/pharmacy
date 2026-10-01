import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

export default function CouponDetails({id: propId}){
  const params = useParams()
  const id = propId || params.id
  const [coupon, setCoupon] = useState(null)
  useEffect(()=>{
    if(!id) return
    fetch(`/api/admin/coupons/${id}`).then(r=>r.json()).then(setCoupon)
  },[id])
  if(!coupon) return <div>Loading...</div>
  return (
    <div>
      <h2>{coupon.name} ({coupon.code})</h2>
      <p>{coupon.description}</p>
      <div>Type: {coupon.coupon_type}</div>
      <div>Discount: {coupon.coupon_type==='percentage'? coupon.discount_percentage+'%': coupon.discount_amount}</div>
      <div>Validity: {coupon.start_datetime} to {coupon.end_datetime}</div>
      <div>Usage limit: {coupon.usage_limit} per user: {coupon.usage_per_user}</div>
    </div>
  )
}
