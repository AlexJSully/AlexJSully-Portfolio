'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function MeshComponent() {
	const fileUrl = '/models/fox.glb';
	const mesh = useRef<Mesh>(null!);
	const gltf = useLoader(GLTFLoader, fileUrl);

	useFrame(() => {
		mesh.current.rotation.y += 0.005;
		mesh.current.scale.set(3, 3, 3);
	});

	return (
		<mesh ref={mesh}>
			<primitive object={gltf.scene} />
		</mesh>
	);
}

export default function ModelViewer() {
	return (
		<Canvas
			id='model-viewer-canvas'
			style={{
				width: '100%',
				height: '30vh',
				margin: 'auto ',
			}}
		>
			<OrbitControls />
			<ambientLight />
			<pointLight position={[10, 10, 10]} />
			<MeshComponent />
		</Canvas>
	);
}
