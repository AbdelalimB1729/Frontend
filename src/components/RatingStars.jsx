import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import '../pages/Blogs.css'; // Import CSS for styling
/**
 * Affiche 5 étoiles interactives ou en lecture seule.
 *
 * Props :
 *  value    (Number)   – note actuelle (0-5)
 *  onChange (Function) – callback(nouvelleValeur)   (ignoré en readOnly)
 *  readOnly (Boolean)  – true = affichage simple
 */
export default function RatingStars({ value = 0, onChange = () => {}, readOnly = false }) {
  const [hover, setHover]       = useState(0);
  const [selected, setSelected] = useState(value);

  /* Si le parent modifie value, on se synchronise */
  useEffect(() => setSelected(value), [value]);

  const active = hover || selected;

  const click = n => {
    if (readOnly) return;
    setSelected(n);
    onChange(n);
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map(n => (
        <FaStar
          key={n}
          size={24}
          className={active >= n ? 'filled' : ''}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => click(n)}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        />
      ))}
    </div>
  );
}
