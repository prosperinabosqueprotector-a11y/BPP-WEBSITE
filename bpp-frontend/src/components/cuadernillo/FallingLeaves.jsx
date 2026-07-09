import { useEffect, useState } from 'react';

const LEAF_COLORS = ['#C45B28', '#6B7B3A', '#D4A04A', '#8B6914', '#A0522D'];

const createLeaf = (id) => ({
  id,
  x: Math.random() * 100,
  size: 12 + Math.random() * 16,
  color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
  duration: 6 + Math.random() * 8,
  delay: Math.random() * 4,
  swayAmount: 30 + Math.random() * 50,
  rotation: Math.random() * 360,
});

export default function FallingLeaves({ count = 8 }) {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    setLeaves(Array.from({ length: count }, (_, i) => createLeaf(i)));
  }, [count]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          style={{
            position: 'absolute',
            left: `${leaf.x}%`,
            top: '-30px',
            width: leaf.size,
            height: leaf.size,
            opacity: 0.7,
            animation: `leafFall ${leaf.duration}s linear ${leaf.delay}s infinite`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={leaf.size}
            height={leaf.size}
            style={{
              transform: `rotate(${leaf.rotation}deg)`,
              animation: `leafSway ${leaf.duration * 0.6}s ease-in-out ${leaf.delay}s infinite alternate`,
            }}
          >
            <path
              d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"
              fill={leaf.color}
              stroke="none"
            />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes leafFall {
          0% {
            transform: translateY(-30px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes leafSway {
          0% {
            transform: translateX(0px) rotate(0deg);
          }
          100% {
            transform: translateX(40px) rotate(20deg);
          }
        }
      `}</style>
    </div>
  );
}
