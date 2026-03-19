import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Turtle({ isAnimating = false }: { isAnimating?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
    if (isAnimating) {
      groupRef.current.rotation.z = Math.sin(t * 3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Shell */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2ecc71" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Shell bottom */}
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.8, 16]} />
        <meshStandardMaterial color="#f5e6ca" roughness={0.6} />
      </mesh>
      {/* Shell pattern hexagons */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.4,
            0.55,
            Math.sin((angle * Math.PI) / 180) * 0.4,
          ]}
          rotation={[-0.5, 0, 0]}
        >
          <circleGeometry args={[0.18, 6]} />
          <meshStandardMaterial color="#27ae60" roughness={0.5} />
        </mesh>
      ))}
      {/* Center shell hex */}
      <mesh position={[0, 0.82, 0]} rotation={[-0.1, 0, 0]}>
        <circleGeometry args={[0.2, 6]} />
        <meshStandardMaterial color="#1a8a4a" roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.3, 0.9]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#2ecc71" roughness={0.5} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.12, 0.4, 1.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.12, 0.4, 1.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.12, 0.4, 1.17]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a3a4a" />
      </mesh>
      <mesh position={[0.12, 0.4, 1.17]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a3a4a" />
      </mesh>
      {/* Smile */}
      <mesh position={[0, 0.22, 1.15]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1a3a4a" />
      </mesh>
      {/* Flippers */}
      {[[-0.7, 0.1, 0.3], [0.7, 0.1, 0.3], [-0.5, 0.05, -0.5], [0.5, 0.05, -0.5]].map((pos, i) => (
        <mesh key={`flip-${i}`} position={pos as [number, number, number]} rotation={[0, i < 2 ? (i === 0 ? 0.5 : -0.5) : (i === 2 ? 0.3 : -0.3), 0]}>
          <capsuleGeometry args={[0.08, 0.3, 4, 8]} />
          <meshStandardMaterial color="#2ecc71" roughness={0.5} />
        </mesh>
      ))}
      {/* Tail */}
      <mesh position={[0, 0.15, -0.85]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.08, 0.25, 8]} />
        <meshStandardMaterial color="#2ecc71" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Bubbles() {
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const count = 30;

  const positions = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 4 - 1,
      speed: Math.random() * 0.5 + 0.2,
      scale: Math.random() * 0.08 + 0.02,
    }));
  }, []);

  useFrame((state) => {
    if (!bubblesRef.current) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    positions.forEach((p, i) => {
      const y = ((p.y + t * p.speed) % 4) - 2;
      dummy.position.set(
        p.x + Math.sin(t + i) * 0.1,
        y,
        p.z
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      bubblesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    bubblesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={bubblesRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={0} metalness={0.1} />
    </instancedMesh>
  );
}

function SeaFloor() {
  return (
    <group position={[0, -2.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial color="#f5e6ca" roughness={0.9} />
      </mesh>
      {/* Seaweed */}
      {[[-2, 0, -1], [-1, 0, -0.5], [1.5, 0, -1.5], [2.5, 0, -0.8], [-3, 0, -2]].map((pos, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
          <mesh position={pos as [number, number, number]}>
            <capsuleGeometry args={[0.05, 0.8 + Math.random() * 0.5, 4, 8]} />
            <MeshDistortMaterial color={i % 2 === 0 ? "#2ecc71" : "#27ae60"} speed={2} distort={0.2} />
          </mesh>
        </Float>
      ))}
      {/* Coral */}
      {[[1, 0.2, -1], [-1.5, 0.15, -1.8], [3, 0.2, -1.2]].map((pos, i) => (
        <mesh key={`coral-${i}`} position={pos as [number, number, number]}>
          <dodecahedronGeometry args={[0.25 + i * 0.05]} />
          <meshStandardMaterial color={['#ff6b6b', '#fdcfe8', '#f39c12'][i]} roughness={0.6} />
        </mesh>
      ))}
      {/* Starfish */}
      <mesh position={[0.5, 0.05, -0.3]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <torusGeometry args={[0.15, 0.05, 4, 5]} />
        <meshStandardMaterial color="#f39c12" roughness={0.7} />
      </mesh>
    </group>
  );
}

interface TurtleSceneProps {
  isAnimating?: boolean;
  height?: string;
}

const TurtleScene: React.FC<TurtleSceneProps> = ({ isAnimating = false, height = '400px' }) => {
  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 1, 4], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-3, 2, 2]} intensity={0.5} color="#05bfdb" />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Turtle isAnimating={isAnimating} />
        </Float>
        <Bubbles />
        <SeaFloor />
        <fog attach="fog" args={['#088395', 5, 15]} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default TurtleScene;
