import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
const API_BASE='http://localhost:5000';

export default function AvgStars({ articleId }) {
  const [avg, setAvg] = useState(null);
  useEffect(()=>{
    fetch(`${API_BASE}/api/ratings?article=${articleId}`)
      .then(r=>r.json())
      .then(rs=> setAvg(rs.reduce((s,r)=>s+r.stars,0)/(rs.length||1)));
  },[articleId]);

  return avg!==null ? (
    <div className="avg-stars-small">
      {[1,2,3,4,5].map(n=> <FaStar key={n} className={n<=avg?'filled':''} size={16}/>)}
      <span>{avg.toFixed(1)}</span>
    </div>) : null;
}