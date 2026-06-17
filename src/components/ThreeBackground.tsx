import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const particleCount = 360;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 13;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.026,
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const geometry = new THREE.TorusKnotGeometry(1.25, 0.28, 160, 18);
    const material = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(2.5, 0.2, 0);
    scene.add(mesh);

    const ringGeometry = new THREE.RingGeometry(1.6, 1.62, 96);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(-2.8, -0.8, -0.3);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    let frameId = 0;

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;
      mesh.rotation.x += 0.004;
      mesh.rotation.y += 0.006;
      ring.rotation.z += 0.003;
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      geometry.dispose();
      material.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 opacity-80" aria-hidden="true" />;
};
